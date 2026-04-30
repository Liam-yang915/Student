# Quick Start Guide

## Prerequisites
- XAMPP installed and running (Apache + MySQL)
- Node.js installed
- Composer installed

## Backend Setup (Already Done)

The backend is already configured. Just make sure:

1. **XAMPP is running**
   - Start Apache
   - Start MySQL

2. **Database is migrated**
   ```bash
   cd C:\xampp\htdocs\Management
   php artisan migrate
   ```

3. **Test student exists**
   ```bash
   php artisan db:seed --class=TestStudentSeeder
   ```

## Frontend Setup

1. **Install dependencies** (if not already done)
   ```bash
   cd C:\FrontEnd\Student
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   - Go to the URL shown (usually `http://localhost:5173`)

## Testing the Login Flow

1. **Access the login page**
   - Click "登录" button on homepage
   - Or navigate to `#/login`

2. **Login with test credentials**
   ```
   Email: student@test.com
   Password: password123
   ```

3. **View profile**
   - After successful login, you'll be redirected to profile page
   - You can see your personal information

4. **Logout**
   - Click "退出登录" button on profile page
   - You'll be redirected back to login page

## Managing Students (Admin Panel)

1. **Access admin panel**
   ```
   http://localhost/Management/public/login
   ```

2. **Login as admin/superadmin**
   - Use your existing admin credentials

3. **Navigate to Student Management**
   - Click "Student Management" in the sidebar

4. **Perform CRUD operations**
   - **Add Student**: Click "Add Student" button
   - **Edit Student**: Click "Edit" button on any student row
   - **Delete Student**: Click "Delete" button (only works if can_login is disabled)

## API Endpoints

All API endpoints are documented in:
- `C:\xampp\htdocs\Management\API_DOCUMENTATION.md`

Base URL: `http://localhost/Management/public/api`

### Available Endpoints:
- `POST /student/login` - Login
- `GET /student/profile` - Get profile (requires token)
- `POST /student/logout` - Logout (requires token)

## Troubleshooting

### Frontend can't connect to backend
- Make sure XAMPP Apache is running
- Check if backend is accessible at `http://localhost/Management/public`
- Check browser console for CORS errors

### Login fails with network error
- Verify backend server is running
- Check the API URL in `src/services/api.ts`
- Make sure the test student exists in database

### "Account disabled" error
- Check if `can_login` is set to `true` for the student in database
- Use admin panel to enable login for the student

## File Structure

### Backend
```
C:\xampp\htdocs\Management\
├── routes/api.php (API routes)
├── routes/web.php (Web routes)
├── app/Http/Controllers/Api/StudentAuthController.php
├── app/Http/Controllers/StudentController.php
├── app/Models/Student.php
└── resources/views/students/ (Admin views)
```

### Frontend
```
C:\FrontEnd\Student\
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx (Login form)
│   │   └── ProfilePage.tsx (Student profile)
│   ├── services/
│   │   └── api.ts (API service)
│   └── App.tsx (Routing)
```

## What's Next?

Now that login is working, you can:
1. Add more pages (courses, lessons, etc.)
2. Implement course enrollment
3. Add lesson viewing functionality
4. Create a dashboard with statistics
5. Add teacher feedback system

Refer to `IMPLEMENTATION_SUMMARY.md` for detailed next steps.
