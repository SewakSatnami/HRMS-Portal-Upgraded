import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { employeeAPI } from "../../services/api";
import "./Attendance.css";

const EmployeeAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getMyAttendance();
      setAttendanceData(response.attendance || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const todayAttendance = attendanceData.find((record) => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === todayDate.getTime();
  });

  const calculateStreak = () => {
    if (!attendanceData.length) return 0;

    const sorted = [...attendanceData].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (const record of sorted) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      if (recordDate.getTime() === cursor.getTime()) {
        if (record.status === 'present') {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      } else if (recordDate.getTime() === cursor.getTime() - 86400000) {
        if (record.status === 'present') {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      } else if (recordDate.getTime() < cursor.getTime() - 86400000) {
        break;
      }
    }

    return streak;
  };

  const markAttendance = async (status) => {
    try {
      setActionLoading(true);
      const response = await employeeAPI.markAttendance({
        status,
        date: new Date().toISOString()
      });

      setAttendanceData((prev) => [response.attendance, ...prev]);
      toast.success(`Attendance marked ${status} successfully`);
    } catch (error) {
      console.error("Error marking attendance:", error);
      const errorMessage = error.response?.data?.message || "Failed to mark attendance";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredData =
    filter === "All"
      ? attendanceData
      : attendanceData.filter((record) => record.status === filter.toLowerCase());

  const badgeClass = (status) => {
    switch (status) {
      case "present": return "success";
      case "absent": return "danger";
      case "half-day": return "warning";
      case "leave": return "info";
      default: return "secondary";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "present": return "Present";
      case "absent": return "Absent";
      case "half-day": return "Half Day";
      case "leave": return "Leave";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4 attendance-page">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 attendance-page">

      {/* Header */}
      <div className="attendance-header mb-4 p-4">
        <h2 className="fw-bold text-white">Attendance</h2>
        <p className="text-white mb-0">
          Track your performance & presence
        </p>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        {[
          {
            title: "Total Days",
            value: attendanceData.length,
            icon: "bi-calendar",
            color: "primary"
          },
          {
            title: "Present",
            value: attendanceData.filter(r => r.status === 'present').length,
            icon: "bi-check-circle",
            color: "success"
          },
          {
            title: "Absent",
            value: attendanceData.filter(r => r.status === 'absent').length,
            icon: "bi-x-circle",
            color: "danger"
          },
          {
            title: "Attendance %",
            value: attendanceData.length > 0
              ? Math.round((attendanceData.filter(r => r.status === 'present').length / attendanceData.length) * 100)
              : 0,
            icon: "bi-percent",
            color: "info"
          }
        ].map((stat, index) => (
          <div className="col-md-3" key={index}>
            <div className="card stat-card p-3">
              <div className="d-flex align-items-center">
                <div className={`icon-box bg-${stat.color} me-3`}>
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">{stat.value}{stat.title === "Attendance %" ? "%" : ""}</h4>
                  <p className="text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Today's attendance actions */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card attendance-action-card p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <h5 className="mb-2">Today's Attendance</h5>
                {todayAttendance ? (
                  <p className="mb-2">
                    Already marked as{' '}
                    <span className={`badge bg-${badgeClass(todayAttendance.status)}`}>
                      {formatStatus(todayAttendance.status)}
                    </span>
                  </p>
                ) : (
                  <p className="mb-2 text-muted">
                    Select a status below to mark your attendance for today.
                  </p>
                )}
                <p className="text-muted mb-0">
                  Current streak: <strong>{calculateStreak()}</strong> day(s)
                </p>
              </div>
              {!todayAttendance && (
                <div className="attendance-action-buttons d-flex flex-wrap gap-2">
                  {['present', 'half-day', 'leave', 'absent'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`btn btn-${status === 'present' ? 'success' : status === 'absent' ? 'danger' : status === 'leave' ? 'info' : 'warning'} btn-sm`}
                      onClick={() => markAttendance(status)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : formatStatus(status)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {["All", "Present", "Absent", "Leave", "Half-day"].map((item) => (
          <button
            key={item}
            className={`filter-btn ${
              filter === item ? "active-filter" : ""
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card attendance-table p-3">
        <div className="table-responsive">
          <table className="table align-middle">

            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Info</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record, index) => (
                  <tr key={record._id || index} className="table-row">

                    <td>{new Date(record.date).toLocaleDateString()}</td>

                    <td>
                      <span className={`badge bg-${badgeClass(record.status)}`}>
                        {formatStatus(record.status)}
                      </span>
                    </td>

                    <td>
                      <i
                        className="bi bi-eye text-primary fs-5"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelected(record)}
                      ></i>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Attendance Details</h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelected(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p><strong>Date:</strong> {new Date(selected.date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {formatStatus(selected.status)}</p>
                  {selected.checkIn && (
                    <p><strong>Check-in:</strong> {new Date(selected.checkIn).toLocaleTimeString()}</p>
                  )}
                  {selected.checkOut && (
                    <p><strong>Check-out:</strong> {new Date(selected.checkOut).toLocaleTimeString()}</p>
                  )}
                  {selected.remarks && (
                    <p><strong>Remarks:</strong> {selected.remarks}</p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </div>
  );
};

export default EmployeeAttendance;