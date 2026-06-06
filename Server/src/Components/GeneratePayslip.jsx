import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

const GeneratePaySlip = () => {
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState(null);
  const [message, setMessage] = useState("");

  // 🔍 Fetch salary by email
  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setSalary(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/salary/find/${email}`);
      setSalary(res.data);
      setMessage("✅ Salary record found!");
    } catch (err) {
      console.error("Error fetching salary:", err);
      setMessage("❌ No salary record found for this email.");
    }
  };

  // 🧾 Generate Stylish Pay Slip PDF
  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // 🎨 Colors
    const primaryColor = [33, 150, 243];
    const lightGray = [245, 245, 245];
    const borderColor = [200, 200, 200];

    // 🗓️ Dynamic Month & Year
    const now = new Date();
    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    // 🏢 Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("HRMS SOLUTIONS PVT. LTD.", 105, 15, { align: "center" });
    doc.setFontSize(9);
    doc.text("Empowering Workforce Digitally", 105, 21, { align: "center" });

    // 🧾 Title
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`PAY SLIP – ${monthName.toUpperCase()} ${year}`, 105, 42, { align: "center" });

    // 📦 Border Box
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.roundedRect(10, 35, 190, 240, 4, 4);

    // 👤 Employee Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Employee Name: ${salary.employeeName}`, 20, 55);
    doc.text(`Email: ${salary.employeeEmail}`, 20, 62);
    doc.text(`Date of Issue: ${new Date(salary.createdAt).toLocaleDateString()}`, 20, 69);
    doc.text(`Employee ID: HRMS${salary._id.slice(-4).toUpperCase()}`, 20, 76);

    doc.line(20, 82, 190, 82);

    // 📊 Salary Table
    let y = 96;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(20, y - 6, 170, 9, "F");
    doc.text("EARNINGS", 25, y);
    doc.text("AMOUNT (₹)", 185, y, { align: "right" });

    // 💼 Salary Rows
    y += 10;
    const rows = [
      { label: "Basic Salary", value: salary.basicSalary },
      { label: "HRA (House Rent Allowance)", value: salary.hra },
      { label: "Other Allowances", value: salary.allowances },
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    rows.forEach((item) => {
      doc.text(item.label, 25, y);
      doc.text(String(item.value), 185, y, { align: "right" });
      y += 7;
    });

    doc.line(20, y, 190, y);
    y += 10;

    // 💰 Total Salary
    doc.setFillColor(235, 255, 235);
    doc.rect(20, y - 6, 170, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total Salary (in ₹)", 25, y);
    doc.text(`₹${salary.totalSalary}`, 185, y, { align: "right" });

    // ✍️ Signature
    y += 45;
    doc.line(140, y, 190, y);
    doc.setFontSize(9);
    doc.text("Authorized Signature", 145, y + 5);

    // 📞 Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("HRMS Solutions Pvt. Ltd. | hr@hrms.com | +91 98765 43210", 105, 278, { align: "center" });
    doc.text("System-generated document. No signature required.", 105, 283, { align: "center" });

    // ✅ Save PDF
    doc.save(`${salary.employeeName}_PaySlip_${monthName}_${year}.pdf`);
  };

  // 🖥️ UI Section
  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        {/* Header */}
        <div
          className="text-white text-center py-3"
          style={{ background: "linear-gradient(135deg, #007bff, #00b4d8)" }}
        >
          <h4 className="fw-bold mb-1">💼 Generate Employee Pay Slip</h4>
          <p className="mb-0 text-light small">
            Create and download a professional payslip instantly
          </p>
        </div>

        {/* Content */}
        <div className="card-body bg-light p-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group input-group-sm shadow-sm">
              <input
                type="email"
                className="form-control rounded-start"
                placeholder="Enter employee email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-primary fw-semibold" type="submit">
                🔍 Search
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`alert text-center shadow-sm rounded-3 py-2 ${
                salary ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          {/* Salary Details */}
          {salary && (
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-primary fw-bold mb-0">Employee Details</h6>
                <span className="badge bg-success px-2 py-1 small">
                  Pay Slip Ready
                </span>
              </div>
              <hr className="my-2" />
              <div className="row small">
                <div className="col-md-6">
                  <p>
                    <strong>👤 Name:</strong> {salary.employeeName}
                  </p>
                  <p>
                    <strong>📧 Email:</strong> {salary.employeeEmail}
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {new Date(salary.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>🆔 Employee ID:</strong>{" "}
                    HRMS{salary._id.slice(-4).toUpperCase()}
                  </p>
                </div>
              </div>

              <hr className="my-2" />
              <h6 className="text-secondary fw-bold mb-2 small">
                💰 Earnings Breakdown
              </h6>

              <ul className="list-group mb-2 small">
                <li className="list-group-item d-flex justify-content-between">
                  Basic Salary <span>₹{salary.basicSalary}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  HRA <span>₹{salary.hra}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Allowances <span>₹{salary.allowances}</span>
                </li>
              </ul>

              <div className="text-end">
                <h6 className="text-success fw-bold">
                  Total Salary: ₹{salary.totalSalary}
                </h6>
              </div>

              <div className="d-grid mt-3">
                <button
                  onClick={generatePDF}
                  className="btn btn-success btn-sm shadow-sm fw-semibold"
                >
                  📄 Download Pay Slip (PDF)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="text-center text-white py-2"
          style={{
            background: "linear-gradient(135deg, #00b4d8, #007bff)",
          }}
        >
          <small>© 2025 HRMS Solutions Pvt. Ltd. | All Rights Reserved</small>
        </div>
      </div>
    </div>
  );
};

export default GeneratePaySlip;
