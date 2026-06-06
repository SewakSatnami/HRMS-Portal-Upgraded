import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

export const updateLeaveBalance = async (employeeId, leaveType, days) => {
  try {
    const employee = await Employee.findOne({ _id: employeeId });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Update leave balance
    if (employee.leaveBalance[leaveType] !== undefined) {
      employee.leaveBalance[leaveType] = Math.max(0, employee.leaveBalance[leaveType] - days);
      await employee.save();
    }

    return employee.leaveBalance;
  } catch (error) {
    throw error;
  }
};

export const checkLeaveEligibility = async (employeeId, leaveType, requestedDays) => {
  try {
    const employee = await Employee.findOne({ _id: employeeId });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const availableBalance = employee.leaveBalance[leaveType] || 0;
    const isTrackedPaidLeave = employee.leaveBalance[leaveType] !== undefined;
    const paidDays = isTrackedPaidLeave ? Math.min(availableBalance, requestedDays) : 0;
    const unpaidDays = Math.max(0, requestedDays - paidDays);

    return {
      eligible: true,
      availableBalance,
      requestedDays,
      paidDays,
      unpaidDays
    };
  } catch (error) {
    throw error;
  }
};

export const getLeaveSummary = async (employeeId) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const leaves = await Leave.find({
      employeeId,
      createdAt: { $gte: startOfYear, $lte: endOfYear }
    });

    const summary = {
      annual: { used: 0, pending: 0, approved: 0 },
      sick: { used: 0, pending: 0, approved: 0 },
      casual: { used: 0, pending: 0, approved: 0 }
    };

    leaves.forEach(leave => {
      if (summary[leave.type]) {
        if (leave.status === 'approved') {
          summary[leave.type].approved += leave.days;
          summary[leave.type].used += leave.days;
        } else if (leave.status === 'pending') {
          summary[leave.type].pending += leave.days;
        }
      }
    });

    return summary;
  } catch (error) {
    throw error;
  }
};
