import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//  (Role Selection)
import RoleSelection from "./Components/ChooseRole/RoleSelection";

// Auth (Admin)
import Login from "./Components/AdminLoginAndSignup/Login";
import Signup from "./Components/AdminLoginAndSignup/Signup";

// Admin Components
import Dashboard from "./Components/NavbarAndSidebar/Dashboard";
import Home from "./Components/Home";
import Profile from "./Components/AdminProfile/Profile";
import AddEmployee from "./Components/Employees/AddEmployee";
import AllEmployee from "./Components/Employees/AllEmployee";
import SalaryList from "./Components/PayRoll/SalaryList";
import GeneratePayslip from "./Components/PayRoll/GeneratePayslip";
import AddSalary from "./Components/PayRoll/AddSalary";
import DashboardHome from "./Components/DashboardHome/DashboardHome";
import AddDepartment from "./Components/Departments/AddDepartment";
import DepartmentList from "./Components/Departments/DepartmentList";
import AttendanceRecords from "./Components/Attendance/AttendanceRecords";
import ApplyLeave from "./Components/LeaveManagement/ApplyLeave";
import LeaveRequest from "./Components/LeaveManagement/LeaveRequest";
import MarkAttendance from "./Components/Attendance/MarkAttendance";

// Employee Components
import EmployeeDashboard from "./Components/EmployeePanel/EmployeeDashboard";
import EmployeeProfile from "./Components/EmployeePanel/Profile";
import EmployeeAttendance from "./Components/EmployeePanel/Attendance";
import EmployeeLeave from "./Components/EmployeePanel/Leave";
import EmployeeSalary from "./Components/EmployeePanel/Salary";
import EmployeeSidebar from "./Components/EmployeeSidebar";
import EmployeeLogin from "./Components/EmployeePanel/EmployeeLogin";
import EmployeeSignup from "./Components/EmployeePanel/EmployeeSignup";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔥 FIRST PAGE (Role Selection) */}
        <Route path="/" element={<RoleSelection />} />

        {/* 🔹 Admin Auth */}
        <Route path="/admin-login" element={<Login />} />
        <Route path="/admin-signup" element={<Signup />} />

        {/* 🔹 Employee Auth */}
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/employee-signup" element={<EmployeeSignup />} />

        {/* 🔹 Admin Dashboard */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="home" element={<Home />} />
            <Route path="add-employee" element={<AddEmployee />} />
            <Route path="all-employees" element={<AllEmployee />} />
            <Route path="add-salary" element={<AddSalary />} />
            <Route path="salary-list" element={<SalaryList />} />
            <Route path="generate-payslip" element={<GeneratePayslip />} />
            <Route path="profile" element={<Profile />} />
            <Route path="adddepartment" element={<AddDepartment />} />
            <Route path="departmentlist" element={<DepartmentList />} />
            <Route path="attendancerecords" element={<AttendanceRecords />} />
            <Route path="markattendance" element={<MarkAttendance />} />
            <Route path="applyleave" element={<ApplyLeave />} />
            <Route path="leaverequest" element={<LeaveRequest />} />
          </Route>
        </Route>

        {/* 🔹 Employee Dashboard */}
        <Route element={<ProtectedRoute roles={["employee"]} />}>
          <Route path="/employee" element={<EmployeeSidebar />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="leave" element={<EmployeeLeave />} />
            <Route path="salary" element={<EmployeeSalary />} />
          </Route>
        </Route>

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
