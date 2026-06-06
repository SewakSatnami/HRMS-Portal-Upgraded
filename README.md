# HRMS-Portal
👤 HRMS Portal is a web-based application designed to simplify and automate human resource operations within an organization. It enables administrators and employees to efficiently manage key HR tasks such as 🔐 employee registration, 🕒 attendance tracking, 📅 leave management, and 💰 salary records — all from a single, centralized platform.

HRMS-Portal is a full-stack Human Resource Management System developed using React.js for the frontend and Node.js with Express.js for the backend. The project emphasizes secure authentication, admin profile management, and a scalable architecture suitable for real-world enterprise HR operations.

**Tech Stack**

**Frontend**: React.js, Axios, Bootstrap, CSS

**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser

**Folder Structure**

HRMS-Portal/

- EmployeeMS (Frontend - React)
  
- Server (Backend - Node & Express)
  
- README.md
  
**How to Run the Project**
1. Clone the repository from GitHub
2. Open terminal and go to Server folder

npm install

npm start

3. Open new terminal and go to EmployeeMS folder

npm install

npm run dev

**Authentication Flow**
- User logs in using email and password
- Backend verifies credentials from MongoDB
- JWT token is generated and stored in HTTP-only cookies
- Protected routes are accessed after token verification

**Features**
- Admin Login
- JWT Authentication with Cookies
- Protected Profile Page
- Secure APIs
- Responsive UI
  
**Author**

Saniya Sharma
Final Year Project – HRMS Portal
