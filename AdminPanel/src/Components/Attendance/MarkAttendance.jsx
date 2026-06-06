import React, { useEffect, useState } from "react";
import "./MarkAttendance.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminAPI } from "../../services/api";

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    remarks: "",
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await adminAPI.getAllEmployees({ limit: 200 });
        setEmployees(data.employees || []);
      } catch (error) {
        const serverMessage = error.response?.data?.message || error.response?.data || error.message;
        toast.error(serverMessage || "Failed to load employees");
      }
    };

    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const name = (employee.userId?.name || "").toLowerCase();
    const employeeId = (employee.employeeId || "").toLowerCase();
    const department = (employee.department || "").toLowerCase();
    const search = searchTerm.toLowerCase().trim();
    return (
      !search ||
      name.includes(search) ||
      employeeId.includes(search) ||
      department.includes(search)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendance({ ...attendance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendance.employeeId) {
      toast.error("Please select an employee");
      return;
    }

    try {
      setLoading(true);
      await adminAPI.markAttendance(attendance);
      toast.success("Attendance marked successfully!");
      setAttendance({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        status: "present",
        remarks: "",
      });
      setSearchTerm("");
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      toast.error(serverMessage || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="attendance-wrapper animate-card">
        <div className="header fade-in">
          <h2>Mark Attendance</h2>
          <p>Search employees and record attendance with a clean admin workflow.</p>
        </div>

        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="grid">
            <div className="input-group slide-up">
              <label>Search employee</label>
              <input
                type="text"
                placeholder="Search by name, employee ID, or department"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="input-group slide-up delay-1">
              <label>Employee</label>
              <select
                name="employeeId"
                value={attendance.employeeId}
                onChange={handleChange}
              >
                <option value="">Select employee</option>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.userId?.name || employee.employeeId} - {employee.employeeId} - {employee.department}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No employee found matching your search
                  </option>
                )}
              </select>
            </div>

            <div className="input-group slide-up delay-2">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={attendance.date}
                onChange={handleChange}
              />
            </div>

            <div className="input-group full-width slide-up delay-3">
              <label>Status</label>
              <div className="status-buttons">
                {[
                  ["present", "Present"],
                  ["absent", "Absent"],
                  ["half-day", "Half Day"],
                  ["leave", "Leave"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`status-btn ${
                      attendance.status === value ? "active" : ""
                    }`}
                    onClick={() => setAttendance({ ...attendance, status: value })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group full-width slide-up delay-4">
              <label>Remarks</label>
              <textarea
                name="remarks"
                placeholder="Add remarks (optional)"
                value={attendance.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn pulse" disabled={loading}>
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendance;
