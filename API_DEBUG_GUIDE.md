# API 400 Bad Request Debugging Guide

## What I Fixed

### 1. **Phone Number Validation** ✅
- **Old**: `isMobilePhone()` - Too strict (requires country codes like +91)
- **New**: Regex pattern that accepts: `^[0-9\s\-\+\(\)]{10,15}$`
- **Now Accepts**: `9876543210`, `98-7654-3210`, `(98) 7654-3210`, `+919876543210`

### 2. **Empty Fields Issue** ✅
- **Problem**: Form was sending empty strings for optional fields
- **Solution**: Only send non-empty values in FormData
- **File Updated**: `AdminPanel/src/Components/Employees/AddEmployee.jsx`

### 3. **Better Error Logging** ✅
- **File Updated**: `Server/middleware/errorMiddleware.js`
- **Now Logs**: Request path, method, body, and detailed error info

### 4. **Optional Field Validation** ✅
- Made secondary fields truly optional (city, state, country, bank details, etc.)

## How to Debug 400 Errors

### Step 1: Check Server Console
When you get a 400 error:
```bash
cd Server
npm start
# Look at the console output for detailed error messages
```

### Step 2: Check Request Data
The server now logs:
- Which fields failed validation
- Request path and method
- The actual data sent

### Step 3: Common 400 Error Causes

| Error | Solution |
|-------|----------|
| "Valid phone number is required" | Format: `9876543210` or `98-7654-3210` |
| "Valid email is required" | Use proper email format: `user@example.com` |
| "Department is required" | Department field is mandatory |
| "Designation is required" | Designation field is mandatory |
| "Valid joining date is required" | Use date picker (YYYY-MM-DD format) |
| "Password must be at least 6 characters" | Use minimum 6 character password |

## Testing the Fix

### Test Add Employee:
1. Go to Admin Dashboard → Add Employee
2. Fill required fields:
   - ✅ Name (any text)
   - ✅ Email (valid format)
   - ✅ Password (min 6 chars)
   - ✅ Phone (10-15 digits)
   - ✅ Department (from dropdown)
   - ✅ Designation (any text)
   - ✅ Address (any text)
   - ✅ Joining Date (use date picker)
3. Optional fields can be left empty
4. Submit - should succeed!

### Test Get Employees:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/employees
```

## Files Modified

1. ✅ `Server/Routes/employeeRoutes.js` - Updated validation rules
2. ✅ `Server/middleware/errorMiddleware.js` - Better error logging
3. ✅ `AdminPanel/src/Components/Employees/AddEmployee.jsx` - Only send non-empty fields

## Next Steps if Still Getting Errors

1. **Check Server is Running**:
   ```bash
   cd Server && npm start
   ```

2. **Check Database Connection**:
   - Ensure MongoDB is running
   - Check `.env` file has correct `MONGODB_URI`

3. **Verify Token**:
   - Make sure you're logged in
   - Check token is being sent in Authorization header

4. **Check CORS**:
   - Verify `CLIENT_URL` in server `.env` matches your frontend URL
   - Ensure `http://localhost:5173` or `5174` or `5175` is in CORS allowed origins

## Environment Variables Needed

**Server/.env**:
```
MONGODB_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

**AdminPanel/.env**:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
