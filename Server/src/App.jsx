import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import AddEmployee from "./Components/AddEmployee";
import AllEmployee from "./Components/AllEmployee";
import SalaryList from "./Components/SalaryList";
import GeneratePayslip from "./Components/GeneratePayslip";
import AddSalary from "./Components/AddSalary";
import DashboardHome from "./Components/DashboardHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} /> {/* default */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="" element={<Home />}></Route>
          <Route path="/dashboard/add-employee" element={<AddEmployee />}></Route>
          <Route path="/dashboard/all-employees" element={<AllEmployee />}></Route>
          <Route path="/dashboard/add-salary" element={<AddSalary />}></Route>
          <Route path="/dashboard/salary-list" element={<SalaryList />}></Route>
          <Route path="/dashboard/generate-payslip" element={<GeneratePayslip />}></Route>
          <Route path="/dashboard/profile" element={<Profile />}></Route>
        </Route>

       </Routes>
    </Router>
  );
}

export default App;

