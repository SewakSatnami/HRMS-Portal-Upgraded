# HRMS SaaS Production Upgrade

This project is organized as a production-style HRMS SaaS application with a React/Vite frontend and an Express/MongoDB backend.

## Folder Structure

```text
HRMS-Portal-main/
  AdminPanel/
    src/
      Components/
      services/api.js
      App.jsx
  Server/
    config/db.js
    controllers/
    docs/swagger.js
    middleware/
    models/
    Routes/
    services/
    utils/
    server.js
```

## Core API Endpoints

Auth:
- `POST /api/auth/register` - create admin or employee user
- `POST /api/auth/login` - login and receive access/refresh tokens
- `POST /api/auth/refresh` - rotate access token
- `POST /api/auth/logout` - invalidate refresh token
- `GET /api/auth/profile` - current user profile

Employees:
- `GET /api/employees?page=1&limit=10&search=term` - admin employee list
- `POST /api/employees` - admin create employee
- `PUT /api/employees/:id` - admin update employee
- `DELETE /api/employees/:id` - admin delete employee
- `GET /api/employees/profile` - employee profile

Attendance:
- `POST /api/attendance` - admin mark attendance
- `GET /api/attendance/:employeeId` - admin fetch employee attendance
- `GET /api/attendance/my` - employee attendance

Leave:
- `POST /api/leaves/apply` - employee leave request
- `GET /api/leaves` - admin leave queue
- `PUT /api/leaves/:id/approve` - admin approve/reject leave
- `GET /api/leaves/my` - employee leave history
- `GET /api/leaves/balance` - employee balance

Salary and Payslips:
- `POST /api/salaries` - admin salary structure
- `GET /api/salaries` - admin salary list
- `GET /api/salaries/my` - employee salary
- `POST /api/payslips/generate` - admin generate payslip
- `GET /api/payslips` - admin payslip list
- `GET /api/payslips/my` - employee payslips

Dashboard:
- `GET /api/dashboard/analytics` - admin dashboard counts, payroll liability, recent employees, and leave queue

Swagger:
- `GET /api/docs` - interactive API documentation

## Authentication Flow

1. Frontend calls `authAPI.login(email, password)`.
2. Backend validates credentials and returns `accessToken`, `refreshToken`, and `user`.
3. Frontend stores the token values and user role.
4. `src/services/api.js` attaches `Authorization: Bearer <token>` to every protected request.
5. Backend `authenticateToken` verifies JWT.
6. Backend `requireRole("admin")` or `requireRole("employee")` protects role-specific APIs.
7. React `ProtectedRoute` blocks dashboard access when the token or role is missing.

For stronger production security, move refresh tokens to `httpOnly` secure cookies before deployment.

## Salary Logic

Payslip generation calls `calculateMonthlySalary(employeeId, month, year)`.

The service calculates:
- gross salary from salary structure
- present days and half-days from attendance
- absent deductions
- approved leave days split into `paidDays` and `unpaidDays`
- unpaid leave deductions
- final net salary

Leave balance is deducted only when leave is approved.

## Frontend Integration

Use only `AdminPanel/src/services/api.js` for API calls. It centralizes:
- base URL through `VITE_API_BASE_URL`
- JWT header injection
- token cleanup on expired sessions
- grouped `authAPI`, `adminAPI`, and `employeeAPI` methods

Create `AdminPanel/.env` for deployment-specific API URLs:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Backend Environment

Create `Server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hrms
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=replace_with_another_long_random_secret
REFRESH_TOKEN_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Deployment Checklist

- Replace demo JWT secrets with strong random secrets.
- Use MongoDB Atlas or a managed MongoDB instance.
- Set `CLIENT_URL` to the deployed frontend origin.
- Run `npm run build` in `AdminPanel`.
- Run `npm start` in `Server`.
- Verify `/api/health` and `/api/docs`.
- Create first admin via `/admin-signup`, then restrict public admin registration if needed.
