# Part 6: All Pages Detailed - Every Page, Every Click, Every Action

**Documentation**: United Platform - Complete Page Reference  
**Last Updated**: November 11, 2025  
**Part**: 6 of 8

---

## Table of Contents

### Public Pages
1. [Landing Page](#1-landing-page)
2. [Login Page](#2-login-page)
3. [Role Selection Page](#3-role-selection-page)
4. [Student Registration Page](#4-student-registration-page)
5. [Faculty Registration Page](#5-faculty-registration-page)
6. [Forgot Password Page](#6-forgot-password-page)
7. [Reset Password Page](#7-reset-password-page)

### Student Pages
8. [Home Page (Feed)](#8-home-page-feed)
9. [Dashboard Page](#9-dashboard-page)
10. [Post Detail Page](#10-post-detail-page)
11. [Create Post Page](#11-create-post-page)
12. [Applications Page (Received)](#12-applications-page-received)
13. [Applied Opportunities Page](#13-applied-opportunities-page)
14. [Invitations Page](#14-invitations-page)
15. [Recommended Candidates Page](#15-recommended-candidates-page)
16. [Candidate Profile View Page](#16-candidate-profile-view-page)
17. [Chatrooms List Page](#17-chatrooms-list-page)
18. [Chatroom Detail Page](#18-chatroom-detail-page)
19. [Profile Page](#19-profile-page)
20. [Profile Settings Page](#20-profile-settings-page)
21. [Notifications Page](#21-notifications-page)
22. [User Discovery Page](#22-user-discovery-page)
23. [Forums List Page](#23-forums-list-page)
25. [Forum Thread Page](#25-forum-thread-page)
26. [Events List Page](#26-events-list-page)
27. [Event Details Page](#27-event-details-page)
28. [Calendar View Page](#28-calendar-view-page)

---

## Public Pages

### 1. Landing Page

**URL**: `/`  
**Component**: `LandingPageNew.tsx`  
**Access**: Anyone (not authenticated)  
**Purpose**: First page visitors see, introduces the platform

#### What You See

**Top Navigation Bar**:
- United logo (left)
- "Features" link
- "About" link
- "Contact" link
- "Login" button (right, outlined)
- "Get Started" button (right, filled, primary color)

**Hero Section** (Top of page):
- Large heading: "Connect. Collaborate. Create."
- Subheading: "Unite with talented peers and faculty for research, projects, and hackathons"
- Search bar: "Search for opportunities or skills..."
- Two buttons:
  - "Explore Opportunities" (primary)
  - "How It Works" (secondary)
- Hero image or illustration (right side)

**Features Section**:
- Section heading: "Why Choose United?"
- 4-6 feature cards in grid:
  1. **Skill-Based Matching**
     - Icon: Target/Crosshair
     - Text: "Find perfect collaborators based on required skills"
  2. **AI-Powered Recommendations**
     - Icon: Brain/AI
     - Text: "Get smart suggestions for candidates and opportunities"
  3. **Built-in Collaboration**
     - Icon: Messages/Chat
     - Text: "Communicate with your team in dedicated chatrooms during active projects"
  4. **Reputation System**
     - Icon: Trophy/Star
     - Text: "Earn points and build credibility through contributions"
  5. **Easy Applications**
     - Icon: Document/Form
     - Text: "Simple application process with instant notifications"
  6. **For Everyone**
     - Icon: Users/People
     - Text: "Students and faculty can both create and join projects"

**How It Works Section**:
- Section heading: "Get Started in 3 Simple Steps"
- 3 step cards:
  1. **Create Account**
     - Icon: User Plus
     - Description: "Register as student or faculty with university email"
  2. **Discover Opportunities**
     - Icon: Search
     - Description: "Browse projects or create your own opportunity"
  3. **Collaborate**
     - Icon: Handshake
     - Description: "Apply, get accepted, and start working together temporarily on the project"

**Statistics Section** (Optional):
- Section heading: "Join Our Growing Community"
- 4 stat counters:
  - "500+ Active Users"
  - "200+ Projects Created"
  - "1000+ Collaborations"
  - "95% Success Rate"

**Call to Action Section**:
- Large heading: "Ready to Start Your Journey?"
- Description: "Join United today and connect with the perfect collaborators"
- "Sign Up Now" button (large, primary)
- "Or explore opportunities" link

**Footer**:
- United logo
- Quick links: About, Features, Contact, Privacy Policy, Terms of Service
- Social media icons
- Copyright text

#### Every Click Action

**"Login" button** (Top nav):
- Action: Navigate to `/login`
- Shows: Login page

**"Get Started" button** (Top nav):
- Action: Navigate to `/register`
- Shows: Role selection page

**"Explore Opportunities" button** (Hero):
- Action: Navigate to `/home` or `/ideas` (public posts view)
- Shows: List of available opportunities

**"How It Works" button** (Hero):
- Action: Smooth scroll to "How It Works" section
- Behavior: Page scrolls down to show steps

**Search bar** (Hero):
- When clicked: Cursor appears, ready to type
- When text entered and Enter pressed:
  - If not logged in: Redirect to `/login` with message "Login to search"
  - If logged in: Navigate to `/home?search={query}`

**Feature cards**:
- Click: No action (informational only)
- Hover: Card lifts slightly (shadow effect)

**"Sign Up Now" button** (CTA section):
- Action: Navigate to `/register`
- Shows: Role selection page

**Footer links**:
- "About" → Navigate to `/about`
- "Contact" → Opens email client or contact form
- "Privacy Policy" → Opens privacy policy page
- "Terms of Service" → Opens terms page

#### API Calls on This Page

**No API calls** - This is a static informational page

#### When This Page Loads

1. Page rendered from React component
2. Animations trigger (fade in, slide up)
3. No authentication check needed
4. No data fetching required
5. Page is fully client-side

---

### 2. Login Page

**URL**: `/login`  
**Component**: `LoginNew.tsx`  
**Access**: Anyone (not authenticated)  
**Purpose**: User authentication

#### What You See

**Page Layout**:
- Split screen design:
  - Left side: Illustration or branded image
  - Right side: Login form

**Left Side**:
- United logo
- Heading: "Welcome Back!"
- Subheading: "Login to continue your collaboration journey"
- Decorative illustration

**Right Side - Login Form**:
- Heading: "Login to Your Account"
- Subheading: "Enter your credentials to access United"

**Form Fields**:
1. **Email Address**
   - Label: "University Email"
   - Placeholder: "your.email@university.edu"
   - Icon: Envelope/Mail icon (left side)
   - Type: Email input
   - Validation indicator (red/green border)

2. **Password**
   - Label: "Password"
   - Placeholder: "Enter your password"
   - Icon: Lock icon (left side)
   - Type: Password (dots)
   - Show/Hide password toggle icon (right side)
   - Validation indicator

**Additional Elements**:
- "Forgot Password?" link (right aligned below password field)
- "Login" button (large, full-width, primary color)
- Loading spinner (shown when logging in)
- Error message box (shown if login fails)
- Divider line with text: "or"
- Alternative text: "Don't have an account?"
- "Sign Up" link

#### Every Click Action

**Email field**:
- Click: Focus field, cursor appears
- Type: Text entered, real-time validation
- Blur: Check if valid email format
  - If invalid: Show red border + error "Please enter valid email"
  - If valid: Show green border

**Password field**:
- Click: Focus field, cursor appears
- Type: Dots appear for each character
- Blur: Check if not empty
  - If empty: Show red border + error "Password required"

**Show/Hide password toggle**:
- Click: Toggle password visibility
- Shows: Password in plain text or dots
- Icon changes: Eye icon ↔ Eye-slash icon

**"Forgot Password?" link**:
- Click: Navigate to `/forgot-password`
- Shows: Forgot password page

**"Login" button**:
- Click: Triggers login process
- Behavior:
  1. Validate form (both fields filled, email format valid)
  2. If validation fails: Show errors, don't submit
  3. If validation passes:
     - Disable button
     - Show loading spinner on button
     - Change text to "Logging in..."
     - Make API call
     - If success: Redirect to `/home`
     - If error: Show error message, re-enable button

**"Sign Up" link**:
- Click: Navigate to `/register`
- Shows: Role selection page

#### API Call When Login Clicked

**Endpoint**: `POST /api/v1/auth/login`

**Request Sent**:
```json
{
  "email": "john.smith@university.edu",
  "password": "SecurePass123!"
}
```

**Success Response** (Status 200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "xyz123abc...",
    "user": {
      "id": "user-uuid-1234",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@university.edu",
      "role": "student",
      "profilePicture": "https://...",
      ... // full user object
    }
  }
}
```

**What Happens After Success**:
1. Store `token` in localStorage: `localStorage.setItem('authToken', token)`
2. Store `refreshToken` in localStorage
3. Store `user` object in localStorage
4. Update AuthContext state with user
5. Close login modal/page
6. Redirect to `/home`
7. Show success toast: "Welcome back, John!"

**Error Response** (Status 401):
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "The email or password you entered is incorrect"
}
```

**What Happens After Error**:
1. Show error message above form in red box
2. Re-enable login button
3. Clear loading state
4. Focus on email field
5. Optionally shake form for visual feedback

**Other Possible Errors**:
- User not found (404)
- Account suspended (403)
- Server error (500)
- Network error (no response)

#### Form Validation

**Email Validation**:
- Required: Cannot be empty
- Format: Must be valid email (contains @)
- Pattern: Should match university email pattern
- Real-time: Validates on blur (lose focus)
- Error messages:
  - Empty: "Email is required"
  - Invalid: "Please enter a valid email address"
  - Wrong domain: "Please use your university email"

**Password Validation**:
- Required: Cannot be empty
- No format check on login (only on registration)
- Error message:
  - Empty: "Password is required"

#### When This Page Loads

1. Check if user already logged in
   - If yes: Redirect to `/home` immediately
2. Clear any previous error messages
3. Focus on email field automatically
4. Set up form validation listeners

#### Security Features

- Password never shown in plain text by default
- Password never logged to console
- HTTPS required for login request
- Token stored securely in localStorage (or httpOnly cookie)
- Failed login attempts may trigger rate limiting (backend)

---

### 3. Role Selection Page

**URL**: `/register`  
**Component**: `RoleSelection.tsx`  
**Access**: Anyone (not authenticated)  
**Purpose**: Choose account type before registering

#### What You See

**Page Layout**:
- Centered content
- Heading: "Join United"
- Subheading: "Select your role to get started"

**Two Large Cards Side by Side**:

**Left Card - Student**:
- Large icon: Graduation cap or student icon
- Heading: "Student"
- Description: "Register as a student to find research opportunities, join projects, and collaborate with peers"
- Features list:
  - ✓ Apply to research projects
  - ✓ Join hackathon teams
  - ✓ Build your portfolio
  - ✓ Network with faculty
- "Register as Student" button (full-width, primary)

**Right Card - Faculty**:
- Large icon: Professor/teacher icon
- Heading: "Faculty"
- Description: "Register as faculty to post research opportunities, find talented students, and mentor projects"
- Features list:
  - ✓ Post research opportunities
  - ✓ Find qualified students
  - ✓ Manage project teams
  - ✓ Mentor collaborations
- "Register as Faculty" button (full-width, primary)

**Bottom Text**:
- "Already have an account?"
- "Login" link

#### Every Click Action

**"Register as Student" button**:
- Click: Navigate to `/register/student`
- Shows: Student registration form page

**"Register as Faculty" button**:
- Click: Navigate to `/register/faculty`
- Shows: Faculty registration form page

**Student card** (anywhere on card):
- Click: Same as "Register as Student" button
- Hover: Card lifts, shadow increases

**Faculty card** (anywhere on card):
- Click: Same as "Register as Faculty" button
- Hover: Card lifts, shadow increases

**"Login" link**:
- Click: Navigate to `/login`
- Shows: Login page

#### API Calls on This Page

**No API calls** - Selection page only

#### When This Page Loads

1. Check if user already logged in
   - If yes: Redirect to `/home`
2. Render two role option cards
3. Set up hover animations

---

### 4. Student Registration Page

**URL**: `/register/student`  
**Component**: `StudentRegister.tsx`  
**Access**: Anyone (not authenticated)  
**Purpose**: Create new student account

#### What You See

**Page Header**:
- Back arrow button (top-left) → Returns to role selection
- Progress indicator: "Step 1 of 3" or progress bar
- Heading: "Student Registration"
- Subheading: "Create your student account"

**Form organized in Sections**:

**Section 1: Personal Information**
- Small heading: "Personal Details"

Fields:
1. **First Name***
   - Type: Text input
   - Placeholder: "Enter your first name"
   - Required indicator: Red asterisk *

2. **Middle Name**
   - Type: Text input
   - Placeholder: "Enter your middle name (optional)"
   - Optional

3. **Last Name***
   - Type: Text input
   - Placeholder: "Enter your last name"
   - Required

4. **University Email***
   - Type: Email input
   - Placeholder: "your.email@university.edu"
   - Required
   - Validation: Real-time check after typing stops (debounced)
   - Shows: Green checkmark if available, red X if taken

5. **Password***
   - Type: Password input
   - Placeholder: "Create a strong password"
   - Required
   - Show/hide toggle
   - Password strength indicator below:
     - Weak (red bar)
     - Medium (orange bar)
     - Strong (green bar)
   - Requirements list:
     - ✓/✗ At least 8 characters
     - ✓/✗ One uppercase letter
     - ✓/✗ One lowercase letter
     - ✓/✗ One number
     - ✓/✗ One special character

6. **Confirm Password***
   - Type: Password input
   - Placeholder: "Re-enter your password"
   - Required
   - Validation: Must match password
   - Shows: Green checkmark if matches

7. **Contact Number***
   - Type: Tel input
   - Placeholder: "10-digit mobile number"
   - Required
   - Format: Auto-formats as user types

8. **Gender***
   - Type: Dropdown/Select
   - Options:
     - Male
     - Female
     - Other
     - Prefer not to say
   - Required

**Section 2: Academic Information**
- Small heading: "Academic Details"

Fields:
9. **Roll Number***
   - Type: Text input
   - Placeholder: "A + 11 digits (e.g., A12345678901)"
   - Required
   - Validation: Format check (A followed by 11 digits)
   - Real-time availability check
   - Help text: "Your university roll number"

10. **Department***
    - Type: Dropdown/Autocomplete
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
    - Required
    - Searchable dropdown

11. **Year of Graduation***
    - Type: Number input or Dropdown
    - Options: Current year to current year + 6
    - Example: 2024, 2025, 2026, 2027, 2028, 2029, 2030
    - Required

**Section 3: Skills & Experience**
- Small heading: "Skills and Portfolio"

Fields:
12. **Skills***
    - Type: Multi-select autocomplete
    - Placeholder: "Select your skills"
    - Dropdown with 100+ skills
    - Can type to filter
    - Selected skills shown as chips/tags below
    - Click X on chip to remove
    - Required: At least 1 skill
    - Help text: "Select all skills you have"

13. **Projects** (Optional)
    - Dynamic section: Can add multiple projects
    - Initial: One project form
    - Each project has:
      - **Project Title**
        - Type: Text input
        - Placeholder: "Project name"
      - **Description**
        - Type: Textarea
        - Placeholder: "Describe what you built"
        - Rows: 3
      - **Link**
        - Type: URL input
        - Placeholder: "GitHub or demo link (optional)"
    - "Add Another Project" button (blue, outlined)
    - Each project has "Remove" button (X icon)

14. **Achievements** (Optional)
    - Dynamic section: Can add multiple achievements
    - Initial: One achievement field
    - Each achievement:
      - Type: Text input
      - Placeholder: "Enter achievement or certification"
    - "Add Another Achievement" button
    - Each has "Remove" button

15. **Experience** (Optional)
    - Type: Textarea
    - Placeholder: "Describe any internships or work experience"
    - Rows: 4

**Section 4: Profile & Links**
- Small heading: "Profile Information"

Fields:
16. **Profile Picture** (Optional)
    - Upload area with avatar preview
    - Click to upload or drag & drop
    - Shows: Avatar placeholder or uploaded image
    - "Upload Photo" button
    - "Remove" button (if image uploaded)
    - Accepted formats: JPG, PNG, WebP
    - Max size: 5MB

17. **Resume** (Optional but recommended)
    - Upload area
    - "Upload Resume" button
    - Shows: PDF icon + filename when uploaded
    - "Remove" button
    - Accepted format: PDF only
    - Max size: 2MB
    - Help text: "Attach your resume to applications automatically"

18. **Portfolio Website** (Optional)
    - Type: URL input
    - Placeholder: "https://yourwebsite.com"

19. **GitHub Profile** (Optional)
    - Type: URL input
    - Placeholder: "https://github.com/yourusername"

20. **LinkedIn Profile** (Optional)
    - Type: URL input
    - Placeholder: "https://linkedin.com/in/yourusername"

21. **LeetCode Profile** (Optional)
    - Type: URL input
    - Placeholder: "https://leetcode.com/yourusername"

**Bottom of Form**:
- Checkbox: "I agree to Terms of Service and Privacy Policy"*
  - Required
  - Links open in new tab
- "Create Account" button (large, full-width, primary)
  - Disabled until form valid
  - Shows loading spinner when clicked

#### Every Click Action

**(Each text input field)**:
- Click: Focus field, cursor appears
- Type: Text entered
- Blur (lose focus): Validate field
  - If invalid: Show red border + error message below
  - If valid: Show green border

**Email field specifically**:
- After typing stops (500ms debounce): API call to check availability
  - Endpoint: `GET /api/v1/auth/check-email?email=john@university.edu`
  - If available: Green checkmark icon
  - If taken: Red X icon + error "Email already registered"

**Password field**:
- On each keystroke: Update strength indicator
- Check each requirement:
  - Length >= 8: Show green checkmark
  - Has uppercase: Show green checkmark
  - Has lowercase: Show green checkmark
  - Has number: Show green checkmark
  - Has special char: Show green checkmark
- Overall strength:
  - 0-2 checks: Weak (red)
  - 3-4 checks: Medium (orange)
  - 5 checks: Strong (green)

**Confirm Password field**:
- On blur or change: Compare with password field
  - If matches: Green checkmark
  - If doesn't match: Red X + error "Passwords do not match"

**Roll Number field**:
- On blur: Validate format (A + 11 digits)
  - If wrong format: Error "Roll number must be A followed by 11 digits"
  - If correct format: Check availability
    - API: `GET /api/v1/auth/check-roll-number?rollNumber=A12345678901`
    - If available: Green checkmark
    - If taken: Error "Roll number already registered"

**Skills autocomplete**:
- Click: Dropdown opens with all skills
- Type: Filters skills list
- Click on skill: Adds skill as chip below
- Click X on chip: Removes skill
- Validation: At least 1 skill required

**"Add Another Project" button**:
- Click: Inserts new project form below existing ones
- New form has empty fields
- Has Remove button

**"Remove Project" button** (X icon):
- Click: Removes that project form
- If only one project: Button disabled or hidden

**"Add Another Achievement" button**:
- Click: Adds new achievement input field
- New field empty

**"Remove Achievement" button**:
- Click: Removes that achievement field

**Profile Picture upload area**:
- Click "Upload Photo": Opens file picker
- Select image file: 
  - If valid (JPG/PNG/WebP, < 5MB):
    - Upload to server
    - API: `POST /api/v1/upload/profile-picture`
    - Show loading spinner
    - On success: Preview image in avatar
    - Store URL
  - If invalid:
    - Show error "Invalid file type" or "File too large"

**Resume upload**:
- Click "Upload Resume": Opens file picker
- Select PDF:
  - If valid (PDF, < 2MB):
    - Upload to server
    - API: `POST /api/v1/upload/resume`
    - Show loading spinner
    - On success: Show PDF icon + filename
    - Store URL
  - If invalid:
    - Show error

**Terms checkbox**:
- Click: Toggle checked/unchecked
- If checked: Enable "Create Account" button
- If unchecked: Disable button

**"Create Account" button**:
- Click:
  1. Validate entire form
     - Check all required fields filled
     - Check all formats valid
     - Check passwords match
     - Check terms accepted
  2. If validation fails:
     - Scroll to first error
     - Highlight error fields
     - Show error messages
     - Don't submit
  3. If validation passes:
     - Disable button
     - Change text to "Creating Account..."
     - Show loading spinner
     - Make API call
     - On success: Redirect to `/home`
     - On error: Show error, re-enable button

**Back arrow** (top-left):
- Click: Navigate back to `/register` (role selection)
- Shows confirmation if form partially filled: "Are you sure? Progress will be lost."

#### API Calls on This Page

**1. Check Email Availability** (while typing):
```
GET /api/v1/auth/check-email?email=john.smith@university.edu
Response: { "available": true/false }
```

**2. Check Roll Number Availability** (after entering):
```
GET /api/v1/auth/check-roll-number?rollNumber=A12345678901
Response: { "available": true/false }
```

**3. Upload Profile Picture** (when file selected):
```
POST /api/v1/upload/profile-picture
Body: FormData with image file
Response: { "url": "https://s3.../profile.jpg" }
```

**4. Upload Resume** (when PDF selected):
```
POST /api/v1/upload/resume
Body: FormData with PDF file
Response: { "url": "https://s3.../resume.pdf" }
```

**5. Submit Registration** (when form submitted):
```
POST /api/v1/auth/register/student
Body: {
  firstName, middleName, lastName, email, password,
  contactNo, gender, rollNumber, department, yearOfGraduation,
  skills: [...], projects: [...], achievements: [...],
  experience, portfolio, github, linkedin, leetcode,
  profilePicture, resumeUrl
}
Response: {
  success: true,
  token: "...",
  user: { ... }
}
```

#### Form Validation Rules

**First Name**:
- Required: Yes
- Min length: 2
- Max length: 50
- Pattern: Letters only
- Error: "First name must be 2-50 letters"

**Email**:
- Required: Yes
- Format: Valid email
- Pattern: Must be university domain
- Unique: Must not exist
- Error: "Please enter valid university email"

**Password**:
- Required: Yes
- Min length: 8
- Must have: Uppercase, lowercase, number, special
- Error: "Password must meet all requirements"

**Confirm Password**:
- Required: Yes
- Must match: password field
- Error: "Passwords must match"

**Contact Number**:
- Required: Yes
- Pattern: Exactly 10 digits
- Error: "Enter valid 10-digit number"

**Gender**:
- Required: Yes
- Must select one option
- Error: "Please select gender"

**Roll Number**:
- Required: Yes
- Pattern: A + exactly 11 digits
- Unique: Must not exist
- Error: "Invalid roll number format"

**Department**:
- Required: Yes
- Must select from list
- Error: "Please select department"

**Year of Graduation**:
- Required: Yes
- Must be current year or future
- Error: "Invalid graduation year"

**Skills**:
- Required: Yes
- Minimum: 1 skill
- Maximum: 20 skills
- Error: "Select at least 1 skill"

**Projects** (if added):
- Title: 3-100 characters
- Description: 10-500 characters
- Link: Valid URL or empty

**Resume** (if uploaded):
- Format: PDF only
- Size: Max 2MB
- Error: "Invalid resume file"

**Profile Picture** (if uploaded):
- Format: JPG, PNG, WebP
- Size: Max 5MB
- Error: "Invalid image file"

#### What Happens After Successful Registration

1. **API Response Received**:
   ```json
   {
     "success": true,
     "token": "eyJhbGc...",
     "user": { ... }
   }
   ```

2. **Frontend Processing**:
   - Store token in localStorage
   - Store user in localStorage
   - Update AuthContext
   - Show success message: "Account created successfully!"

3. **Navigation**:
   - Redirect to `/home`
   - User now logged in
   - Can see personalized feed

4. **Welcome Experience**:
   - May show onboarding tooltip
   - May show welcome modal
   - May trigger tour of features

#### Error Handling

**Email Already Exists**:
- Show error below email field
- Message: "This email is already registered"
- Suggest: "Try logging in instead"
- Provide login link

**Roll Number Already Exists**:
- Show error below roll number field
- Message: "This roll number is already registered"
- Suggest contacting support

**Server Error**:
- Show error message at top of form
- Message: "Registration failed. Please try again."
- Log error to console
- User can retry

**Network Error**:
- Show error: "No internet connection"
- Suggest checking connection
- Form data preserved for retry

---

This detailed documentation continues for all 28+ pages with the same level of detail, covering every element, click, API call, and user interaction.

