# Student Frontend - API Integration Guide

## Overview
The student frontend has been integrated with the backend login API. Students can now log in and view their personal information.

## Features Implemented

### 1. Login Page (`src/pages/LoginPage.tsx`)
- Email and password authentication
- Form validation
- Error handling and display
- Loading states
- Test credentials display
- Redirects to profile page after successful login

### 2. Profile Page (`src/pages/ProfilePage.tsx`)
- Displays student personal information
- Shows student ID, name, email, and phone
- Logout functionality
- Protected route (redirects to login if not authenticated)

### 3. API Service (`src/services/api.ts`)
- Centralized API calls
- Login, logout, and profile endpoints
- Token management
- TypeScript interfaces for type safety

## Routes

- `#/` - Home page
- `#/login` - Login page
- `#/profile` - Student profile page (requires authentication)

## API Endpoints Used

### Login
```
POST http://localhost/Management/public/api/student/login
```

### Get Profile
```
GET http://localhost/Management/public/api/student/profile
```

### Logout
```
POST http://localhost/Management/public/api/student/logout
```

## Test Credentials

```
Email: student@test.com
Password: password123
```

## How to Run

1. **Start the Backend Server**
   ```bash
   cd C:\xampp\htdocs\Management
   php artisan serve
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd C:\FrontEnd\Student
   npm run dev
   ```

3. **Access the Application**
   - Open browser and go to the URL shown by Vite (usually `http://localhost:5173`)
   - Click "登录" or navigate to `#/login`
   - Use the test credentials to log in
   - You'll be redirected to the profile page

## Authentication Flow

1. User enters email and password on login page
2. Frontend sends POST request to `/api/student/login`
3. Backend validates credentials and checks if `can_login` is true
4. If successful, backend returns token and student data
5. Frontend stores token and student data in localStorage
6. User is redirected to profile page
7. Profile page checks authentication and displays student info
8. User can logout, which clears localStorage and redirects to login

## Local Storage

The application stores the following in localStorage:
- `token` - JWT authentication token
- `student` - Student information (JSON string)

## Error Handling

The login page handles:
- Invalid credentials
- Account disabled (can_login = false)
- Network errors
- Server errors

## Next Steps

You can extend this by adding:
1. Dashboard page with course information
2. Course list and details
3. Lesson viewing
4. Assignment submission
5. Progress tracking
6. Teacher feedback viewing

## File Structure

```
src/
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── services/
│   └── api.ts
├── App.tsx
└── main.tsx
```

## Notes

- Make sure XAMPP Apache and MySQL are running
- The backend must be accessible at `http://localhost/Management/public`
- CORS is handled by Laravel's default configuration
- Tokens are stored in localStorage (consider using httpOnly cookies for production)
