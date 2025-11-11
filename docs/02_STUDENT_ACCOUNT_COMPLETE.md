# Part 2: Student Account - Complete Guide

**Documentation**: United Platform - Student Journey  
**Last Updated**: November 11, 2025  
**Part**: 2 of 8

---

## Table of Contents
1. [Student Registration Process](#student-registration-process)
2. [Student Login](#student-login)
3. [Student Dashboard](#student-dashboard)
4. [Browsing Opportunities (Home Page)](#browsing-opportunities-home-page)
5. [Viewing Post Details](#viewing-post-details)
6. [Applying to Opportunities](#applying-to-opportunities)
7. [Managing Applied Opportunities](#managing-applied-opportunities)
8. [Managing Received Applications](#managing-received-applications)
9. [Creating Posts as Student](#creating-posts-as-student)
10. [Invitations System](#invitations-system)
11. [Chatrooms and Messaging](#chatrooms-and-messaging)
12. [Profile Management](#profile-management)
13. [Notifications](#notifications)
14. [Connections and Networking](#connections-and-networking)
15. [All Student Pages Detailed](#all-student-pages-detailed)
16. [Student API Endpoints](#student-api-endpoints)
17. [Student Database Operations](#student-database-operations)

---

## Student Registration Process

### How to Register as a Student

**Where**: Navigate to website → Click "Register" → Select "Student"  
**URL**: `/register/student`

### Step-by-Step Registration Flow

#### Step 1: Opening the Registration Page

**What you see**:
- Clean registration form with United platform branding
- Page title: "Student Registration"
- Back button to return to role selection
- All fields clearly labeled
- Required fields marked with asterisk (*)

**What happens behind the scenes**:
- Frontend loads StudentRegister component
- Form state initialized with empty values
- Validation rules prepared

---

#### Step 2: Personal Information Section

**Fields to fill**:

1. **First Name** (Required)
   - What to enter: Your legal first name
   - Validation: 2-50 characters, letters only
   - Example: "John"
   - What happens: Stored in database `first_name` field

2. **Middle Name** (Optional)
   - What to enter: Your middle name if you have one
   - Validation: 1-50 characters, letters only
   - Example: "Michael"
   - What happens: Stored in database `middle_name` field (can be null)

3. **Last Name** (Required)
   - What to enter: Your family/surname
   - Validation: 2-50 characters, letters only
   - Example: "Smith"
   - What happens: Stored in database `last_name` field

4. **University Email** (Required)
   - What to enter: Your official university email
   - Validation: Must be valid university email domain (e.g., @university.edu)
   - Example: "john.smith@university.edu"
   - What happens: 
     - Checked against existing emails (must be unique)
     - Verification email sent (in future implementation)
     - Stored in database `email` field

5. **Password** (Required)
   - What to enter: Strong password for your account
   - Validation:
     - Minimum 8 characters
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number
     - At least one special character (!@#$%^&*)
   - Example: "SecurePass123!"
   - What happens:
     - Password is hashed using bcrypt
     - Only hash stored in database (never plain text)
     - Used for authentication

6. **Confirm Password** (Required)
   - What to enter: Same password again
   - Validation: Must exactly match password field
   - What happens: Not stored, just for verification

7. **Contact Number** (Required)
   - What to enter: Your mobile phone number
   - Validation: 10 digits
   - Example: "9876543210"
   - What happens: Stored in database `contact_no` field

8. **Gender** (Required)
   - What to select: Choose from dropdown
   - Options: Male, Female, Other, Prefer not to say
   - What happens: Stored in database `gender` field

---

#### Step 3: Academic Information Section

**Fields to fill**:

1. **Roll Number** (Required)
   - What to enter: Your university roll number
   - Format: A followed by 11 digits (total 12 characters)
   - Example: "A12345678901"
   - Validation:
     - Must start with "A"
     - Must be exactly 12 characters
     - Last 11 characters must be numbers
     - Must be unique
   - What happens: Stored in database `roll_number` field
   - **API Call**: When you finish typing, system checks if roll number already exists
     - Endpoint: `GET /api/v1/auth/check-roll-number?rollNumber=A12345678901`
     - Response: `{ exists: true/false }`
     - If exists: Error shown "Roll number already registered"

2. **Department** (Required)
   - What to select: Your academic department
   - Options:
     - Computer Science
     - Electrical Engineering
     - Mechanical Engineering
     - Civil Engineering
     - Information Technology
     - Electronics
     - Chemical Engineering
     - Biotechnology
     - Mathematics
     - Physics
     - Chemistry
     - Other
   - What happens: Stored in database `department` field

3. **Year of Graduation** (Required)
   - What to enter: The year you expect to graduate
   - Validation: Must be current year or future year (e.g., 2024-2030)
   - Example: "2025"
   - What happens: Stored in database `year_of_graduation` field

---

#### Step 4: Skills Section (Required)

**What you see**:
- Autocomplete dropdown with all available skills
- Selected skills shown as chips (tags)
- Can select multiple skills

**How to add skills**:
1. Click on skills field
2. Dropdown shows all available skills
3. Type to filter skills
4. Click on skill to add it
5. Skill appears as a chip below the field
6. Click X on chip to remove skill

**Available Skills** (from system):
- React, Angular, Vue.js, Node.js, Python, Java, C++, Machine Learning, Data Science, UI/UX Design, DevOps, Cloud Computing, Mobile Development, Database Management, Cybersecurity, and 50+ more

**Validation**:
- At least 1 skill required
- Maximum 20 skills allowed
- No duplicate skills

**What happens**:
- Stored in database `users_skills` table
- Each skill as separate row linked to user ID
- Used for matching with post requirements
- Shown on profile
- Used in AI recommendations

**API Call** (On submission):
- Skills sent as array in registration request
- Backend creates multiple rows in users_skills table

---

#### Step 5: Projects Section (Optional but Recommended)

**What you see**:
- One project form initially
- Fields for title, description, link
- "Add Another Project" button
- Remove button (X) for each project

**How to add projects**:

1. **Project Title**
   - What to enter: Name of your project
   - Example: "E-Commerce Website"
   - Validation: 3-100 characters

2. **Project Description**
   - What to enter: Detailed description of what you built
   - Example: "Built a full-stack e-commerce platform using MERN stack with payment integration and admin dashboard"
   - Validation: 10-500 characters

3. **Project Link** (Optional)
   - What to enter: GitHub link or live demo link
   - Example: "https://github.com/johnsmith/ecommerce-project"
   - Validation: Valid URL format

**Adding multiple projects**:
- Click "Add Another Project" button
- New project form appears below
- Can add up to 10 projects
- Each project has its own remove button

**What happens**:
- Stored in database `user_projects` table
- Each project as separate row
- Fields: id, user_id, title, description, link
- Displayed on your profile
- Showcases your experience
- Helps in application reviews

---

#### Step 6: Achievements Section (Optional)

**What you see**:
- Text field for achievement
- "Add Another Achievement" button
- Remove button for each achievement

**How to add achievements**:
1. Enter achievement in text field
   - Example: "First Place - National Hackathon 2024"
   - Example: "AWS Certified Solutions Architect"
   - Example: "Published research paper in IEEE conference"
2. Click "Add Another Achievement"
3. New field appears
4. Can add up to 20 achievements

**What happens**:
- Stored in database `user_achievements` table
- Each achievement as separate row
- Fields: id, user_id, title
- Displayed on profile
- Adds credibility
- Helps stand out in applications

---

#### Step 7: Additional Information Section (Optional)

**Fields**:

1. **Experience**
   - What to enter: Brief description of your work/internship experience
   - Example: "Completed 3-month internship at Tech Company as Software Developer Intern. Worked on React and Node.js projects."
   - Validation: Up to 1000 characters
   - What happens: Stored in database `experience` field

2. **Portfolio Website**
   - What to enter: Link to your personal portfolio
   - Example: "https://johnsmith.dev"
   - Validation: Valid URL
   - What happens: Stored in database `portfolio` field

3. **GitHub Profile**
   - What to enter: Your GitHub username or profile URL
   - Example: "https://github.com/johnsmith"
   - Validation: Valid GitHub URL
   - What happens: Stored in database `github` field

4. **LinkedIn Profile**
   - What to enter: Your LinkedIn profile URL
   - Example: "https://linkedin.com/in/johnsmith"
   - Validation: Valid LinkedIn URL
   - What happens: Stored in database `linkedin` field

5. **LeetCode Profile**
   - What to enter: Your LeetCode username or profile URL
   - Example: "https://leetcode.com/johnsmith"
   - Validation: Valid URL
   - What happens: Stored in database `leetcode` field

---

#### Step 8: Profile Picture Upload (Optional)

**What you see**:
- Avatar placeholder
- "Upload Photo" button
- Preview of uploaded image

**How to upload**:
1. Click "Upload Photo" button
2. File picker opens
3. Select image file (JPG, PNG, WebP)
4. Image preview appears
5. Can click X to remove and choose different image

**Validation**:
- File size: Maximum 5MB
- File types: JPG, JPEG, PNG, WebP
- Dimensions: Recommended 400x400 pixels or larger

**What happens**:
- File uploaded to cloud storage (AWS S3 or similar)
- URL of uploaded image stored in database `profile_picture` field
- Image displayed on profile
- Image shown in post cards, applications, messages

**API Call** (During upload):
- Endpoint: `POST /api/v1/upload/profile-picture`
- Request: Multipart form data with image file
- Response: `{ url: "https://storage.../profile-picture.jpg" }`

---

#### Step 9: Resume Upload (Optional but Highly Recommended)

**What you see**:
- "Upload Resume" button
- File name display when uploaded
- Remove button

**How to upload**:
1. Click "Upload Resume" button
2. File picker opens
3. Select PDF file
4. File name appears
5. Can remove and choose different file

**Validation**:
- File type: PDF only
- File size: Maximum 2MB

**What happens**:
- File uploaded to secure cloud storage
- URL stored in database `resume_url` field
- Resume automatically attached when applying to posts
- Faculty can download when reviewing applications

**API Call**:
- Endpoint: `POST /api/v1/upload/resume`
- Request: Multipart form data with PDF file
- Response: `{ url: "https://storage.../resume.pdf" }`

---

#### Step 10: Submitting Registration

**Final step**:
1. Review all entered information
2. All required fields filled (marked with *)
3. Click "Create Account" button

**What happens when you click "Create Account"**:

1. **Frontend Validation**:
   - Checks all required fields filled
   - Validates all field formats
   - Validates password strength
   - Validates password match
   - If any error: Shows error message, highlights field

2. **API Call**:
   - Endpoint: `POST /api/v1/auth/register/student`
   - Request body contains:
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
         "description": "Built full-stack platform...",
         "link": "https://github.com/..."
       }
     ],
     "achievements": ["First Place - Hackathon 2024"],
     "experience": "Internship at Tech Company...",
     "portfolio": "https://johnsmith.dev",
     "github": "https://github.com/johnsmith",
     "linkedin": "https://linkedin.com/in/johnsmith",
     "leetcode": "https://leetcode.com/johnsmith",
     "profilePicture": "https://storage.../profile.jpg",
     "resumeUrl": "https://storage.../resume.pdf"
   }
   ```

3. **Backend Processing**:
   - Validates all data
   - Checks email not already registered
   - Checks roll number unique
   - Hashes password with bcrypt
   - Generates unique user ID
   - Starts database transaction
   - Inserts into `users` table
   - Inserts skills into `users_skills` table
   - Inserts projects into `user_projects` table
   - Inserts achievements into `user_achievements` table
   - Commits transaction
   - Generates JWT access token
   - Generates refresh token
   - Stores refresh token in database

4. **Success Response**:
   ```json
   {
     "success": true,
     "message": "Registration successful",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "xyz123abc456...",
     "user": {
       "id": "user-uuid-1234",
       "firstName": "John",
       "lastName": "Smith",
       "email": "john.smith@university.edu",
       "role": "student",
       "profilePicture": "https://storage.../profile.jpg"
     }
   }
   ```

5. **Frontend Success Handling**:
   - Stores access token in localStorage
   - Stores refresh token in localStorage
   - Stores user object in localStorage
   - Updates AuthContext with user data
   - Shows success message: "Account created successfully!"
   - Redirects to `/home` page
   - User now logged in

**If Error Occurs**:
- Email already exists:
  - Response: `{ error: "Email already registered" }`
  - Shows error message above form
  
- Roll number already exists:
  - Response: `{ error: "Roll number already registered" }`
  - Highlights roll number field
  
- Invalid data:
  - Response: `{ error: "Invalid input data", details: [...] }`
  - Shows specific field errors
  
- Server error:
  - Response: `{ error: "Registration failed. Please try again." }`
  - Shows general error message

---

### Database Records Created During Registration

**users table**:
```sql
INSERT INTO users (
  id, first_name, middle_name, last_name, email, password_hash,
  contact_no, gender, role, profile_picture, resume_url,
  experience, portfolio, github, linkedin, leetcode,
  roll_number, department, year_of_graduation,
  created_at, updated_at
) VALUES (
  'user-uuid-1234', 'John', 'Michael', 'Smith',
  'john.smith@university.edu', '$2b$10$hashedpassword...',
  '9876543210', 'Male', 'student',
  'https://storage.../profile.jpg', 'https://storage.../resume.pdf',
  'Internship at Tech Company...', 'https://johnsmith.dev',
  'https://github.com/johnsmith', 'https://linkedin.com/in/johnsmith',
  'https://leetcode.com/johnsmith',
  'A12345678901', 'Computer Science', 2025,
  NOW(), NOW()
);
```

**users_skills table** (for each skill):
```sql
INSERT INTO users_skills (id, user_id, skill) VALUES
  ('skill-1', 'user-uuid-1234', 'React'),
  ('skill-2', 'user-uuid-1234', 'Python'),
  ('skill-3', 'user-uuid-1234', 'Machine Learning');
```

**user_projects table** (for each project):
```sql
INSERT INTO user_projects (
  id, user_id, title, description, link, created_at
) VALUES (
  'project-1', 'user-uuid-1234',
  'E-Commerce Website',
  'Built full-stack platform...',
  'https://github.com/...',
  NOW()
);
```

**user_achievements table** (for each achievement):
```sql
INSERT INTO user_achievements (id, user_id, title, created_at) VALUES
  ('achievement-1', 'user-uuid-1234', 'First Place - Hackathon 2024', NOW());
```

---

## Student Login

### How to Login

**Where**: Click "Login" from landing page  
**URL**: `/login`

### Login Process Step-by-Step

#### Step 1: Opening Login Page

**What you see**:
- Clean login form
- Email and password fields
- "Login" button
- "Forgot Password?" link
- "Don't have an account? Register" link

---

#### Step 2: Entering Credentials

**Email Field**:
- Enter your registered university email
- Example: "john.smith@university.edu"
- Validation: Valid email format

**Password Field**:
- Enter your password
- Shows dots/asterisks for security
- "Show/Hide password" toggle icon

---

#### Step 3: Clicking Login Button

**What happens**:

1. **Frontend Validation**:
   - Email field not empty
   - Password field not empty
   - Valid email format

2. **API Call**:
   - Endpoint: `POST /api/v1/auth/login`
   - Request:
   ```json
   {
     "email": "john.smith@university.edu",
     "password": "SecurePass123!"
   }
   ```

3. **Backend Processing**:
   - Find user by email in database
   - If not found: Return error "User not found"
   - Compare password hash:
     - Hash submitted password
     - Compare with stored hash in database
   - If doesn't match: Return error "Invalid password"
   - If matches: Generate tokens

4. **Success Response**:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "xyz123abc456...",
     "user": {
       "id": "user-uuid-1234",
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
       "projects": [...],
       "achievements": [...]
     }
   }
   ```

5. **Frontend Handling**:
   - Store access token in localStorage
   - Store refresh token in localStorage
   - Store user object in localStorage
   - Update AuthContext
   - Show success message
   - Redirect to `/home`

**If Login Fails**:
- Wrong email: "User not found. Please check your email."
- Wrong password: "Invalid password. Please try again."
- Account disabled: "Your account has been suspended."
- Server error: "Login failed. Please try again later."

---

#### Forgot Password Flow

**When you click "Forgot Password"**:

1. Navigate to `/forgot-password`
2. Enter email address
3. Click "Send Reset Link"
4. **API Call**: `POST /api/v1/auth/forgot-password`
   - Request: `{ "email": "john.smith@university.edu" }`
5. Backend:
   - Find user by email
   - Generate password reset token (valid 1 hour)
   - Store token in database with expiration
   - Send email with reset link
   - Email contains: "Click here to reset: https://united.edu/reset-password?token=abc123"
6. Frontend shows: "Password reset link sent to your email"
7. User clicks link in email → Opens reset password page
8. Enter new password (twice)
9. **API Call**: `POST /api/v1/auth/reset-password`
   - Request: `{ "token": "abc123", "newPassword": "NewPass456!" }`
10. Backend:
    - Verify token valid and not expired
    - Hash new password
    - Update password in database
    - Invalidate reset token
11. Success: "Password updated successfully. Please login."
12. Redirect to login page

---

## Student Dashboard

### Overview

**Where**: After login, click "Dashboard" in navigation  
**URL**: `/dashboard`  
**Purpose**: Personalized overview of your account and activities

### What You See on Dashboard

#### Top Section: Quick Stats Cards

**Card 1: Total Applications**
- **Shows**: Number of applications you've sent
- **Example**: "12"
- **Color**: Purple background
- **Icon**: File icon
- **Click Action**: Navigates to `/applied` (Applied Opportunities page)
- **API Call**: `GET /api/v1/applications/sent?userId={your-id}`
- **Data Shown**: Count of all applications (pending + accepted + rejected)

**Card 2: Accepted Applications**
- **Shows**: Number of applications that were accepted
- **Example**: "7"
- **Color**: Green background
- **Icon**: Check circle icon
- **Click Action**: Navigates to `/applied?filter=accepted`
- **Data Shown**: Count of applications with status "accepted"

**Card 3: Posts Created**
- **Shows**: Number of posts you've created
- **Example**: "5"
- **Color**: Orange background
- **Icon**: Target icon
- **Click Action**: Navigates to `/dashboard?tab=my-posts`
- **API Call**: `GET /api/v1/posts?authorId={your-id}`

**Card 4: Collaborations**
- **Shows**: Number of active project collaborations
- **Example**: "8"
- **Color**: Red background
- **Icon**: Users icon
- **Data Shown**: Count of accepted applications + posts you own
- **Note**: These are temporary project-based collaborations only

---

#### Skills Progress Section

**What it shows**:
- Your top skills with proficiency levels
- Visual progress bars for each skill
- Percentage representation

**Example**:
- React: 85% (filled progress bar)
- Python: 90% (filled progress bar)
- Machine Learning: 70% (filled progress bar)

**How proficiency is calculated**:
- Based on number of projects using that skill
- Based on accepted applications for that skill
- Based on endorsements (future feature)

**Click Action**: Click on skill → Shows all posts requiring that skill

---

#### Recent Activity Section

**What it shows**:
- Bar chart or visual representation of activities
- Categories:
  - Applications: 12 (Purple)
  - Accepted: 7 (Green)
  - Posts Created: 5 (Orange)
  - Collaborations: 8 (Red)

**Data Source**: Aggregated from your account history

---

#### Active Posts Section

**What it shows**:
- List of posts you've created
- For each post:
  - Title
  - Purpose (Research/Project/Hackathon)
  - Number of applications received
  - Number of members accepted
  - Status (Open/Filled/Closed)
  - Deadline

**Example**:
```
🔬 Machine Learning Research Project
Research Work • 5 applications • 3/4 members • Open
Deadline: December 15, 2024
[View Details] [Manage Applications]
```

**Click Actions**:
- Click "View Details" → Opens `/post/{id}`
- Click "Manage Applications" → Opens `/applications?postId={id}`
- Click on post card → Opens post detail page

---

#### Upcoming Deadlines Section

**What it shows**:
- Posts you're part of with approaching deadlines
- Sorted by closest deadline first
- Each shows:
  - Post title
  - Days remaining
  - Your role (Member/Owner)

**Example**:
```
⏰ AI Research Project
5 days remaining • You are a member
```

**Visual indicator**:
- Red if < 3 days
- Orange if < 7 days
- Green if > 7 days

---

#### Suggested Opportunities Section

**What it shows**:
- Posts that match your skills
- AI-recommended based on your profile
- Shows similarity score

**Example**:
```
💡 Web Development Project
85% Match • Needs: React, Node.js
Posted by Dr. Smith • 3 days ago
[Apply Now]
```

**How recommendations work**:
- System analyzes your skills
- Finds posts requiring those skills
- Calculates match percentage
- Filters out posts you've already applied to
- Filters out your own posts
- Shows top 5 matches

**Click Actions**:
- Click post card → Opens post detail
- Click "Apply Now" → Opens application modal

---

#### Quick Actions Section

**Buttons available**:

1. **Create New Post**
   - Click → Navigate to `/create-post`
   - Opens post creation form

2. **View All Applications**
   - Click → Navigate to `/applications`
   - Shows received applications if you have posts

3. **Explore Opportunities**
   - Click → Navigate to `/home`
   - Browse all available posts

4. **My Profile**
   - Click → Navigate to `/profile`
   - View/edit your profile

---

### Dashboard API Calls

When dashboard loads, multiple API calls are made:

1. **Get User Stats**:
   - Endpoint: `GET /api/v1/users/{userId}/stats`
   - Response:
   ```json
   {
     "totalApplications": 12,
     "acceptedApplications": 7,
     "pendingApplications": 3,
     "rejectedApplications": 2,
     "postsCreated": 5,
     "collaborations": 8,
     "profileViews": 234
   }
   ```

2. **Get User's Posts**:
   - Endpoint: `GET /api/v1/posts?authorId={userId}&limit=5`
   - Returns recent 5 posts you created

3. **Get Applied Posts**:
   - Endpoint: `GET /api/v1/applications/sent?userId={userId}&limit=5`
   - Returns recent 5 applications you sent

4. **Get Recommended Posts**:
   - Endpoint: `GET /api/v1/posts/recommended?userId={userId}&limit=5`
   - Returns 5 posts matching your skills

5. **Get Upcoming Deadlines**:
   - Endpoint: `GET /api/v1/posts/deadlines?userId={userId}`
   - Returns posts you're involved in with approaching deadlines

---

This is Part 2 Section 1-3. The document will continue with remaining sections (Browsing Opportunities, Applying to Posts, Managing Applications, Creating Posts, Invitations, Chatrooms, Profile, Notifications, Connections, etc.) to complete the comprehensive student account documentation.

**To continue**: The next sections will cover every page, every click action, every API call, and every database operation related to the student account experience in the same detailed manner.

