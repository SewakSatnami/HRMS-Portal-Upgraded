import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

const getValue = (result, fallback) =>
  result.status === "fulfilled" ? result.value : fallback;

const formatDateKey = (date) => date.toISOString().split("T")[0];

const buildAttendanceTrend = (today, results, days = 7) => {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const current = new Date(today);
    current.setDate(current.getDate() - i);
    const key = formatDateKey(current);
    const record = results.find((item) => item._id === key);
    trend.push({
      date: key,
      label: current.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
      present: record?.present || 0,
      absent: record?.absent || 0,
      leave: record?.leave || 0
    });
  }
  return trend;
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const upcomingWindowEnd = new Date(today);
    upcomingWindowEnd.setDate(upcomingWindowEnd.getDate() + 7);

    const results = await Promise.allSettled([
      Employee.countDocuments(),
      Employee.countDocuments({ createdAt: { $gte: monthStart } }),
      Employee.distinct("department"),
      Attendance.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ["present", "half-day"] }
      }),
      Leave.countDocuments({
        status: "approved",
        startDate: { $lte: tomorrow },
        endDate: { $gte: today }
      }),
      Leave.countDocuments({ status: "pending" }),
      Salary.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $add: [
                  "$baseSalary",
                  "$hra",
                  "$conveyance",
                  "$medical",
                  "$lta",
                  "$otherAllowances"
                ]
              }
            }
          }
        }
      ]),
      Employee.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
      Leave.find()
        .populate({
          path: "employeeId",
          select: "employeeId department designation userId",
          populate: { path: "userId", select: "name email" }
        })
        .sort({ createdAt: -1 })
        .limit(5),
      Attendance.aggregate([
        {
          $match: {
            date: { $gte: sevenDaysAgo, $lt: tomorrow }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            present: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["present", "half-day"]] },
                  1,
                  0
                ]
              }
            },
            absent: {
              $sum: {
                $cond: [{ $eq: ["$status", "absent"] }, 1, 0]
              }
            },
            leave: {
              $sum: {
                $cond: [{ $eq: ["$status", "leave"] }, 1, 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Attendance.aggregate([
        {
          $match: {
            date: { $gte: thirtyDaysAgo, $lt: tomorrow },
            status: { $in: ["absent", "leave"] }
          }
        },
        {
          $group: {
            _id: "$employeeId",
            absenceCount: { $sum: 1 }
          }
        },
        { $sort: { absenceCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "employees",
            localField: "_id",
            foreignField: "_id",
            as: "employee"
          }
        },
        { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "employee.userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            absenceCount: 1,
            name: "$user.name",
            employeeId: "$employee.employeeId",
            department: "$employee.department",
            designation: "$employee.designation"
          }
        }
      ]),
      Salary.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: "employees",
            localField: "employeeId",
            foreignField: "_id",
            as: "employee"
          }
        },
        { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$employee.department",
            totalSalary: {
              $sum: {
                $add: [
                  "$baseSalary",
                  "$hra",
                  "$conveyance",
                  "$medical",
                  "$lta",
                  "$otherAllowances"
                ]
              }
            },
            employees: { $sum: 1 }
          }
        },
        { $sort: { totalSalary: -1 } },
        { $limit: 5 }
      ]),
      Leave.countDocuments({
        status: "approved",
        startDate: { $lte: upcomingWindowEnd },
        endDate: { $gte: today }
      }),
      Leave.countDocuments({
        status: "pending",
        startDate: { $lte: upcomingWindowEnd },
        endDate: { $gte: today }
      })
    ]);

    const [
      totalEmployees,
      newEmployeesThisMonth,
      departments,
      presentToday,
      onLeaveToday,
      pendingLeaves,
      salaryLiability,
      recentEmployees,
      recentLeaveRequests,
      attendanceTrendResults,
      topAbsentEmployees,
      topExpenseDepartments,
      upcomingApprovedLeaves,
      upcomingPendingLeaves
    ] = [
      getValue(results[0], 0),
      getValue(results[1], 0),
      getValue(results[2], []),
      getValue(results[3], 0),
      getValue(results[4], 0),
      getValue(results[5], 0),
      getValue(results[6], []),
      getValue(results[7], []),
      getValue(results[8], []),
      getValue(results[9], []),
      getValue(results[10], []),
      getValue(results[11], []),
      getValue(results[12], 0),
      getValue(results[13], 0)
    ];

    const attendanceTrend = buildAttendanceTrend(today, attendanceTrendResults || []);
    const leaveForecast = {
      upcomingApprovedLeaves,
      upcomingPendingLeaves,
      projectedLoad: upcomingApprovedLeaves + Math.ceil(upcomingPendingLeaves * 0.4),
      risk:
        totalEmployees && upcomingApprovedLeaves + upcomingPendingLeaves > totalEmployees * 0.15
          ? "High"
          : "Normal"
    };

    const weeklyAttendanceRate = totalEmployees
      ? Math.round((presentToday / totalEmployees) * 100)
      : 0;

    const insightPhrases = [];
    if (weeklyAttendanceRate < 65) {
      insightPhrases.push(
        `Attendance is soft today: only ${weeklyAttendanceRate}% of employees are present.`
      );
    } else {
      insightPhrases.push(`Good attendance today: ${weeklyAttendanceRate}% of employees are present.`);
    }

    if (pendingLeaves > 8) {
      insightPhrases.push(`There are ${pendingLeaves} pending leave requests waiting for approval.`);
    }

    if (leaveForecast.projectedLoad > 8) {
      insightPhrases.push(
        `Leave load is rising: around ${leaveForecast.projectedLoad} staff may be on leave during the next 7 days.`
      );
    }

    if (topAbsentEmployees?.length) {
      const topAbsent = topAbsentEmployees[0];
      insightPhrases.push(
        `${topAbsent.name || topAbsent.employeeId} has the highest absence count with ${topAbsent.absenceCount} missed days in the last 30 days.`
      );
    }

    if (topExpenseDepartments?.length) {
      const topDept = topExpenseDepartments[0];
      insightPhrases.push(
        `${topDept._id} is the highest payroll cost center with ${topDept.employees} employees.`
      );
    }

    res.json({
      stats: {
        totalEmployees,
        newEmployeesThisMonth,
        departments: departments.length,
        presentToday,
        onLeaveToday,
        pendingLeaves,
        monthlySalaryLiability: salaryLiability[0]?.total || 0,
        weeklyAttendanceRate
      },
      attendanceTrend,
      leaveForecast,
      topAbsentEmployees,
      topExpenseDepartments,
      insights: insightPhrases,
      recentEmployees,
      recentLeaveRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
