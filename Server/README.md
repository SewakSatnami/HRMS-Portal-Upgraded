# HRMS Backend API

A production-ready Human Resource Management System backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Employee Management**: CRUD operations for employee data
- **Attendance Tracking**: Mark and track employee attendance
- **Leave Management**: Apply for and approve leave requests
- **Salary Management**: Configure salary structures
- **Payslip Generation**: Automatic payslip generation with calculations
- **Security**: Rate limiting, input validation, error handling
- **API Documentation**: Swagger UI for API docs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **Documentation**: Swagger

## Project Structure

```
Server/
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Route controllers
│   ├── authController.js
│   ├── employeeController.js
│   ├── attendanceController.js
│   ├── leaveController.js
│   ├── salaryController.js
│   └── payslipController.js
├── middleware/               # Custom middleware
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access
│   └── errorMiddleware.js    # Error handling
├── models/                   # Mongoose models
│   ├── User.js
│   ├── Employee.js
│   ├── Attendance.js
│   ├── Leave.js
│   ├── Salary.js
│   └── Payslip.js
├── routes/                   # API routes
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── attendanceRoutes.js
│   ├── leaveRoutes.js
│   ├── salaryRoutes.js
│   └── payslipRoutes.js
├── services/                 # Business logic
│   ├── salaryService.js
│   └── leaveService.js
├── utils/                    # Utilities
│   └── generateToken.js
├── .env                      # Environment variables
├── server.js                 # Main application file
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hrms
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Employees (Admin only)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Employees (Employee access)
- `GET /api/employees/profile` - Get own profile

### Attendance
- `POST /api/attendance` - Mark attendance (Admin)
- `GET /api/attendance/my` - Get my attendance (Employee)
- `GET /api/attendance/:employeeId` - Get employee attendance (Admin)
- `PUT /api/attendance/:id` - Update attendance (Admin)

### Leave Management
- `POST /api/leaves/apply` - Apply for leave (Employee)
- `GET /api/leaves/my` - Get my leave requests (Employee)
- `GET /api/leaves/balance` - Get leave balance (Employee)
- `GET /api/leaves/summary` - Get leave summary (Employee)
- `GET /api/leaves` - Get all leave requests (Admin)
- `PUT /api/leaves/:id/approve` - Approve/reject leave (Admin)

### Salary Management
- `GET /api/salaries` - Get all salaries (Admin)
- `GET /api/salaries/my` - Get my salary (Employee)
- `GET /api/salaries/:employeeId` - Get employee salary (Admin)
- `POST /api/salaries` - Add salary structure (Admin)
- `PUT /api/salaries/:employeeId` - Update salary (Admin)

### Payslip Management
- `POST /api/payslips/generate` - Generate payslip (Admin)
- `GET /api/payslips` - Get all payslips (Admin)
- `GET /api/payslips/my` - Get my payslips (Employee)
- `GET /api/payslips/:employeeId/:month` - Get specific payslip
- `PUT /api/payslips/:id` - Update payslip (Admin)
- `DELETE /api/payslips/:id` - Delete payslip (Admin)

## Business Logic

### Salary Calculation
- **Base Salary**: Monthly base pay
- **Allowances**: HRA, Conveyance, Medical, LTA, Other
- **Deductions**: PF, Professional Tax, Income Tax, Absent days, Unpaid leave
- **Net Salary**: Gross - Total Deductions

### Leave Management
- **Leave Types**: Annual, Sick, Casual, Maternity, Paternity
- **Balance Tracking**: Automatic balance updates on approval
- **Paid/Unpaid**: Annual and Casual leaves are paid, others may be unpaid

### Attendance Tracking
- **Status Types**: Present, Absent, Half-day, Leave
- **Working Hours**: Calculated from check-in/check-out times
- **Monthly Summary**: Total days, present days, absent days

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and Employee roles with different permissions
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet for security headers
- **CORS**: Configured for cross-origin requests
- **Password Hashing**: bcrypt for secure password storage

## Error Handling

- **Global Error Handler**: Centralized error handling
- **Validation Errors**: Detailed validation error messages
- **Database Errors**: Proper error responses for DB operations
- **Authentication Errors**: Clear auth failure messages

## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Testing the API

1. **Register an Admin user**
2. **Login to get JWT token**
3. **Use token in Authorization header**: `Bearer <token>`

### Sample API Usage

```bash
# Register admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## License

This project is licensed under the ISC License.