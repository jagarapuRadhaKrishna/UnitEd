# Part 4: Complete API Reference - Every Endpoint Detailed

**Documentation**: United Platform API Documentation  
**Last Updated**: November 11, 2025  
**Part**: 4 of 8

---

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Post Endpoints](#post-endpoints)
5. [Application Endpoints](#application-endpoints)
6. [Invitation Endpoints](#invitation-endpoints)
7. [Chatroom Endpoints](#chatroom-endpoints)
8. [Message Endpoints](#message-endpoints)
9. [Notification Endpoints](#notification-endpoints)
10. [Search and Discovery Endpoints](#search-and-discovery-endpoints)
11. [File Upload Endpoints](#file-upload-endpoints)
12. [Recommendation Endpoints](#recommendation-endpoints)
13. [Error Responses](#error-responses)

---

## API Overview

### Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.united.edu/api/v1
```

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "data": { ... },
  "message": "Success message",
  "error": "Error message if failed"
}
```

---

## Authentication Endpoints

### 1. Register Student

**Purpose**: Create a new student account  
**Triggered By**: Clicking "Create Account" on Student Registration page  
**Frontend Page**: `/register/student`

**Endpoint**: `POST /api/v1/auth/register/student`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Smith",
  "email": "john.smith@university.edu",
  "password": "SecurePass123!",
  "contactNo": "9876543210",
  "gender": "Male",
  "rollNumber": "A12345678901",
  "department": "Computer Science",
  "yearOfGraduation": 2025,
  "skills": ["React", "Python", "Machine Learning"],
  "projects": [
    {
      "title": "E-Commerce Website",
      "description": "Built full-stack e-commerce platform using MERN stack",
      "link": "https://github.com/johnsmith/ecommerce"
    }
  ],
  "achievements": [
    {
      "title": "First Place - National Hackathon 2024",
      "description": "Won first place among 200 teams",
      "date": "2024-05-15"
    }
  ],
  "experience": "Completed 3-month internship at Tech Company",
  "portfolio": "https://johnsmith.dev",
  "github": "https://github.com/johnsmith",
  "linkedin": "https://linkedin.com/in/johnsmith",
  "leetcode": "https://leetcode.com/johnsmith",
  "profilePicture": "https://storage.../profile.jpg",
  "resumeUrl": "https://storage.../resume.pdf"
}
```

**Field Validations**:
- `firstName`: Required, 2-50 characters, letters only
- `lastName`: Required, 2-50 characters, letters only
- `email`: Required, valid university email format, unique
- `password`: Required, min 8 chars, must include uppercase, lowercase, number, special character
- `contactNo`: Required, exactly 10 digits
- `gender`: Required, enum: ["Male", "Female", "Other", "Prefer not to say"]
- `rollNumber`: Required, format "A" + 11 digits, unique
- `department`: Required, valid department name
- `yearOfGraduation`: Required, number, current year or future
- `skills`: Required, array with at least 1 skill, max 20 skills

**Backend Processing**:
1. Validate all required fields
2. Check email doesn't exist in database
3. Check roll number doesn't exist
4. Hash password using bcrypt (10 rounds)
5. Generate unique user ID (UUID)
6. Begin database transaction
7. Insert into `users` table
8. Insert each skill into `users_skills` table
9. Insert each project into `user_projects` table
10. Insert each achievement into `user_achievements` table
11. Commit transaction
12. Generate JWT access token (expires 24h)
13. Generate refresh token (expires 7 days)
14. Store refresh token in `refresh_tokens` table
15. Return response

**Success Response** (Status 201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "xyz123abc456def789...",
    "user": {
      "id": "user-uuid-1234-5678-90ab",
      "firstName": "John",
      "middleName": "Michael",
      "lastName": "Smith",
      "email": "john.smith@university.edu",
      "role": "student",
      "rollNumber": "A12345678901",
      "department": "Computer Science",
      "yearOfGraduation": 2025,
      "profilePicture": "https://storage.../profile.jpg",
      "skills": ["React", "Python", "Machine Learning"],
      "createdAt": "2024-11-11T10:30:00Z"
    }
  }
}
```

**Error Responses**:

**Email already exists** (Status 400):
```json
{
  "success": false,
  "error": "Email already registered",
  "message": "This email address is already associated with an account"
}
```

**Roll number already exists** (Status 400):
```json
{
  "success": false,
  "error": "Roll number already registered",
  "message": "This roll number is already in use"
}
```

**Validation error** (Status 400):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    },
    {
      "field": "rollNumber",
      "message": "Roll number must start with 'A' followed by 11 digits"
    }
  ]
}
```

**Server error** (Status 500):
```json
{
  "success": false,
  "error": "Registration failed",
  "message": "An unexpected error occurred. Please try again."
}
```

**Database Operations**:
```sql
-- 1. Insert user
INSERT INTO users (
  id, first_name, middle_name, last_name, email, password_hash,
  contact_no, gender, role, profile_picture, resume_url,
  roll_number, department, year_of_graduation,
  experience, portfolio, github, linkedin, leetcode,
  created_at, updated_at
) VALUES (...);

-- 2. Insert skills (for each skill)
INSERT INTO users_skills (id, user_id, skill, created_at) 
VALUES (UUID(), 'user-uuid-1234', 'React', NOW());

-- 3. Insert projects (for each project)
INSERT INTO user_projects (
  id, user_id, title, description, link, created_at
) VALUES (...);

-- 4. Insert achievements (for each achievement)
INSERT INTO user_achievements (
  id, user_id, title, description, date, created_at
) VALUES (...);

-- 5. Store refresh token
INSERT INTO refresh_tokens (
  id, user_id, token, expires_at, created_at
) VALUES (...);
```

**What Happens Next**:
1. Frontend stores token in localStorage
2. Frontend stores user object in localStorage
3. AuthContext updated with user data
4. User redirected to `/home`
5. User is now logged in

---

### 2. Register Faculty

**Purpose**: Create a new faculty account  
**Triggered By**: Clicking "Create Account" on Faculty Registration page  
**Frontend Page**: `/register/faculty`

**Endpoint**: `POST /api/v1/auth/register/faculty`

**Request Body**:
```json
{
  "firstName": "Jane",
  "middleName": "Elizabeth",
  "lastName": "Doe",
  "email": "jane.doe@university.edu",
  "password": "SecurePass123!",
  "contactNo": "9876543210",
  "gender": "Female",
  "employeeId": "100234",
  "designation": "Associate Professor",
  "dateOfJoining": "2015-08-15",
  "totalExperience": 12,
  "industryExperience": 5,
  "teachingExperience": 7,
  "qualification": "Ph.D. in Computer Science",
  "specialization": ["Machine Learning", "Data Science", "Artificial Intelligence"],
  "skills": ["Python", "Machine Learning", "Deep Learning", "Research"],
  "projects": [
    {
      "title": "AI in Healthcare Research",
      "description": "Leading research on ML applications in medical diagnosis",
      "link": "https://researchgate.net/..."
    }
  ],
  "achievements": [
    {
      "title": "Best Research Paper Award - IEEE Conference 2023",
      "description": "Awarded for groundbreaking work in neural networks"
    }
  ],
  "profilePicture": "https://storage.../profile.jpg",
  "resumeUrl": "https://storage.../cv.pdf"
}
```

**Field Validations**:
- `employeeId`: Required, format "100" + 3 digits (total 6 digits), unique
- `designation`: Required, valid designation
- `dateOfJoining`: Required, valid date in past
- `totalExperience`: Required, number >= 0
- `industryExperience`: Required, number >= 0
- `teachingExperience`: Required, number >= 0
- `qualification`: Required, string
- `specialization`: Required, array with at least 1 item

**Success Response** (Status 201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "xyz123abc456...",
    "user": {
      "id": "user-uuid-5678",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@university.edu",
      "role": "faculty",
      "employeeId": "100234",
      "designation": "Associate Professor",
      "totalExperience": 12,
      "specialization": ["Machine Learning", "Data Science"],
      "profilePicture": "https://storage.../profile.jpg",
      "createdAt": "2024-11-11T10:30:00Z"
    }
  }
}
```

**Database Operations**: Similar to student registration but using faculty-specific fields.

---

### 3. Login

**Purpose**: Authenticate user and get access token  
**Triggered By**: Clicking "Login" button on login page  
**Frontend Page**: `/login`

**Endpoint**: `POST /api/v1/auth/login`

**Request Body**:
```json
{
  "email": "john.smith@university.edu",
  "password": "SecurePass123!"
}
```

**Backend Processing**:
1. Validate email and password provided
2. Query database for user by email:
   ```sql
   SELECT * FROM users WHERE email = 'john.smith@university.edu' LIMIT 1;
   ```
3. If user not found → Return error
4. Compare passwords:
   - Hash submitted password with bcrypt
   - Compare with stored password_hash
5. If passwords don't match → Return error
6. If match:
   - Generate new JWT access token (24h expiry)
   - Generate new refresh token (7d expiry)
   - Store refresh token in database
   - Fetch user's complete profile:
     ```sql
     -- Get user details
     SELECT * FROM users WHERE id = 'user-id';
     
     -- Get user skills
     SELECT skill FROM users_skills WHERE user_id = 'user-id';
     
     -- Get user projects
     SELECT * FROM user_projects WHERE user_id = 'user-id';
     
     -- Get user achievements
     SELECT * FROM user_achievements WHERE user_id = 'user-id';
     ```
   - Return complete user object with tokens

**Success Response** (Status 200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-xyz123...",
    "user": {
      "id": "user-uuid-1234",
      "firstName": "John",
      "middleName": "Michael",
      "lastName": "Smith",
      "email": "john.smith@university.edu",
      "role": "student",
      "contactNo": "9876543210",
      "gender": "Male",
      "profilePicture": "https://storage.../profile.jpg",
      "resumeUrl": "https://storage.../resume.pdf",
      "rollNumber": "A12345678901",
      "department": "Computer Science",
      "yearOfGraduation": 2025,
      "skills": ["React", "Python", "Machine Learning"],
      "projects": [
        {
          "id": "proj-1",
          "title": "E-Commerce Website",
          "description": "Built full-stack platform",
          "link": "https://github.com/..."
        }
      ],
      "achievements": [
        {
          "id": "ach-1",
          "title": "Hackathon Winner 2024"
        }
      ],
      "bio": "Passionate about ML and web development",
      "location": "New York, USA",
      "github": "https://github.com/johnsmith",
      "linkedin": "https://linkedin.com/in/johnsmith",
      "leetcode": "https://leetcode.com/johnsmith",
      "portfolio": "https://johnsmith.dev",
      "experience": "Internship at Tech Company",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-11-10T14:30:00Z"
    }
  }
}
```

**Error Responses**:

**User not found** (Status 404):
```json
{
  "success": false,
  "error": "User not found",
  "message": "No account exists with this email address"
}
```

**Invalid password** (Status 401):
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "The password you entered is incorrect"
}
```

**Account disabled** (Status 403):
```json
{
  "success": false,
  "error": "Account disabled",
  "message": "Your account has been suspended. Contact support for assistance."
}
```

**What Happens After Login**:
1. Frontend receives token and user object
2. Stores token in localStorage: `localStorage.setItem('authToken', token)`
3. Stores user in localStorage: `localStorage.setItem('user', JSON.stringify(user))`
4. Updates AuthContext state
5. Redirects to `/home`
6. All subsequent API calls include token in Authorization header

---

### 4. Refresh Token

**Purpose**: Get new access token using refresh token  
**Triggered By**: When access token expires (after 24 hours)  
**Frontend**: Automatic when API returns 401 Unauthorized

**Endpoint**: `POST /api/v1/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "refresh-token-xyz123abc456..."
}
```

**Backend Processing**:
1. Validate refresh token provided
2. Query database:
   ```sql
   SELECT * FROM refresh_tokens 
   WHERE token = 'refresh-token-xyz123...' 
   AND expires_at > NOW()
   AND revoked = false;
   ```
3. If not found or expired → Return error
4. If valid:
   - Generate new access token (24h)
   - Optionally generate new refresh token
   - Update database with new refresh token
   - Return new tokens

**Success Response** (Status 200):
```json
{
  "success": true,
  "data": {
    "token": "new-access-token-eyJhbGciOi...",
    "refreshToken": "new-refresh-token-abc123..." 
  }
}
```

**Error Response** (Status 401):
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "message": "Please login again"
}
```

**Frontend Handling**:
```javascript
// When API call returns 401
if (error.response.status === 401) {
  // Try to refresh token
  const newToken = await refreshToken();
  if (newToken) {
    // Retry original request with new token
    retryOriginalRequest();
  } else {
    // Redirect to login
    navigate('/login');
  }
}
```

---

### 5. Logout

**Purpose**: Invalidate tokens and end session  
**Triggered By**: Clicking "Logout" button  
**Frontend**: Logout button in user menu/navigation

**Endpoint**: `POST /api/v1/auth/logout`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "refreshToken": "refresh-token-xyz123..."
}
```

**Backend Processing**:
1. Extract user ID from JWT token
2. Revoke refresh token in database:
   ```sql
   UPDATE refresh_tokens 
   SET revoked = true, revoked_at = NOW()
   WHERE token = 'refresh-token-xyz123...' 
   AND user_id = 'user-uuid-1234';
   ```
3. Optionally add access token to blacklist (for immediate invalidation)
4. Return success

**Success Response** (Status 200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend Handling**:
1. Remove token from localStorage: `localStorage.removeItem('authToken')`
2. Remove refresh token: `localStorage.removeItem('refreshToken')`
3. Remove user data: `localStorage.removeItem('user')`
4. Clear AuthContext state
5. Redirect to `/login` or landing page `/`
6. Show message: "You have been logged out"

---

### 6. Forgot Password

**Purpose**: Request password reset link  
**Triggered By**: Clicking "Forgot Password?" on login page  
**Frontend Page**: `/forgot-password`

**Endpoint**: `POST /api/v1/auth/forgot-password`

**Request Body**:
```json
{
  "email": "john.smith@university.edu"
}
```

**Backend Processing**:
1. Validate email format
2. Find user by email:
   ```sql
   SELECT id, email, first_name FROM users 
   WHERE email = 'john.smith@university.edu';
   ```
3. If user not found → Still return success (security: don't reveal if email exists)
4. If found:
   - Generate random reset token (UUID or crypto.randomBytes)
   - Set expiration (1 hour from now)
   - Store in database:
     ```sql
     INSERT INTO password_reset_tokens (
       id, user_id, token, expires_at, created_at
     ) VALUES (
       UUID(), 'user-uuid-1234', 'reset-token-abc123',
       NOW() + INTERVAL '1 hour', NOW()
     );
     ```
   - Send email with reset link:
     - To: user's email
     - Subject: "Reset Your Password"
     - Body: "Click here to reset: https://united.edu/reset-password?token=reset-token-abc123"
     - Template includes user name, link, expiration time

**Success Response** (Status 200):
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

**Frontend Shows**:
- Success message above form
- Instructions to check email
- "Didn't receive email? Resend" button

**Email Sent**:
```
Subject: Reset Your Password - United Platform

Hi John,

We received a request to reset your password for your United Platform account.

Click the link below to reset your password:
https://united.edu/reset-password?token=reset-token-abc123

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

Best regards,
United Platform Team
```

---

### 7. Reset Password

**Purpose**: Set new password using reset token  
**Triggered By**: User clicks link in email, enters new password  
**Frontend Page**: `/reset-password?token=abc123`

**Endpoint**: `POST /api/v1/auth/reset-password`

**Request Body**:
```json
{
  "token": "reset-token-abc123",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Backend Processing**:
1. Validate passwords match
2. Validate password strength
3. Find reset token in database:
   ```sql
   SELECT * FROM password_reset_tokens
   WHERE token = 'reset-token-abc123'
   AND expires_at > NOW()
   AND used = false;
   ```
4. If token invalid/expired → Return error
5. If valid:
   - Hash new password with bcrypt
   - Update user password:
     ```sql
     UPDATE users 
     SET password_hash = '$2b$10$newhash...', updated_at = NOW()
     WHERE id = 'user-uuid-1234';
     ```
   - Mark reset token as used:
     ```sql
     UPDATE password_reset_tokens
     SET used = true, used_at = NOW()
     WHERE token = 'reset-token-abc123';
     ```
   - Revoke all user's refresh tokens (force re-login everywhere):
     ```sql
     UPDATE refresh_tokens
     SET revoked = true
     WHERE user_id = 'user-uuid-1234';
     ```

**Success Response** (Status 200):
```json
{
  "success": true,
  "message": "Password updated successfully. Please login with your new password."
}
```

**Error Responses**:

**Invalid/expired token** (Status 400):
```json
{
  "success": false,
  "error": "Invalid reset link",
  "message": "This password reset link is invalid or has expired. Please request a new one."
}
```

**Weak password** (Status 400):
```json
{
  "success": false,
  "error": "Weak password",
  "message": "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
}
```

**Frontend Handling**:
1. Show success message
2. Redirect to login page after 3 seconds
3. Clear any stored tokens
4. User must login with new password

---

## Post Endpoints

### 8. Create Post

**Purpose**: Create new opportunity/project post  
**Triggered By**: Clicking "Submit" on Create Post page  
**Frontend Page**: `/create-post`  
**Who Can Use**: Any authenticated user (student or faculty)

**Endpoint**: `POST /api/v1/posts`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Machine Learning Research Project",
  "description": "Looking for talented students to collaborate on ML research focused on healthcare applications. We'll be working on predictive models for early disease detection using deep learning techniques.",
  "purpose": "Research Work",
  "skillRequirements": [
    {
      "skill": "Python",
      "requiredCount": 2
    },
    {
      "skill": "Machine Learning",
      "requiredCount": 2
    },
    {
      "skill": "TensorFlow",
      "requiredCount": 1
    },
    {
      "skill": "Data Analysis",
      "requiredCount": 1
    }
  ],
  "deadline": "2024-12-31",
  "duration": "6 months",
  "location": "On-campus",
  "isRemote": false,
  "additionalInfo": "Previous experience with healthcare data is a plus",
  "enableChatroom": true,
  "chatroomGraceDays": 3
}
```

**Field Validations**:
- `title`: Required, 10-200 characters
- `description`: Required, 50-2000 characters
- `purpose`: Required, enum: ["Research Work", "Projects", "Hackathons"]
- `skillRequirements`: Required, array with at least 1 skill, max 10 skills
  - Each: `skill` (string), `requiredCount` (number 1-10)
- `deadline`: Required, must be future date
- `duration`: Optional, string
- `enableChatroom`: Optional, boolean, default true

**Backend Processing**:
1. Extract user ID from JWT token
2. Validate all fields
3. Verify all skills exist in allowed skills list
4. Generate unique post ID
5. Calculate total members needed (sum of all requiredCounts)
6. Begin database transaction
7. Insert into posts table:
   ```sql
   INSERT INTO posts (
     id, title, description, purpose, deadline, duration,
     location, is_remote, additional_info,
     author_id, total_members_needed, current_members,
     enable_chatroom, chatroom_grace_days,
     status, created_at, updated_at
   ) VALUES (
     'post-uuid-1234', 'Machine Learning Research Project',
     'Looking for talented students...', 'Research Work',
     '2024-12-31', '6 months', 'On-campus', false,
     'Previous experience...', 'user-uuid-1234',
     6, 0, true, 3, 'open', NOW(), NOW()
   );
   ```
8. Insert skill requirements:
   ```sql
   INSERT INTO skill_requirements (
     id, post_id, skill, required_count, accepted_count
   ) VALUES
   ('skill-req-1', 'post-uuid-1234', 'Python', 2, 0),
   ('skill-req-2', 'post-uuid-1234', 'Machine Learning', 2, 0),
   ('skill-req-3', 'post-uuid-1234', 'TensorFlow', 1, 0),
   ('skill-req-4', 'post-uuid-1234', 'Data Analysis', 1, 0);
   ```
9. Commit transaction
10. Fetch author details for response
11. Return created post

**Success Response** (Status 201):
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": "post-uuid-1234",
      "title": "Machine Learning Research Project",
      "description": "Looking for talented students...",
      "purpose": "Research Work",
      "deadline": "2024-12-31",
      "duration": "6 months",
      "location": "On-campus",
      "isRemote": false,
      "additionalInfo": "Previous experience...",
      "author": {
        "id": "user-uuid-1234",
        "name": "Dr. Jane Smith",
        "type": "faculty",
        "avatar": "https://storage.../profile.jpg"
      },
      "skillRequirements": [
        {
          "skill": "Python",
          "requiredCount": 2,
          "acceptedCount": 0
        },
        {
          "skill": "Machine Learning",
          "requiredCount": 2,
          "acceptedCount": 0
        },
        {
          "skill": "TensorFlow",
          "requiredCount": 1,
          "acceptedCount": 0
        },
        {
          "skill": "Data Analysis",
          "requiredCount": 1,
          "acceptedCount": 0
        }
      ],
      "totalMembersNeeded": 6,
      "currentMembers": 0,
      "applicationsCount": 0,
      "status": "open",
      "enableChatroom": true,
      "chatroomGraceDays": 3,
      "createdAt": "2024-11-11T15:30:00Z",
      "updatedAt": "2024-11-11T15:30:00Z"
    }
  }
}
```

**Error Responses**:

**Validation error** (Status 400):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be at least 10 characters"
    },
    {
      "field": "deadline",
      "message": "Deadline must be a future date"
    }
  ]
}
```

**Unauthorized** (Status 401):
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Please login to create a post"
}
```

**Frontend Handling After Success**:
1. Show success message: "Post created successfully!"
2. Redirect to post detail page: `/post/post-uuid-1234`
3. Update user's posts list if on dashboard
4. Post now visible in Home feed for all users

---

### 9. Get All Posts

**Purpose**: Retrieve list of all available posts/opportunities  
**Triggered By**: Loading Home page  
**Frontend Page**: `/home`  
**Who Can Use**: Any user (authenticated or not for public posts)

**Endpoint**: `GET /api/v1/posts`

**Query Parameters**:
```
?page=1                     // Page number (default: 1)
&limit=20                   // Posts per page (default: 20, max: 100)
&purpose=Research Work      // Filter by purpose
&skills=Python,React        // Filter by skills (comma-separated)
&status=open                // Filter by status (open/closed/filled)
&sortBy=createdAt           // Sort field (createdAt/deadline/popularity)
&sortOrder=desc             // Sort order (asc/desc)
&search=machine learning    // Search in title/description
&authorId=user-uuid         // Filter by specific author
```

**Full Example**:
```
GET /api/v1/posts?page=1&limit=10&purpose=Research Work&skills=Python&status=open&sortBy=deadline&sortOrder=asc
```

**Backend Processing**:
1. Parse query parameters
2. Build SQL query with filters:
   ```sql
   SELECT 
     p.*,
     u.id as author_id, u.first_name, u.last_name, 
     u.role, u.profile_picture,
     COUNT(DISTINCT a.id) as applications_count
   FROM posts p
   JOIN users u ON p.author_id = u.id
   LEFT JOIN applications a ON p.id = a.post_id
   WHERE p.status = 'open'
     AND p.purpose = 'Research Work'
     AND EXISTS (
       SELECT 1 FROM skill_requirements sr 
       WHERE sr.post_id = p.id AND sr.skill IN ('Python')
     )
     AND (p.title ILIKE '%machine learning%' 
          OR p.description ILIKE '%machine learning%')
   GROUP BY p.id, u.id
   ORDER BY p.deadline ASC
   LIMIT 10 OFFSET 0;
   ```
3. For each post, fetch skill requirements:
   ```sql
   SELECT skill, required_count, accepted_count
   FROM skill_requirements
   WHERE post_id IN ('post-1', 'post-2', ...);
   ```
4. Calculate pagination metadata
5. Format and return results

**Success Response** (Status 200):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post-uuid-1234",
        "title": "Machine Learning Research Project",
        "description": "Looking for talented students...",
        "purpose": "Research Work",
        "author": {
          "id": "user-uuid-5678",
          "name": "Dr. Jane Smith",
          "type": "faculty",
          "avatar": "https://storage.../profile.jpg"
        },
        "skillRequirements": [
          {
            "skill": "Python",
            "requiredCount": 2,
            "acceptedCount": 1
          },
          {
            "skill": "Machine Learning",
            "requiredCount": 2,
            "acceptedCount": 0
          }
        ],
        "totalMembersNeeded": 6,
        "currentMembers": 1,
        "applicationsCount": 8,
        "status": "open",
        "deadline": "2024-12-31",
        "duration": "6 months",
        "location": "On-campus",
        "isRemote": false,
        "createdAt": "2024-11-01T10:00:00Z",
        "updatedAt": "2024-11-10T14:20:00Z"
      },
      {
        "id": "post-uuid-5678",
        "title": "Web Development Hackathon Team",
        "description": "Join our team for upcoming national hackathon...",
        "purpose": "Hackathons",
        "author": {
          "id": "user-uuid-9012",
          "name": "John Doe",
          "type": "student",
          "avatar": "https://storage.../avatar.jpg"
        },
        "skillRequirements": [
          {
            "skill": "React",
            "requiredCount": 2,
            "acceptedCount": 2
          },
          {
            "skill": "Node.js",
            "requiredCount": 1,
            "acceptedCount": 1
          }
        ],
        "totalMembersNeeded": 3,
        "currentMembers": 3,
        "applicationsCount": 12,
        "status": "filled",
        "deadline": "2024-11-30",
        "duration": "1 month",
        "location": "Remote",
        "isRemote": true,
        "createdAt": "2024-10-20T09:00:00Z",
        "updatedAt": "2024-11-05T16:45:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 94,
      "postsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**Frontend Handling**:
1. Display posts in grid/list format
2. Show loading state while fetching
3. Render PostCard component for each post
4. Implement infinite scroll or pagination buttons
5. Update filters when user changes them
6. Fetch next page when scrolling or clicking "Next"

---

This document continues with all remaining endpoints following the same detailed structure. Each endpoint includes:
- Purpose and when it's triggered
- Full request/response formats
- All possible error scenarios
- Database operations
- Frontend handling

**To continue**: The documentation will cover all remaining endpoints (60+ total) including Applications, Invitations, Chatrooms, Messages, Notifications, Connections, File Uploads, and more in the same comprehensive detail.

