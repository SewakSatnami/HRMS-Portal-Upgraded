import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { employeeAPI } from "../../services/api";
import "./Leave.css";

const EmployeeLeave = () => {
  const [form, setForm] = useState({
    type: "annual",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [leavesRes, balanceRes] = await Promise.allSettled([
        employeeAPI.getMyLeaves(),
        employeeAPI.getLeaveBalance()
      ]);

      if (leavesRes.status === 'fulfilled') {
        setLeaves(leavesRes.value.leaves || []);
      }

      if (balanceRes.status === 'fulfilled') {
        setLeaveBalance(balanceRes.value.leaveBalance);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      toast.error("Failed to load leave data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await employeeAPI.applyLeave(form);
      toast.success("Leave request submitted successfully!");
      setForm({ type: "annual", startDate: "", endDate: "", reason: "" });
      fetchLeaveData(); // Refresh data
    } catch (error) {
      console.error("Error applying for leave:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit leave request";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const badgeClass = (status) => {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "danger";
      case "pending": return "warning";
      default: return "secondary";
    }
  };

  const formatLeaveType = (type) => {
    switch (type) {
      case "annual": return "Annual Leave";
      case "sick": return "Sick Leave";
      case "casual": return "Casual Leave";
      case "maternity": return "Maternity Leave";
      case "paternity": return "Paternity Leave";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4 leave-page">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading leave data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 leave-page">

      {/* Header */}
      <div className="leave-header mb-4 p-4">
        <h2 className="fw-bold text-white">Leave Management</h2>
        <p className="text-white mb-0">
          Apply and track your leaves
        </p>
      </div>

      <div className="row g-4">

        {/* Apply Leave */}
        <div className="col-lg-5">
          <div className="card leave-form-card p-4">

            <h5 className="fw-bold mb-3">Apply for Leave</h5>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Leave Type</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Leave Request"
                )}
              </button>

            </form>

          </div>
        </div>

        {/* Leave Balance & History */}
        <div className="col-lg-7">

          {/* Leave Balance */}
          {leaveBalance && (
            <div className="card leave-balance-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Leave Balance</h5>
              <div className="row g-3">
                {Object.entries(leaveBalance).map(([type, balance]) => (
                  <div className="col-md-4" key={type}>
                    <div className="balance-item">
                      <h6 className="text-muted">{formatLeaveType(type)}</h6>
                      <h4 className="fw-bold text-primary">{balance}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leave History */}
          <div className="card leave-history-card p-4">
            <h5 className="fw-bold mb-3">Leave History</h5>

            <div className="leave-list">
              {leaves.length > 0 ? (
                leaves.map((leave, index) => (
                  <div key={leave._id || index} className="leave-item p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="fw-bold mb-1">{formatLeaveType(leave.type)}</h6>
                        <p className="text-muted mb-1">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                        <p className="mb-0 small">{leave.reason}</p>
                      </div>
                      <span className={`badge bg-${badgeClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center py-4">No leave requests found</p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EmployeeLeave;
