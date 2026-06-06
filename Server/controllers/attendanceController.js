import { validationResult } from "express-validator";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const markAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId, date, status, checkIn, checkOut, remarks } = req.body;

    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if attendance already marked for this date
    const attendanceDate = startOfDay(date);

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: attendanceDate
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for this date" });
    }

    // Calculate hours worked if checkIn and checkOut provided
    let hoursWorked = 0;
    if (checkIn && checkOut) {
      const checkInTime = new Date(checkIn);
      const checkOutTime = new Date(checkOut);
      hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert to hours
    }

    const attendance = new Attendance({
      employeeId,
      date: attendanceDate,
      status,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      hoursWorked,
      remarks
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMyAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, status, checkIn, checkOut, remarks } = req.body;
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const attendanceDate = startOfDay(date || new Date());
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: attendanceDate
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for this date" });
    }

    let hoursWorked = 0;
    if (checkIn && checkOut) {
      const checkInTime = new Date(checkIn);
      const checkOutTime = new Date(checkOut);
      hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    }

    const attendance = new Attendance({
      employeeId: employee._id,
      date: attendanceDate,
      status,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      hoursWorked,
      remarks
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { employeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { employeeId: employee._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({
      message: "Attendance updated successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      leave: attendance.filter(a => a.status === 'leave').length,
      totalHours: attendance.reduce((sum, a) => sum + a.hoursWorked, 0)
    };

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
