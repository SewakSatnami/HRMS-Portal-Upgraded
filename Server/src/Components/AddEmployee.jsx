
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "bootstrap/dist/css/bootstrap.min.css";

const AddEmployee = () => {
  const [values, setValues] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    address: "",
    city: "",
    state: "",
    country: "",
    department: "",
    designation: "",
    employmentType: "",
    employeeRole: "",

    joiningDate: "",
    salary: "",
    bankName: "",
    ifscCode: "",

    bankAccountNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    workLocation: "",
    probationEndDate: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const res = await axios.post(
      "http://localhost:5000/api/employee/add",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage(res.data.message || "✅ Employee added successfully!");

    setTimeout(() => {
      navigate("/dashboard/all-employees");
    }, 1000);

  } catch (err) {
    console.error("Error adding employee:", err);
    if (err.response) setMessage(`❌ ${err.response.data.message}`);
    else setMessage("⚠️ Server not responding. Please try again.");
  }
};

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #007bff, #00b4d8)",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ width: "100%", backgroundColor: "#fff" }}
      >
        {/* Header */}
        <div
          className="text-center text-white py-3 rounded-3 mb-4"
          style={{
            background: "linear-gradient(135deg, #007bff, #00b4d8)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          }}
        >
          <h4 className="fw-bold mb-0">👤 Add New Employee</h4>
          <small className="text-light">Enter employee details below</small>
        </div>  

        {/* Alert Message */}
        {message && (
          <div
            className={`alert ${message.includes("✅")
              ? "alert-success"
              : message.includes("⚠️")
                ? "alert-warning"
                : "alert-danger"
              } text-center shadow-sm py-2`}
          >
            {message}
          </div>
        )}

        {/* Employee Form */}
        <form onSubmit={handleSubmit} className="px-1">

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    accept="image/*"
                    onChange={(e) =>
                      setValues({ ...values, profileImage: e.target.files[0] })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col"> <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  employeeId
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm rounded-3 shadow-sm p-2"
                  placeholder="Enter Employee Id"
                  value={values.employeeId}
                  onChange={(e) => setValues({ ...values, employeeId: e.target.value })}
                  required
                />
              </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter full name"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">
                    Phone No.
                  </label>
                  <input
                    type="tel"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your Number"
                    value={values.phone}
                    onChange={(e) => setValues({ ...values, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Date Of Birth
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your Date of Birth"
                    value={values.dateOfBirth}
                    onChange={(e) => setValues({ ...values, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Gender
                  </label>

                  <select
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    value={values.gender}
                    onChange={(e) => setValues({ ...values, gender: e.target.value })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Marital Status
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your MaritalStatus"
                    value={values.maritalStatus}
                    onChange={(e) => setValues({ ...values, maritalStatus: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Address
                  </label>
                  <input
                    type="textarea"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your Address"
                    value={values.address}
                    onChange={(e) => setValues({ ...values, address: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your City"
                    value={values.city}
                    onChange={(e) => setValues({ ...values, city: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your State"
                    value={values.state}
                    onChange={(e) => setValues({ ...values, state: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your Country"
                    value={values.country}
                    onChange={(e) => setValues({ ...values, country: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Department
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your Department"
                    value={values.department}
                    onChange={(e) => setValues({ ...values, department: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Designation
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your Designation"
                    value={values.designation}
                    onChange={(e) => setValues({ ...values, designation: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your EmploymentType"
                    value={values.employmentType}
                    onChange={(e) => setValues({ ...values, employmentType: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Employee Role
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your EmployeeRole"
                    value={values.employeeRole}
                    onChange={(e) => setValues({ ...values, employeeRole: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your JoiningDate"
                    value={values.joiningDate}
                    onChange={(e) => setValues({ ...values, joiningDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter salary amount"
                    value={values.salary}
                    onChange={(e) => setValues({ ...values, salary: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter salary  BankName"
                    value={values.bankName}
                    onChange={(e) => setValues({ ...values, bankName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Bank Account Number
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your BankAccountNumber"
                    value={values.bankAccountNumber}
                    onChange={(e) => setValues({ ...values, bankAccountNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your IFSC Code"
                    value={values.ifscCode}
                    onChange={(e) => setValues({ ...values, ifscCode: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your EmergencyContactName"
                    value={values.emergencyContactName}
                    onChange={(e) => setValues({ ...values, emergencyContactName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your EmergencyContactPhone"
                    value={values.emergencyContactPhone}
                    onChange={(e) => setValues({ ...values, emergencyContactPhone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Emergency Contact Relation
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your ManagerId"
                    value={values.emergencyContactRelation}
                    onChange={(e) => setValues({ ...values, emergencyContactRelation: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    Work Location
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your WorkLocation"
                    value={values.workLocation}
                    onChange={(e) => setValues({ ...values, workLocation: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">
                    ProbationEndDate
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm rounded-3 shadow-sm p-2"
                    placeholder="Enter Your ProbationEndDate"
                    value={values.probationEndDate}
                    onChange={(e) => setValues({ ...values, probationEndDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col">

              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold shadow-sm rounded-3 py-2"
            style={{
              background: "linear-gradient(135deg, #007bff, #00b4d8)",
              border: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #00b4d8, #007bff)")
            }
            onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #007bff, #00b4d8)")
            }
          >
            ➕ Add Employee
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 small text-muted">
          © 2025 HRMS Solutions Pvt. Ltd.
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
