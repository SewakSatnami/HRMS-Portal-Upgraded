import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { adminAPI } from "../../services/api";

const initialValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  alternatePhone: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  department: "",
  designation: "",
  employmentType: "full-time",
  workLocation: "",
  reportingManager: "",
  joiningDate: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  panNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  profileImage: null,
};

const SectionTitle = ({ children }) => (
  <div className="col-12 mt-2">
    <h6 className="fw-bold text-primary border-bottom pb-2 mb-0">{children}</h6>
  </div>
);

const AddEmployee = () => {
  const [values, setValues] = useState(initialValues);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await adminAPI.getDepartments();
        setDepartments(data.departments || []);
      } catch {
        setDepartments([]);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValues({ ...values, profileImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add all text fields (only non-empty values)
      Object.keys(values).forEach((key) => {
        if (key !== "profileImage" && values[key] && values[key] !== "") {
          formData.append(key, values[key]);
        }
      });
      
      // Add profile image if selected
      if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
      }
      
      const response = await adminAPI.createEmployeeWithImage(formData);
      setMessage(response.message || "Employee added successfully!");
      setValues(initialValues);
      setImagePreview("");
      setTimeout(() => navigate("/dashboard/all-employees"), 900);
    } catch (error) {
      const validationMessage = error.response?.data?.errors?.[0]?.msg;
      setMessage(validationMessage || error.response?.data?.message || "Failed to add employee");
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg border-0 rounded-1 p-4" style={{ width: "100%", backgroundColor: "#fff" }}>
      <div
        className="text-center text-white py-3 rounded-3 mb-4"
        style={{
          background: "linear-gradient(135deg, #007bff, #00b4d8)",
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h4 className="fw-bold mb-0">Add New Employee</h4>
      </div>

      {message && (
        <div className={`alert ${message.toLowerCase().includes("success") ? "alert-success" : "alert-danger"} text-center shadow-sm py-2`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-1">
        <div className="row g-3">
          <SectionTitle>Employee Photo</SectionTitle>

          <div className="col-12 d-flex gap-3 align-items-end">
            <div>
              <label className="form-label fw-semibold text-secondary">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
              <small className="text-muted d-block mt-1">Max 5MB, formats: JPG, PNG</small>
            </div>
            {imagePreview && (
              <div className="text-center">
                <img src={imagePreview} alt="Preview" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #007bff" }} />
              </div>
            )}
          </div>

          <SectionTitle>Account & Personal Details</SectionTitle>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">Full Name</label>
            <input name="name" className="form-control" value={values.name} onChange={handleChange} required />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">Email Address</label>
            <input type="email" name="email" className="form-control" value={values.email} onChange={handleChange} required />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">Temporary Password</label>
            <input type="password" name="password" className="form-control" value={values.password} onChange={handleChange} minLength="6" required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Phone</label>
            <input name="phone" className="form-control" value={values.phone} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Alternate Phone</label>
            <input name="alternatePhone" className="form-control" value={values.alternatePhone} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Date of Birth</label>
            <input type="date" name="dateOfBirth" className="form-control" value={values.dateOfBirth} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Gender</label>
            <select name="gender" className="form-control" value={values.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Marital Status</label>
            <select name="maritalStatus" className="form-control" value={values.maritalStatus} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          <SectionTitle>Job Details</SectionTitle>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Department</label>
            <select name="department" className="form-control" value={values.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department.name}>{department.name}</option>
              ))}
              {departments.length === 0 && (
                <>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </>
              )}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Designation</label>
            <input name="designation" className="form-control" value={values.designation} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Employment Type</label>
            <select name="employmentType" className="form-control" value={values.employmentType} onChange={handleChange}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Joining Date</label>
            <input type="date" name="joiningDate" className="form-control" value={values.joiningDate} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold text-secondary">Work Location</label>
            <input name="workLocation" className="form-control" placeholder="Office, Remote, Branch..." value={values.workLocation} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold text-secondary">Reporting Manager</label>
            <input name="reportingManager" className="form-control" value={values.reportingManager} onChange={handleChange} />
          </div>

          <SectionTitle>Address Details</SectionTitle>

          <div className="col-md-12">
            <label className="form-label fw-semibold text-secondary">Address</label>
            <input name="address" className="form-control" value={values.address} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">City</label>
            <input name="city" className="form-control" value={values.city} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">State</label>
            <input name="state" className="form-control" value={values.state} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Country</label>
            <input name="country" className="form-control" value={values.country} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Postal Code</label>
            <input name="postalCode" className="form-control" value={values.postalCode} onChange={handleChange} />
          </div>

          <SectionTitle>Bank & Compliance Details</SectionTitle>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Bank Name</label>
            <input name="bankName" className="form-control" value={values.bankName} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Account Number</label>
            <input name="accountNumber" className="form-control" value={values.accountNumber} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">IFSC Code</label>
            <input name="ifscCode" className="form-control" value={values.ifscCode} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">PAN Number</label>
            <input name="panNumber" className="form-control" value={values.panNumber} onChange={handleChange} />
          </div>

          <SectionTitle>Emergency Contact</SectionTitle>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">Contact Name</label>
            <input name="emergencyContactName" className="form-control" value={values.emergencyContactName} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">Contact Phone</label>
            <input name="emergencyContactPhone" className="form-control" value={values.emergencyContactPhone} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">Relation</label>
            <input name="emergencyContactRelation" className="form-control" value={values.emergencyContactRelation} onChange={handleChange} />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-semibold shadow-sm rounded-3 py-2 mt-4"
          disabled={loading}
          style={{ background: "linear-gradient(135deg, #007bff, #00b4d8)", border: "none" }}
        >
          {loading ? "Adding Employee..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
