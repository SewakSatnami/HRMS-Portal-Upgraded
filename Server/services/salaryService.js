import Salary from "../models/Salary.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";

export const calculateMonthlySalary = async (employeeId, month, year) => {
  try {
    // Get salary structure
    const salary = await Salary.findOne({ employeeId, isActive: true });
    if (!salary) {
      throw new Error('Salary structure not found for employee');
    }

    // Calculate total allowances
    const totalAllowances = salary.hra + salary.conveyance + salary.medical +
                           salary.lta + salary.otherAllowances;

    const grossSalary = salary.baseSalary + totalAllowances;

    // Get attendance for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate working days in month
    const totalDaysInMonth = endDate.getDate();

    // Count present and absent days
    const presentDays = attendanceRecords.reduce((total, record) => {
      if (record.status === 'present') return total + 1;
      if (record.status === 'half-day') return total + 0.5;
      return total;
    }, 0);

    const absentDays = attendanceRecords.filter(record =>
      record.status === 'absent'
    ).length;

    // Get approved leaves for the month
    const approvedLeaves = await Leave.find({
      employeeId,
      status: 'approved',
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { $and: [{ startDate: { $lte: startDate } }, { endDate: { $gte: endDate } }] }
      ]
    });

    // Calculate leave days in this month
    let paidLeaveDays = 0;
    let unpaidLeaveDays = 0;

    approvedLeaves.forEach(leave => {
      const leaveStart = leave.startDate > startDate ? leave.startDate : startDate;
      const leaveEnd = leave.endDate < endDate ? leave.endDate : endDate;

      const leaveDaysInMonth = Math.ceil((leaveEnd - leaveStart) / (1000 * 60 * 60 * 24)) + 1;

      const paidRatio = leave.days > 0 ? leave.paidDays / leave.days : 0;
      const paidInMonth = leaveDaysInMonth * paidRatio;

      paidLeaveDays += paidInMonth;
      unpaidLeaveDays += leaveDaysInMonth - paidInMonth;
    });

    // Calculate deductions
    const dailyRate = grossSalary / totalDaysInMonth;
    const absentDeduction = absentDays * dailyRate;
    const unpaidLeaveDeduction = unpaidLeaveDays * dailyRate;

    const totalDeductions = salary.pf + salary.professionalTax + salary.incomeTax +
                           salary.otherDeductions + absentDeduction + unpaidLeaveDeduction;

    const netSalary = grossSalary - totalDeductions;

    return {
      baseSalary: salary.baseSalary,
      allowances: {
        hra: salary.hra,
        conveyance: salary.conveyance,
        medical: salary.medical,
        lta: salary.lta,
        other: salary.otherAllowances
      },
      grossSalary,
      deductions: {
        pf: salary.pf,
        professionalTax: salary.professionalTax,
        incomeTax: salary.incomeTax,
        absentDays: absentDeduction,
        unpaidLeave: unpaidLeaveDeduction,
        other: salary.otherDeductions
      },
      totalDeductions,
      netSalary: Math.max(0, netSalary), // Ensure non-negative
      workingDays: totalDaysInMonth,
      presentDays,
      absentDays,
      paidLeaveDays,
      unpaidLeaveDays
    };
  } catch (error) {
    throw error;
  }
};
