import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminAPI } from "../../services/api";
import "./ApplyLeave.css";

const today = new Date().toISOString().split("T")[0];

const ApplyLeave = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    type: "annual",
    startDate: today,
    endDate: today,
    reason: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await adminAPI.getAllEmployees({ limit: 200 });
        setEmployees(data.employees || []);
      } catch (error) {
        // handle both JSON {message: '...'} and plain text responses
        const serverMessage = error.response?.data?.message || error.response?.data || error.message;
        toast.error(serverMessage || "Unable to load employees");
      }
    };

    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const name = (employee.userId?.name || "").toLowerCase();
    const employeeId = (employee.employeeId || "").toLowerCase();
    const department = (employee.department || "").toLowerCase();
    const searchLower = search.toLowerCase().trim();
    return (
      !searchLower ||
      name.includes(searchLower) ||
      employeeId.includes(searchLower) ||
      department.includes(searchLower)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employeeId) {
      toast.error("Please choose an employee to apply leave for");
      return;
    }

    if (!form.reason.trim()) {
      toast.error("Please provide a reason for the leave request");
      return;
    }

    try {
      setLoading(true);
      await adminAPI.applyLeave(form);
      toast.success("Leave applied successfully for the selected employee");
      setForm({ ...form, reason: "" });
      setMessage("Leave request created successfully. It will appear in leave requests for approval.");
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      toast.error(serverMessage || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 fade-in">
      <div className="card custom-card p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-2">
          <div>
            <h4 className="gradient-text m-0">Apply Leave</h4>
            <p className="text-muted mb-0">Use this form to create a leave request for any employee.</p>
          </div>
          <span className="badge bg-primary px-3 py-2">Admin access</span>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit} className="leave-form">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Search Employee</label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Search by name, employee ID, or department"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Employee</label>
              <select
                name="employeeId"
                className="form-select custom-input"
                value={form.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">Select employee</option>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.userId?.name || employee.employeeId} — {employee.employeeId} ({employee.department})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No matching employees found
                  </option>
                )}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Leave Type</label>
              <select
                name="type"
                className="form-select custom-input"
                value={form.type}
                onChange={handleChange}
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control custom-input"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-control custom-input"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea
                className="form-control custom-input"
                name="reason"
                rows="4"
                placeholder="Enter the reason for the leave request"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gradient mt-4 w-100" disabled={loading}>
            {loading ? "Applying leave..." : "Apply Leave for Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
