import React, { useEffect, useState } from "react";
import "./LeaveRequest.css";
import { adminAPI } from "../../services/api";

const LeaveRequest = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllLeaveRequests({ limit: 100 });
      setRequests(data.leaves || []);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.approveLeave(id, { status });
      await fetchRequests();
    } catch (error) {
      setMessage(error.response?.data?.message || `Failed to ${status} leave`);
    }
  };

  const employeeName = (request) =>
    request.employeeId?.userId?.name || request.employeeId?.employeeId || "Employee";

  const filteredRequests = requests.filter((request) =>
    employeeName(request).toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status) =>
    status === "approved"
      ? "bg-success"
      : status === "rejected"
        ? "bg-danger"
        : "bg-warning text-dark";

  return (
    <div className="container mt-4 mt-md-5 fade-in">
      <div className="card custom-card p-3 p-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <h4 className="gradient-text m-0">
            <i className="bi bi-clipboard-check me-2"></i>
            Leave Requests
          </h4>
          <span className="badge bg-primary px-3 py-2 align-self-start align-self-md-auto">
            {filteredRequests.length} Requests
          </span>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Search by employee..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        <div className="table-responsive">
          <table className="table custom-table text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-muted py-4">Loading requests...</td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request, index) => (
                  <tr key={request._id} className="table-row">
                    <td>{index + 1}</td>
                    <td>
                      <i className="bi bi-person me-1"></i>
                      {employeeName(request)}
                    </td>
                    <td>{request.type}</td>
                    <td>{new Date(request.startDate).toLocaleDateString()}</td>
                    <td>{new Date(request.endDate).toLocaleDateString()}</td>
                    <td>
                      {request.days}
                      <small className="d-block text-muted">
                        Paid {request.paidDays || 0}, Unpaid {request.unpaidDays || 0}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateStatus(request._id, "approved")}
                        disabled={request.status === "approved"}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(request._id, "rejected")}
                        disabled={request.status === "rejected"}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-muted py-4">
                    <i className="bi bi-inbox me-2"></i>
                    No Requests Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
