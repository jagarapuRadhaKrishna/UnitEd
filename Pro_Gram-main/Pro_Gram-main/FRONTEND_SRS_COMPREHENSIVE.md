# UnitEd Frontend - Complete Software Requirements Specification (SRS)

**Document Version:** 2.0  
**Last Updated:** February 9, 2026  
**Status:** Complete & Production-Ready  
**Scope:** Comprehensive Frontend Documentation  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Frontend Architecture](#frontend-architecture)
4. [Pages & Routes (Complete Details)](#pages--routes-complete-details)
5. [Component Library](#component-library)
6. [Services & API Integration](#services--api-integration)
7. [User Types & Roles](#user-types--roles)
8. [Features by Module](#features-by-module)
9. [User Workflows & Use Cases](#user-workflows--use-cases)
10. [UI/UX Specifications](#uiux-specifications)
11. [State Management](#state-management)
12. [Authentication & Authorization](#authentication--authorization)
13. [Error Handling & Validation](#error-handling--validation)
14. [Performance Requirements](#performance-requirements)
15. [Browser & Device Support](#browser--device-support)
16. [Accessibility (A11y) Requirements](#accessibility-a11y-requirements)
17. [Security Requirements](#security-requirements)
18. [API Integration Details](#api-integration-details)
19. [Data Models & Types](#data-models--types)
20. [Testing Requirements](#testing-requirements)
21. [Deployment & Environment](#deployment--environment)
22. [Future Enhancements](#future-enhancements)
23. [Glossary](#glossary)

---

## Executive Summary

UnitEd is a comprehensive academic collaboration network platform built with **React 18 + TypeScript** and **Material-UI**. The frontend provides a rich user experience for students and faculty to:

- Discover and create academic projects/opportunities
- Manage team invitations for projects
- Apply for opportunities and manage applications
- Communicate via real-time chat
- Participate in discussion forums
- Receive notifications
- Manage profiles and settings
- Find skill-matched candidates and opportunities

**Key Characteristics:**
- **User Base:** Students and Faculty (role-based access)
- **Core Features:** Posts/Opportunities, Invitations, Applications, Chat, Forums, Notifications
- **Technology:** React 18, TypeScript, MUI, Framer Motion, React Router
- **Deployment:** Vite-based build, Vercel/Netlify compatible
- **API:** REST endpoints with JWT authentication

---

## Project Overview

### Vision
To create a unified platform where academic communities can seamlessly collaborate on research, projects, and academic endeavors.

### Core Value Proposition
- **For Students:** Find project opportunities, connect with peers, build portfolio
- **For Faculty:** Recruit talented students, manage research projects, build teams
- **For Institution:** Facilitate academic collaboration, showcase research, build community

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | React 18.2+ with TypeScript 5.x |
| **UI Library** | Material-UI (MUI) 7.x |
| **Styling** | MUI Styled Components, CSS-in-JS |
| **Routing** | React Router 7.x |
| **State** | React Context API + Local State |
| **HTTP Client** | Axios |
| **Real-time** | Socket.io Client |
| **Animations** | Framer Motion |
| **Icons** | MUI Icons + Lucide React + FontAwesome |
| **Build Tool** | Vite 7.x |
| **Package Manager** | npm or yarn |

### Key Dependencies
```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/material": "^7.3.5",
  "@mui/icons-material": "^7.3.5",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.5",
  "axios": "latest",
  "socket.io-client": "^4.8.1",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.552.0"
}
```

---

## Frontend Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                   Browser / Client                      │
├─────────────────────────────────────────────────────────┤
│                    React App (Vite)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Routes & Page Components                 │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  - Public Routes (Landing, Login, Register)     │   │
│  │  - Protected Routes (Dashboard, Posts, Chat)    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │   State Management (Context API)                │   │
│  │  - AuthContext (user, token, login/logout)     │   │
│  │  - NotificationContext (notifications, alerts)  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Component Library (Design System)          │   │
│  │  - Button, Card, Avatar, Badge, etc.           │   │
│  │  - Layout Components (Navbar, Sidebar, Footer) │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Services Layer                          │   │
│  │  - API Services (posts, users, invitations)    │   │
│  │  - Auth Services (login, logout, tokens)       │   │
│  │  - Storage Services (localStorage, security)   │   │
│  │  - WebSocket Services (chat, notifications)    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Utilities & Helpers                     │   │
│  │  - Validation, Formatting, Performance         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│             Backend API (Node.js + Express)             │
│  REST Endpoints + WebSocket Server (Socket.io)          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│      PostgreSQL Database + Cache Layer                  │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure & Organization
```
src/
├── components/           # React components (organized by feature)
│   ├── Advanced/        # Advanced components (cards, lists)
│   ├── Application/     # Application-related components
│   ├── Debug/          # Debug/dev tools
│   ├── Design/         # Design system (Button, Card, etc.)
│   ├── Invitations/    # Invitation system components
│   ├── Landing/        # Landing page sections
│   ├── Layout/         # Layout (Navbar, Sidebar, Footer)
│   └── Profile/        # Profile-related components
│
├── pages/              # Page-level components (mapped to routes)
│   ├── LandingPageNew.tsx      # Landing page
│   ├── LoginNew.tsx            # Login page
│   ├── Dashboard.tsx           # User dashboard
│   ├── Home.tsx               # Feed home
│   ├── [other pages...]       # ~35+ page components
│   └── Forums/                # Forum-related pages
│
├── services/           # API & business logic services
│   ├── authApiService.ts           # Authentication APIs
│   ├── userApiService.ts           # User profile APIs
│   ├── postsApiService.ts          # Posts/opportunities APIs
│   ├── invitationApiService.ts     # Invitation APIs
│   ├── chatroomService.ts          # Chat APIs
│   ├── notificationService.ts      # Notifications
│   ├── localStorageAuthService.ts  # Local token storage
│   ├── secureStorageService.ts     # Secure storage
│   └── [other services...]         # 15 total services
│
├── contexts/           # React Context providers
│   ├── AuthContext.tsx         # Global auth state
│   └── NotificationContext.tsx # Global notifications
│
├── config/            # Configuration files
│   └── api.ts         # API base URL, axios instance
│
├── theme/            # Theming & design tokens
│   ├── theme.ts           # MUI theme configuration
│   ├── tokens.ts          # Design tokens
│   ├── unitedTheme.ts     # Custom theme
│   ├── design-system.css  # Design system styles
│   ├── globals.css        # Global styles
│   ├── variables.css      # CSS variables
│   └── innov8mate.css     # Custom styles
│
├── types/            # TypeScript type definitions
│   └── index.ts      # All interface/type definitions
│
├── utils/            # Utility functions
│   ├── validation.ts    # Form validation rules
│   ├── performance.ts   # Performance utilities
│   └── [other utils]
│
├── data/             # Mock/sample data
│   └── mockData.ts   # Development mock data
│
├── modules/          # Feature modules
│   └── auth/         # Auth-related logic
│
├── examples/         # Example code/patterns
│   └── authExamples.ts
│
├── App.tsx           # Root component with routes
├── main.tsx          # Entry point
├── App.css           # App-level styles
└── index.css         # Base styles
```

---

## Pages & Routes (Complete Details)

### 2.1 Public Routes (No Authentication Required)

#### 2.1.1 Landing Page
**Route:** `/`  
**Component:** `LandingPageNew.tsx`  
**Access:** Public (unauthenticated users)  

**Purpose:** Marketing and onboarding page showcasing the platform

**Key Sections:**
1. **Navigation Bar**
   - Logo and branding
   - Menu links (Features, About, Contact)
   - Language/theme toggle
   - Login/Sign Up buttons (CTA)
   - Responsive hamburger menu on mobile

2. **Hero Section**
   - Headline: "Connect. Collaborate. Create."
   - Subheading explaining platform value
   - Large call-to-action button "Get Started"
   - Background image/animation
   - Hero image or illustration

3. **Features Showcase**
   - Grid of 4-6 key features with icons:
     - "Discover Opportunities" - Find projects matching skills
     - "Build Teams" - Invite and connect with peers
     - "Real-time Collaboration" - Chat and forums
     - "Skill Matching" - AI recommendations
     - "Manage Projects" - Track team and progress
     - "Network" - Build academic connections
   - Each feature with icon, title, description

4. **How It Works Section**
   - 4-step process visualization:
     1. Create Account
     2. Set Skills & Interests
     3. Find Opportunities
     4. Collaborate & Build
   - Animated step indicators
   - Descriptions and icons

5. **Testimonials / Social Proof**
   - 3-5 testimonial cards
   - User avatar, name, role, quote
   - Star ratings
   - Carousel or grid layout

6. **Call-to-Action Section**
   - Persuasive heading
   - Secondary CTA button (Sign Up)
   - Benefits bullet points

7. **Footer**
   - Links: About, Privacy, Terms, Contact
   - Social media icons
   - Copyright information
   - Newsletter signup (optional)

**Features:**
- Fully responsive design (mobile-first)
- Smooth scroll animations
- Dark/light theme toggle
- Performance optimized

**User Flows:**
- New user → Click "Get Started" → Redirects to role selection
- Existing user → Click "Login" → Redirects to login page
- Interested user → Scroll to features → Click features
- Footer → Access legal pages

---

#### 2.1.2 Login Page
**Route:** `/login`  
**Component:** `LoginNew.tsx`  
**Access:** Public (unauthenticated users)

**Purpose:** User authentication and session establishment

**Layout:**
- Two-column layout (desktop) / Single column (mobile)
- Left side: Branding/marketing message
- Right side: Login form

**Form Fields:**
1. **Email Input**
   - Placeholder: "Enter your email"
   - Type: email
   - Required: Yes
   - Validation: Valid email format
   - Error message: "Please enter a valid email address"

2. **Password Input**
   - Placeholder: "Enter your password"
   - Type: password
   - Required: Yes
   - Toggle show/hide password
   - Min length: 8 characters
   - Error message: "Password is required"

3. **Remember Me Checkbox**
   - Default: Unchecked
   - Behavior: Keeps user logged in for 30 days
   - Optional

4. **Login Button**
   - Type: Submit
   - Label: "Login"
   - State: disabled during submission
   - Loading spinner during request
   - Primary color (blue)

**Additional Elements:**
- "Forgot Password?" link → `/forgot-password`
- "Don't have an account?" link → `/register`
- "New to UnitEd?" heading
- Social login buttons (if available):
  - Google OAuth
  - Microsoft OAuth

**Validation Rules:**
```javascript
Email: 
  - Required
  - Must be valid email format
  - Must exist in database
  
Password:
  - Required
  - Minimum 8 characters
```

**Error States:**
- Invalid email/password → Error message: "Invalid email or password"
- Network error → Retry button
- Account locked → Message with unlock link
- Server error → Generic error with support link

**Success Flow:**
1. User enters valid credentials
2. API validates (POST /api/auth/login)
3. Backend returns JWT token + user object
4. Frontend stores token in secure storage
5. Redirects to `/dashboard` or `/home`
6. Loads user's personalized data

**Accessibility:**
- Form labels with `for` attributes
- Error messages linked to inputs
- Tab order correct
- ARIA labels for password toggle

---

#### 2.1.3 Forgot Password Page
**Route:** `/forgot-password`  
**Component:** `ForgotPassword.tsx`  
**Access:** Public (unauthenticated users)

**Purpose:** Self-service password recovery

**Flow:**
1. **Step 1: Email Entry**
   - Header: "Reset Your Password"
   - Subtext: "Enter your email to receive reset instructions"
   - Email input field
   - Submit button: "Send Reset Link"

2. **Step 2: Email Sent Confirmation**
   - Success message: "Check your email!"
   - Instructions: "We've sent password reset instructions to [email]"
   - Timer: "Resend link in 60 seconds"
   - Back to login link
   - Help text: "Didn't receive email? Check spam folder"

3. **Step 3: Password Reset (via email link)**
   - Direct to: `/reset-password?token=...`
   - Password reset form:
     - New Password input
     - Confirm Password input
     - Password strength indicator
     - Reset button

**Validation:**
- Email must exist in system
- Reset token must be valid (24-hour expiry)
- New password must meet requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character

**Error Handling:**
- Email not found → "No account found with this email"
- Reset link expired → "Link expired. Request a new one"
- Passwords don't match → "Passwords do not match"
- Invalid password format → "Password doesn't meet requirements"

---

#### 2.1.4 Role Selection Page
**Route:** `/register`  
**Component:** `RoleSelection.tsx`  
**Access:** Public (unauthenticated users)

**Purpose:** Initial user type selection before detailed registration

**Layout:**
- Centered container with branding
- Two option cards below

**Options:**

1. **Student Option Card**
   - Icon: Student/person icon
   - Title: "I'm a Student"
   - Description: "Looking for projects, opportunities, and collaboration"
   - Features list:
     - Find project opportunities
     - Build portfolio
     - Connect with peers and faculty
     - Learn new skills
   - Button: "Continue as Student" → `/register/student`

2. **Faculty Option Card**
   - Icon: Professor/briefcase icon
   - Title: "I'm a Faculty/Mentor"
   - Description: "Looking to mentor, create projects, and build research teams"
   - Features list:
     - Create and manage projects
     - Recruit talented students
     - Build research teams
     - Mentor next generation
   - Button: "Continue as Faculty" → `/register/faculty`

**Additional:**
- "Already have an account?" → Login link
- Back button to landing page

---

#### 2.1.5 Student Registration Page
**Route:** `/register/student`  
**Component:** `StudentRegister.tsx`  
**Access:** Public (unauthenticated users)

**Purpose:** Multi-step student account creation

**Overall Structure:**
- Progress indicator (Step 1/3 → Step 3/3)
- One step visible at a time
- Previous/Next buttons
- Step completion percentage

**Step 1: Basic Information** (5 fields)

Fields:
1. First Name
   - Placeholder: "John"
   - Required: Yes
   - Max length: 50 chars
   - Validation: Letters only

2. Last Name
   - Placeholder: "Doe"
   - Required: Yes
   - Max length: 50 chars
   - Validation: Letters only

3. Email
   - Placeholder: "john@university.edu"
   - Required: Yes
   - Type: email
   - Validation: Valid format, unique in database

4. Password
   - Placeholder: "••••••••"
   - Required: Yes
   - Password strength indicator (Weak → Strong)
   - Show/hide toggle
   - Requirements display:
     - At least 8 characters
     - One uppercase letter
     - One number
     - One special character
   - Min length: 8

5. Confirm Password
   - Must match password field
   - Error if mismatch: "Passwords do not match"

Button: "Next" (disabled if validation fails)

---

**Step 2: Profile & Academic Information** (5 fields)

Fields:
1. Department
   - Type: Dropdown/Select
   - Options: [Computer Science, Engineering, Business, Arts, Sciences, etc.]
   - Required: Yes
   - Placeholder: "Select your department"

2. Skills
   - Type: Multi-select with autocomplete
   - Max selections: 10
   - Options: [JavaScript, Python, React, Node.js, Data Science, etc.]
   - Required: Yes (min 3 skills)
   - Searchable input
   - Show selected as chips/tags
   - Remove with X button
   - Suggestion list as you type

3. Bio
   - Type: Text area
   - Placeholder: "Tell us about yourself..."
   - Max length: 500 characters
   - Character counter
   - Optional
   - Min length: 0, Max: 500

4. Avatar/Profile Picture
   - Type: File upload (image only)
   - Accepted formats: .jpg, .jpeg, .png, .gif
   - Max size: 5MB
   - Optional
   - Preview after upload
   - Drag-and-drop support
   - "Browse files" button

5. LinkedIn Profile (Optional)
   - Type: URL input
   - Placeholder: "https://linkedin.com/in/yourprofile"
   - Validation: Valid LinkedIn URL
   - Optional

Buttons: "Previous" | "Next" (disabled if validation fails)

---

**Step 3: Preferences & Terms** (3 items)

Items:
1. Interests
   - Type: Multi-select checkboxes
   - Options: [Research, Hackathons, Competitions, StartupProjects, ClassProjects, OpenSource]
   - Required: No
   - Multiple selections allowed

2. Availability
   - Type: Select dropdown
   - Options: [Part-time (5-10 hours/week), Part-time (10-20 hours/week), Full-time, Flexible]
   - Required: Yes
   - Default: None

3. Terms & Privacy
   - Type: Checkbox group
   - Items:
     a) "I agree to the Terms of Service"
        - Link to `/terms`
        - Required: Yes
     b) "I agree to the Privacy Policy"
        - Link to `/privacy`
        - Required: Yes
     c) "Send me emails about opportunities"
        - Optional
        - Default: Checked

Buttons: "Previous" | "Create Account" (disabled until all required fields valid and terms checked)

---

**Form Validation Summary:**

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| First Name | Text | Yes | 2-50 chars, letters only |
| Last Name | Text | Yes | 2-50 chars, letters only |
| Email | Email | Yes | Valid format, unique |
| Password | Password | Yes | 8+ chars, mixed case, number, special char |
| Confirm Password | Password | Yes | Must match password |
| Department | Select | Yes | One of predefined list |
| Skills | Multi-select | Yes | Min 3, max 10 skills |
| Bio | Text area | No | Max 500 chars |
| Avatar | File | No | Image only, max 5MB |
| LinkedIn | URL | No | Valid LinkedIn URL |
| Interests | Checkboxes | No | Multiple selections OK |
| Availability | Select | Yes | One of predefined list |
| Terms | Checkbox | Yes | Must be checked |
| Privacy | Checkbox | Yes | Must be checked |

**API Integration:**
- POST `/api/auth/register` with all form data
- Multipart form data for file upload
- Response: JWT token + user object
- Success: Automatically log in → Redirect to `/dashboard`

**Error Handling:**
- Email already exists → "Email already registered. Try login or password reset."
- Network error → Retry button
- Server error → Show with support contact info
- File upload failed → "Failed to upload avatar. Try again."

**Accessibility:**
- All form fields have labels
- Error messages announced to screen readers
- Tab order correct
- Form progress announced

---

#### 2.1.6 Faculty Registration Page
**Route:** `/register/faculty`  
**Component:** `FacultyRegister.tsx`  
**Access:** Public (unauthenticated users)

**Purpose:** Multi-step faculty account creation (similar to student but with faculty-specific fields)

**Similar to Student Registration but with modifications:**

**Step 1: Basic Information** (Same as student)
- First Name, Last Name, Email, Password, Confirm Password

**Step 2: Faculty-Specific Profile** (Different fields)

Fields:
1. Department
   - Required: Yes
   - Options: [Computer Science, Engineering, Business, Arts, Sciences, etc.]

2. Faculty Designation
   - Required: Yes
   - Options: [Professor, Associate Professor, Assistant Professor, Lecturer, Teaching Assistant]

3. Qualification/Degree
   - Required: Yes
   - Options: [PhD, M.Tech, M.Sc, B.Tech, Bachelor's, Other]

4. Areas of Expertise
   - Type: Multi-select with autocomplete
   - Max selections: 8
   - Options: [Research fields, specializations]
   - Required: Yes (min 2)

5. Office/Lab Information (Optional)
   - Type: Text input
   - Placeholder: "Lab address or office number"
   - Optional

6. Avatar/Profile Picture (Same as student)

---

**Step 3: Research & Teaching Preferences**

Fields:
1. Research Interests
   - Type: Multi-select
   - Required: No

2. Number of Students Can Mentor
   - Type: Number input
   - Range: 1-50
   - Required: Yes

3. Project Types You Offer
   - Type: Checkboxes
   - Options: [Research Projects, Class Projects, Internships, Capstone Projects, Hackathons]
   - Required: Yes (min 1)

4. Terms & Privacy (Same as student)

---

#### 2.1.7 Not Found Page
**Route:** `/404`, `/*` (catch-all)  
**Component:** `NotFoundPage.tsx`  
**Access:** Public (any user)

**Purpose:** Handle undefined routes with friendly UI

**Layout:**
- Centered container
- Large "404" heading
- "Page Not Found" message
- Explanation: "The page you're looking for doesn't exist or has been moved"
- Illustration/icon
- Navigation buttons:
  - "Go to Home" → `/`
  - "Go to Dashboard" → `/dashboard` (if logged in)
  - "Contact Support" → Opens support form

---

### 2.2 Protected Routes (Authentication Required)

All protected routes require:
1. Valid JWT token in localStorage/secure storage
2. Unexpired token (checked before render)
3. User object in AuthContext

If token invalid/missing → Redirect to `/login`

---

#### 2.2.1 Dashboard Page
**Route:** `/dashboard`  
**Component:** `Dashboard.tsx`  
**Auth:** Required (Student & Faculty)  
**Purpose:** Personalized user hub with overview and quick actions

**Layout:** 
- Full-width responsive grid
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3 columns with varied widths

**Sections:**

1. **Welcome Banner** (Full width)
   - Greeting: "Welcome back, [First Name]!"
   - Time-contextual message:
     - Morning (6am-12pm): "Good morning"
     - Afternoon (12pm-6pm): "Good afternoon"
     - Evening (6pm-6am): "Good evening"
   - Quick stat: "You have X pending invitations"
   - Background: Gradient or image
   - Optional: Motivational quote

2. **Quick Stats** (Grid: 4 cards)
   - Card 1: Posts Created
     - Large number in primary color
     - "Posts Created"
     - Sparkline chart (optional)
   - Card 2: Active Invitations
     - Number in amber/warning color
     - "Pending Invitations"
     - "View pending" link
   - Card 3: Applications
     - Number in secondary color
     - "New Applications" (for faculty)
     - OR "Applied Opportunities" (for student)
   - Card 4: Team Members
     - Number in success color
     - "Team Members"
     - Avatar group preview

3. **Recent Activity Feed** (Variable height)
   - Header: "Recent Activity"
   - List of recent events:
     - "John applied to your post 'Mobile App'"
     - "You accepted invitation from Jane's project"
     - "New message in Engineering Team chat"
   - Each item has:
     - Timestamp (relative: "2 hours ago")
     - Icon based on activity type
     - Title/Description
     - Avatar of related user
     - Click to navigate to related item

4. **Quick Actions** (Grid: 2-4 buttons)
   - Button 1: "Create Post" → `/create-post` (primary)
   - Button 2: "Browse Opportunities" → `/home`
   - Button 3: "Manage Applications" → `/applications`
   - Button 4: "View Invitations" → `/invitations`
   - Button 5: "Go to Chat" → `/chatrooms`

5. **My Posts Card** (For faculty/post authors)
   - Header: "My Latest Posts"
   - List of 3-5 recent posts
   - Each post shows:
     - Title
     - Status (Draft/Published/Closed)
     - Applications count
     - Team size
     - "View" button
     - "Manage" button (if author)

6. **Recommended Opportunities** (For students)
   - Header: "Recommended for You"
   - 3-5 opportunity cards
   - Each shows:
     - Title
     - Author (faculty name)
     - Skills required
     - Team size needed
     - "View" button
     - "Apply" button

7. **Notifications Alert** (If > 0 unread)
   - Alert banner with notification icon
   - Count: "You have X unread notifications"
   - "View all" link → `/notifications`

---

#### 2.2.2 Home/Feed Page
**Route:** `/home`  
**Component:** `Home.tsx`  
**Auth:** Required (Student & Faculty)  
**Purpose:** Personalized feed of posts and opportunities

**Layout:**
- Left sidebar (25%): Filters
- Main content (75%): Posts list
- Responsive: Single column on mobile

**Left Sidebar - Filters:**

1. **Search Box**
   - Placeholder: "Search posts, skills..."
   - Icon: Search icon
   - Type: Text input
   - Real-time search as user types

2. **Category Filter**
   - Type: Multi-select checkboxes
   - Options: [Research, Hackathon, Competition, Startup, Class Project, Open Source]
   - Label: "Category"
   - "Clear all" link

3. **Skill Filter**
   - Type: Multi-select with autocomplete
   - Searchable input
   - Options: [JavaScript, Python, React, etc.]
   - Selected shown as chips
   - Remove with X
   - Label: "Required Skills"

4. **Status Filter**
   - Type: Radio buttons or dropdown
   - Options: [All, Open, Closed]
   - Default: "All"
   - Label: "Status"

5. **Sort Options**
   - Type: Radio buttons or dropdown
   - Options:
     - "Newest First" (default)
     - "Most Popular"
     - "Closing Soon"
     - "Best Match" (for students)
   - Label: "Sort by"

6. **Apply Filters Button** (Mobile only)
   - Sticky at bottom of sidebar
   - Shows active filter count

---

**Main Content Area:**

1. **Page Header**
   - Title: "Feed" or "Opportunities"
   - Subtitle: "Discover projects and opportunities"
   - Right-aligned: "Create Post" button (if faculty)
   - View toggle: List view | Grid view

2. **Empty State** (If no posts)
   - Icon: Empty folder/inbox
   - Message: "No posts found"
   - Suggestion: "Try adjusting your filters"
   - CTA: "Browse all posts" button

3. **Post Cards** (Repeated in list/grid)
   Each card shows:
   - **Header:**
     - Author avatar (left)
     - Author name (clickable → profile)
     - Author role badge (Student/Faculty)
     - Posted time (relative)
     - Bookmark/save button (right)
   
   - **Content:**
     - Title (bold, large)
     - Description (first 2-3 lines, truncated with "...more")
     - Skills tags (colored badges, max 5 visible)
   
   - **Meta Info:**
     - Team size: "👥 3/5 members"
     - Deadline: "📅 Due Feb 24"
     - Category: Badge with icon
   
   - **Footer:**
     - View count: "👁️ 234 views"
     - Applicant count: "📮 12 applications"
     - Like count: "❤️ 23"
     - CTA Button:
       - "Apply" (if student, not author)
       - "View" (all)
       - Click leads to `/posts/[id]`

4. **Pagination**
   - Bottom of list
   - "XX results | Page X of Y"
   - Buttons: Previous | [1 2 3 ...] | Next
   - Jump to page input

5. **Loading State**
   - Skeleton cards (5)
   - Pulse animation
   - While fetching data

6. **Error State**
   - Error icon
   - Message: "Failed to load posts"
   - Retry button

---

#### 2.2.3 Personalized Feed
**Route:** `/feed`  
**Component:** `PersonalizedFeed.tsx`  
**Auth:** Required (Student & Faculty)  
**Purpose:** AI-recommended posts based on user skills and interests

**Similar structure to Home but:**
- Recommendations engine highlights matches
- Each card shows match percentage
- "Why recommended" tooltip
- Dismiss/save recommendations

---

#### 2.2.4 Skill-Matched Posts
**Route:** `/skill-matched-posts`  
**Component:** `SkillMatchedPosts.tsx`  
**Auth:** Required (Student)  
**Purpose:** Posts matching user's declared skills

**Features:**
- Skill filter by user's top skills
- Match percentage (0-100%) indicator
- Color-coded:
  - 80-100%: Green (excellent match)
  - 60-80%: Amber (good match)
  - < 60%: Gray (basic match)
- Sort by match percentage

---

#### 2.2.5 My Posts Page
**Route:** `/my-posts`  
**Component:** `MyPosts.tsx`  
**Auth:** Required (Faculty & Students with posts)  
**Purpose:** List of user's own created posts/opportunities

**Layout:**
- Tabs: "All" | "Published" | "Draft" | "Closed"
- Each tab shows filtered posts

**Per Post Card:**
- Title
- Status badge (Published/Draft/Closed)
- Creation date
- Applications count
- Team size: "X/Y members"
- Views count
- Action buttons:
  - "View" → `/posts/[id]`
  - "Manage" → `/post/[id]/manage`
  - "Edit" → Opens edit dialog
  - "Delete" → With confirmation

**Create Post Button** (Top right)
- Link to `/create-post`

---

#### 2.2.6 Create Post/Opportunity Page
**Route:** `/create-post`, `/create-opportunity`  
**Component:** `CreatePostMultiStep.tsx`  
**Auth:** Required (Faculty, some students)  
**Purpose:** Multi-step form to create new projects/opportunities

**Flow:**

**Step 1: Basic Details** (2/4)

Fields:
1. **Title**
   - Placeholder: "Mobile App Development Project"
   - Max: 200 characters
   - Character counter
   - Required: Yes
   - Validation: Min 10, Max 200

2. **Description**
   - Type: Rich text editor (with toolbar)
   - Toolbar: Bold, Italic, Underline, Heading, List, Link, Image
   - Placeholder: "Describe your project, objectives, and what you're looking for..."
   - Max: 5000 characters
   - Character counter
   - Required: Yes
   - Validation: Min 50, Max 5000

Navigation: Next button (enabled if valid)

---

**Step 2: Requirements & Skills** (3/4)

Fields:
1. **Required Skills**
   - Type: Multi-select with autocomplete
   - Searchable
   - Max: 15 skills
   - Options: [JavaScript, React, Node.js, Python, etc.]
   - Required: Yes (min 2)
   - Add custom skill option (if not in list)

2. **Team Size**
   - Type: Number input or slider
   - Range: 1-50
   - Default: 5
   - Label: "How many team members do you need?"
   - Required: Yes

3. **Category**
   - Type: Radio buttons or dropdown
   - Options: [Research, Hackathon, Competition, Startup, Class Project, Open Source, Other]
   - Required: Yes

Navigation: Previous | Next buttons

---

**Step 3: Timeline & Details** (4/4)

Fields:
1. **Application Deadline**
   - Type: Date picker
   - Min: Today
   - Max: 6 months from now
   - Required: No
   - Label: "When should applications close?"

2. **Project Duration**
   - Type: Select dropdown
   - Options: [< 1 month, 1-3 months, 3-6 months, 6-12 months, Ongoing]
   - Required: No

3. **Experience Level Required**
   - Type: Radio buttons
   - Options: [Beginner, Intermediate, Advanced, Mixed]
   - Default: "Mixed"
   - Required: Yes

4. **Additional Notes**
   - Type: Text area
   - Max: 1000 characters
   - Placeholder: "Any additional information or specific requirements..."
   - Optional

Navigation: Previous | Next buttons

---

**Step 4: Review & Publish** (4/4)

Shows:
1. Summary of all entered information (non-editable)
2. "Edit Section 1", "Edit Section 2", etc. buttons for quick edits
3. Preview of how post will appear
4. Save as Draft option (checkbox)
5. Terms: "I have the authority to create this post"
6. Action buttons:
   - "Save as Draft" (if checkbox) → `/my-posts`
   - "Publish Now" (primary) → POST request, then `/posts/[id]`

**API Integration:**
- POST `/api/posts` with all data
- Response: Post object with ID
- Success: Redirect to post detail page

---

#### 2.2.7 Post Detail Page
**Route:** `/post/:id`  
**Component:** `PostDetailPage.tsx`  
**Auth:** Required (but viewable by all)  
**Purpose:** Full post details with applications, discussions, team info

**Layout:**
- Left column (70%): Main content
- Right column (30%): Side panel
- Mobile: Single column, stacked

---

**Left Column - Main Content:**

1. **Header Section**
   - Title (large)
   - Category badge
   - Status badge (Open/Closed)
   - View count & Share button
   - Author info:
     - Avatar
     - Name (clickable → profile)
     - Role badge
     - "Follow" or "Message" button

2. **About Section**
   - "About this project" heading
   - Full description (rendered rich text)
   - Skills required (colored badges)
   - Key details box:
     - Team size: "X of Y members"
     - Deadline: "Feb 24, 2026"
     - Duration: "3-6 months"
     - Experience level: "Intermediate"
     - Posted: "2 weeks ago"

3. **Team Section**
   - "Team Members" heading
   - Avatar group showing accepted team members
   - For each member:
     - Avatar (clickable → profile)
     - Name
     - Role
     - "View profile" link

4. **Discussions/Comments Section**
   - "Discussions" heading
   - Comment input (if authenticated):
     - Avatar of current user
     - Text input: "Add a comment"
     - Submit button
   - Comments list:
     - For each comment:
       - Author avatar (clickable)
       - Author name + role badge
       - Timestamp (relative)
       - Comment text
       - Like button
       - Reply link (if threads supported)
   - Load more comments link (paginated)

---

**Right Column - Side Panel:**

1. **Action Section** (Sticky at top)
   - If author:
     - "Manage Project" button → `/post/[id]/manage`
     - "Edit Post" button → Dialog/edit page
     - "Close Project" button → Confirmation dialog
   - If not author and applications open:
     - "Apply Now" button → Application modal
     - "Express Interest" button → Saves post
   - If already applied:
     - "Withdraw Application" button
     - Status: "Application sent [date]"
   - If already team member:
     - "View Chat" button → `/chatroom/[id]`
     - "Leave Team" button → Confirmation

2. **Skills Section**
   - "Skills Required" heading
   - List of skills with checkmarks:
     - ✓ If user has skill (green)
     - × If user doesn't have skill (gray)
   - "How many do you have?" Summary: "X of Y"

3. **Author Section**
   - "Posted by" heading
   - Author info card:
     - Avatar
     - Name
     - Role
     - Department
     - "View Profile" button
     - "Follow" button
     - "Message" button

4. **Share Section**
   - "Share this project" heading
   - Share buttons:
     - Copy link
     - Email
     - LinkedIn (if available)

---

#### 2.2.8 Post Management Page
**Route:** `/post/:id/manage`  
**Component:** `PostManagePage.tsx`  
**Auth:** Required (Post author only)  
**Purpose:** Author's dashboard to manage post, applications, team

**Access Control:**
- Only post author can access
- Shows 403 error if non-author tries to access

**Layout:**
- Tabs navigation (sticky top)
- Tabs: Overview | Applications | Team | Settings | Discussions

---

**Tab 1: Overview**
- High-level post info (non-editable)
- Stats dashboard:
  - Total views
  - Total applications
  - Accepted applicants
  - Team members connected
- Edit button → edit form or dialog
- Close project button → confirmation
- Post status indicator

---

**Tab 2: Applications**
- Applications list with columns:
  - Applicant name & avatar (clickable)
  - Status: [Pending | Accepted | Rejected]
  - Application date
  - Cover letter (expandable)
  - Actions:
    - "View Profile" → Profile page
    - "Accept" (if Pending) → Decision dialog
    - "Reject" (if Pending) → Confirmation dialog
    - "Withdraw" (if Accepted) → Confirmation dialog

- Applications count: "X of Y applications"
- Filter: All | Pending | Accepted | Rejected
- Sort: By date, By relevance, Alphabetical
- Pagination (10 per page)
- Empty state: "No applications yet"

---

**Tab 3: Team**
- Current team members:
  - Member avatar
  - Member name (clickable)
  - Role (Accepted | Invited)
  - Join date
  - Actions:
    - "View Profile" button
    - "View Chat" button
    - "Remove" button (with confirmation)

- Invited but not accepted:
  - Similar list but showing "Invited" status
  - "Cancel Invitation" button

- Add team member widget:
  - Search user input (autocomplete)
  - "Invite" button
  - Opens invitation send modal

- Team statistics:
  - Current: "X members"
  - Target: "Y members needed"
  - Progress bar

---

**Tab 4: Settings**
- Post details (editable):
  - Title input
  - Description text editor
  - Required skills multi-select
  - Team size number input
  - Deadline date picker
  - Category dropdown
  - Experience level select
  - Visibility: Draft | Public | Private (radio)

- Save button (enabled if changes made)
- Cancel button

- Danger zone:
  - "Close Project" button (primary red)
  - "Delete Post" button (secondary red, requires confirmation)

---

**Tab 5: Discussions**
- Similar to post detail discussions section
- List of comments with author, date, text
- Reply capability (if supported)
- Like/vote on comments
- Pagination
- Pin important comments (author only)

---

#### 2.2.9 Invitations Comprehensive Page
**Route:** `/invitations`  
**Component:** `Invitations.tsx`  
**Auth:** Required (all users)  
**Purpose:** Centralized management of invitations (sent & received)

**Layout:**
- Two main tabs with icons: "I Invited" | "They Invited Me"
- Tab content dynamically changes
- Each tab independent state

---

**Tab 1: Sent Invitations** ("I Invited")

**Header Section:**
- Heading: "Invitations I've Sent"
- Info box with brief explanation
- "How it works" collapsible section:
  - Explains invitation workflow
  - Shows statuses

**Filter Section:**
- Dropdown filter: ALL | PENDING | ACCEPTED | REJECTED | CANCELLED
- Label: "Filter by status"
- Shows active filter chip
- Default: ALL

**Statistics Section:**
- 4 stat boxes in a row:
  - Total Sent: Count
  - Pending: Count (primary color)
  - Accepted: Count (green)
  - Rejected: Count (red)

**Invitations List:**

Each invitation is an `InvitationCard` component showing:

**Card Layout:**
- Left border (color-coded by status):
  - PENDING: Amber
  - ACCEPTED: Green
  - REJECTED: Red
  - CANCELLED: Gray
  - DISCONNECTED: Gray

**Card Content:**
- **Left section:**
  - Recipient user avatar
  - Recipient name (clickable → profile)
  - "They are a [role]" badge

- **Middle section:**
  - Project title (bold, clickable → post)
  - Optional: Custom invitation message (truncated with "..." if long)
  - Status badge with icon

- **Right section:**
  - Sent timestamp: "Sent 2 days ago"
  - If responded: "Responded 1 day ago"
  - Action buttons (based on status):
    - PENDING: "Cancel Invitation" (red outline)
    - ACCEPTED: "View Connection" button
    - REJECTED: No actions
    - CANCELLED: No actions

**Card Animation:**
- Slide-up entrance using Framer Motion
- Stagger effect on list

**Pagination:**
- "Showing X-Y of Z results"
- Page selector: [1 2 3 ...]
- Previous/Next buttons

**Pagination Details:**
- 10 items per page
- Jump-to-page input

**Empty State:**
- Empty icon
- Message: "You haven't invited anyone yet"
- CTA: "Create a post to start inviting team members"

**Loading State:**
- Skeleton cards (5)
- Pulse animation

**Error State:**
- Error icon
- Message: "Failed to load invitations"
- Retry button

---

**Tab 2: Received Invitations** ("They Invited Me")

**Header Section:**
- Heading: "Invitations I've Received"
- Info box with brief explanation
- Badge: "X pending action" (if > 0 pending)

**Filter Section:**
- Dropdown filter: ALL | ACTION NEEDED | PENDING | ACCEPTED | REJECTED
- Default: ALL
- Shows filter chip

**Statistics Section:**
- 4 stat boxes:
  - Total Received: Count
  - Action Needed: Count (primary - pending received)
  - Accepted: Count (green)
  - Rejected: Count (red)

**Invitations List:**

Each invitation is an `InvitationCard` component showing:

**Card Layout:**
- Same color-coded left border as sent invitations

**Card Content:**
- **Left section:**
  - Inviter user avatar
  - Inviter name (clickable → profile)
  - "They are a [role]" info

- **Middle section:**
  - Project title (bold, clickable → post)
  - Custom message (if provided):
    - "Message: [truncated text]..."
    - Expandable to read full
  - Status badge

- **Right section:**
  - Received timestamp: "Received 1 day ago"
  - Action buttons (based on status):
    - PENDING: 
      - "Accept" button (green, prominent)
      - "Reject" button (red outline)
    - ACCEPTED: 
      - Status display: "You accepted this"
      - "View Connection" button
      - "Disconnect" button (red outline)
    - REJECTED:
      - Status display: "You rejected this"
      - No actions
    - DISCONNECTED:
      - Status display: "Disconnected"
      - No actions

**Action Behavior:**
- Accept: 
  - Shows confirmation modal
  - "Confirm acceptance?" message
  - "Accept" | "Cancel" buttons
  - On confirm: API call, card updates status
  - Success toast notification
  - Card re-renders with updated UI

- Reject:
  - Shows confirmation modal
  - "Confirm rejection?" message
  - Optional text area: "Reason (optional)"
  - "Reject" | "Cancel" buttons
  - On confirm: API call, card updates status
  - Success toast notification

- Disconnect:
  - Shows confirmation modal
  - "Are you sure you want to disconnect from this project?"
  - "Disconnect" | "Cancel" buttons
  - On confirm: API call, card updates to DISCONNECTED status
  - Success notification

**Loading States:**
- During action (Accept/Reject/Disconnect):
  - Button shows spinner
  - Button disabled
  - Card slightly faded

**Pagination:**
- Same as sent invitations
- 10 items per page
- Previous/Next navigation

**Empty State:**
- Empty icon
- Message: "No invitations received yet"
- Suggestion: "Start creating posts and others will invite you!"

**Error State:**
- Error icon
- Message: "Failed to load invitations"
- Retry button

**Error Handling During Actions:**
- Accept fails: Toast error "Failed to accept invitation"
- Reject fails: Toast error "Failed to reject invitation"
- Disconnect fails: Toast error "Failed to disconnect"
- Retry button on error toast

---

#### 2.2.10 Applications Page
**Route:** `/applications`  
**Component:** `Applications.tsx`  
**Auth:** Required (all users)  
**Purpose:** List of applications user has submitted

**Layout:**
- Header with title
- Filter section (left sidebar)
- Applications list (main)
- Mobile: Single column

**Filters:**
1. Status: All | Pending | Accepted | Rejected | Withdrawn
2. Sort: By date (newest) | By date (oldest) | By relevance
3. Search: Search by project name

**Application Cards:**
Each card shows:
- Project avatar/image (if available)
- Project title
- Author name & role
- Application status badge
- Application date
- Cover letter (expandable "Read more")
- Actions:
  - "View Project" button → `/posts/[id]`
  - "Withdraw" button (if Pending) → Confirmation
  - "View Chat" button (if Accepted) → Chatroom

**Pagination:**
- 10 items per page
- Previous/Next

---

#### 2.2.11 Applied Opportunities Page
**Route:** `/applied`  
**Component:** `AppliedOpportunities.tsx`  
**Auth:** Required (Student)  
**Purpose:** Timeline view of opportunities user has applied to

**Similar to Applications but with timeline visualization:**
- Projects shown in chronological order
- Connected by vertical line
- Dots on timeline with status color
- Click dot to view details

---

#### 2.2.12 Accepted Applications Page
**Route:** `/accepted-applications`  
**Component:** `AcceptedApplications.tsx`  
**Auth:** Required (all users)  
**Purpose:** View teams/projects user is connected to via acceptance

**Layout:**
- Grid of project cards (3 columns desktop, 2 tablet, 1 mobile)
- Each card shows:
  - Project title
  - Team members (avatar group)
  - Status: "Active Team Member"
  - "Go to Team Chat" button
  - "View Project" button
  - "Leave Team" button (if desired)

---

#### 2.2.13 Invitations & Recommendations
**Route:** `/recommended-candidates`  
**Component:** `RecommendedCandidatesPage.tsx`  
**Auth:** Required (Faculty)  
**Purpose:** AI-recommended candidates to invite for projects (for faculty)

**Layout:**
- Left sidebar: Project selector (dropdown)
- Main content: Candidate cards

**Workflow:**
1. Faculty selects their project from dropdown
2. Page shows recommended candidates
3. Each candidate card shows:
   - Avatar
   - Name (clickable → profile)
   - Skills list
   - Match score: "85% match"
   - "View Profile" button
   - "Send Invitation" button

---

#### 2.2.14 Chat Pages
**Route:** `/chatrooms`  
**Component:** `ChatroomsNew.tsx`  
**Auth:** Required (all users)  
**Purpose:** List and create chatrooms for team collaboration

**Layout:**
- Left sidebar: Chatroom list
- Main area: Selected chatroom or empty state

**Chatroom List Features:**
- Search box to filter chatrooms
- "Create New Chatroom" button
- For each chatroom:
  - Name
  - Last message preview
  - Unread count badge
  - Participant avatars
  - Last activity time
  - Click to open chatroom

**Main Area:**
- Displays active chatroom (if selected)
- Shows empty state: "Select a chatroom" (if none selected)

---

**Route:** `/chatroom/:id`  
**Component:** `ChatroomPage.tsx`  
**Auth:** Required  
**Purpose:** Real-time messaging for team collaboration

**Layout:**
- Header: Chatroom name, participants count, info icon, settings
- Main area: Messages list
- Footer: Message input box

**Header:**
- Chatroom name (bold)
- Participant count: "👥 5 participants"
- Icons:
  - Info icon → Drawer with room details
  - Phone icon → Voice call (if available)
  - Video icon → Video call (if available)
  - More options menu

**Messages List:**
- Chronologically ordered
- For each message:
  - Timestamp (group by day/hour)
  - Author avatar (left)
  - Author name (bold)
  - Message text (can include @ mentions)
  - Timestamp (relative: "2 minutes ago")
  - Reactions (if feature available)
  - Action buttons (for own messages):
    - Edit (pencil icon)
    - Delete (trash icon)
    - React (smiley icon)

**Features:**
- Auto-scroll to newest message
- Load older messages on scroll up (pagination)
- Typing indicator: "John is typing..."
- System messages: "John joined" (gray, system font)
- Online status indicators (green dot next to avatars)

**Message Input:**
- Text input field
- Placeholder: "Type message..."
- Attachment button (file upload)
- Emoji picker button
- Send button (or Enter key to send)

**Features:**
- Text formatting (if rich text enabled):
  - Bold, Italic, Code blocks
  - Toolbar on hover or dedicated button
- @mentions with autocomplete
- File uploads (images, documents)
- Link preview (if URL detected)
- Message reactions/emojis

**Error States:**
- If connection fails: "Connection lost. Reconnecting..."
- If send fails: Message shows "Failed to send" with retry

---

#### 2.2.15 Forum Pages
**Route:** `/forums`  
**Component:** `Forums.tsx`  
**Auth:** Required (all users)  
**Purpose:** Asynchronous discussion forums per project

**Layout:**
- Forum categories dropdown
- List of discussion threads
- Each thread shows:
  - Title
  - Author
  - Posted date
  - Reply count
  - Views count
  - Last activity

**Features:**
- Search threads
- Filter by: All threads | Popular | Unanswered
- "Create New Thread" button → `/forums/create`

**Route:** `/forum/:threadId`  
**Component:** `ForumThread.tsx`  
**Auth:** Required  
**Purpose:** View and reply to forum threads

**Layout:**
- Original post (by thread creator)
- Replies (threaded or flat)
- Reply input box (if authenticated)

**Original Post:**
- Title (large)
- Author info (avatar, name, role, date)
- Post content
- Like/vote buttons
- Reply count

**Replies:**
- For each reply:
  - Author info (avatar, name, role, date)
  - Reply content
  - Like/vote buttons
  - Nested replies indicator
  - Reply button (to create sub-reply)

**Reply Input:**
- Text area
- Formatting toolbar (bold, italic, code, etc.)
- "Post Reply" button
- Preview toggle

---

#### 2.2.16 Notifications Page
**Route:** `/notifications`  
**Component:** `Notifications.tsx`  
**Auth:** Required (all users)  
**Purpose:** View all notifications and manage preferences

**Layout:**
- Header: "Notifications"
- Filter tabs: All | Unread | By type
- Notifications list

**Filter Tabs:**
- All (shows all)
- Unread (only unread)
- Types: Invitations | Applications | Messages | System

**Notification Cards:**
Each card shows:
- Icon based on type (invitation, message, etc.)
- Title
- Description/content
- Timestamp (relative: "5 minutes ago")
- Read/unread indicator (dot)
- Action buttons:
  - "View" → Navigate to related item
  - "Delete" → Remove notification
  - "Mark Unread" (if read) → Toggle state
  - "Mark Read" (if unread) → Toggle state

**Bulk Actions:**
- "Mark all as read" button
- "Delete all" button (with confirmation)

**Pagination:**
- 10 notifications per page
- Load more button or pagination

**Empty State:**
- Icon: Empty bell
- Message: "No notifications"
- Suggestion: "You're all caught up!"

---

#### 2.2.17 Profile Pages
**Route:** `/profile`  
**Component:** `Profile.tsx`  
**Auth:** Required (all users)  
**Purpose:** View own profile (read-only, edit via settings)

**Layout:**
- Cover image/header area
- Profile info card
- Tabs: About | Skills | Projects | Connections

**Header:**
- Background cover image
- Edit button (leads to `/settings/profile`)

**Profile Card:**
- Large avatar (centered)
- Name (heading)
- Role & Department
- "Edit Profile" button
- "Share Profile" button

**Tabs:**

1. **About Tab**
   - Bio text
   - Department
   - Year/Class (for students)
   - Contact info
   - Links (portfolio, GitHub, LinkedIn)

2. **Skills Tab**
   - List of skills with proficiency level (Beginner/Intermediate/Advanced)
   - Endorsement count (if feature available)

3. **Projects Tab**
   - List of projects/posts created
   - List of projects user is connected to (via accepted invitations)
   - Each shows: Title, Role, Date, Status

4. **Connections Tab**
   - List of connected users
   - Filter by type: Collaborators | Mentors | Mentees
   - Each shows: Avatar, Name, Role, Mutual connections count

---

**Route:** `/profile/:userId`  
**Component:** `UserProfile.tsx`  
**Auth:** Required (all users)  
**Purpose:** View other user's profile

**Same layout as own profile but:**
- Edit button replaced with action buttons:
  - "Send Invitation" button
  - "Send Message" button
  - "View Applications" (if author viewing applicant)

---

#### 2.2.18 Profile Settings Page
**Route:** `/settings/profile`  
**Component:** `ProfileSettingsNew.tsx`  
**Auth:** Required (all users)  
**Purpose:** Edit user profile information

**Form Sections:**

1. **Basic Information**
   - First Name (text input)
   - Last Name (text input)
   - Email (text input, read-only or email change modal)
   - Role (display only)

2. **Profile Picture**
   - Current avatar display
   - Upload new picture button
   - Drag-and-drop area
   - File size limit: 5MB
   - Remove picture button

3. **About Section**
   - Bio text area (max 500 chars)
   - Department select dropdown
   - Year/Class (for students)

4. **Skills**
   - Multi-select skills (max 15)
   - Proficiency level selector (for each skill):
     - Beginner
     - Intermediate
     - Advanced
   - Add/remove skills with X button

5. **Contact & Links**
   - Phone number (optional)
   - LinkedIn URL (optional)
   - Portfolio URL (optional)
   - GitHub URL (optional)
   - Personal website (optional)

6. **Privacy Settings**
   - "Make profile public" checkbox
   - "Allow messages from anyone" checkbox
   - "Show my email" checkbox

7. **Notification Preferences**
   - Checkboxes for notification types:
     - Email on new invitation
     - Email on new application
     - Email on new message
     - Email digest (weekly/monthly)
     - Browser notifications

8. **Password Change**
   - Current password input (required)
   - New password input
   - Confirm password input
   - "Change Password" button (separate section)

**Action Buttons (Bottom):**
- Save button (primary)
- Cancel button
- Delete Account button (danger, red, separate section)

**Validation:**
- Show errors inline
- Prevent save if validation fails

---

#### 2.2.19 Settings Page
**Route:** `/settings`  
**Component:** `Settings.tsx`  
**Auth:** Required (all users)  
**Purpose:** Global app settings and preferences

**Sections:**

1. **General Settings**
   - Language: Dropdown with options (English, Spanish, French, etc.)
   - Theme: Radio buttons (Light | Dark | System)
   - Timezone: Dropdown with timezones

2. **Privacy & Security**
   - Two-Factor Authentication (toggle + setup button)
   - Login activity log
   - API keys (if applicable)
   - Sessions: "View all active sessions"
   - "Log out all other sessions" button

3. **Notifications**
   - Email notifications toggle (master)
   - Subcategories:
     - Invitations
     - Applications
     - Messages
     - System announcements
   - Frequency: Immediately | Daily digest | Weekly digest

4. **Data & Privacy**
   - "Download my data" button
   - "Request GDPR data export" button
   - "Delete my account" button (red danger button)
   - Shows confirmation modal

5. **About & Help**
   - App version
   - Links:
     - Documentation
     - Report a bug
     - Contact support
     - Terms of Service
     - Privacy Policy

---

#### 2.2.20 Candidate Profile Page
**Route:** `/candidate/:candidateId`  
**Component:** `CandidateProfilePage.tsx`  
**Auth:** Required (Faculty)  
**Purpose:** Detailed candidate view for faculty

**Similar to UserProfile but with additions:**
- Match score (if viewed from recommendation)
- "Send Invitation" button (prominent)
- Experience level indicator
- Match details: "85% match - Shares 5 skills"

---

#### 2.2.21 About Page
**Route:** `/about`  
**Component:** `AboutNew.tsx`  
**Auth:** Required (can be accessed without auth too)  
**Purpose:** Information about the platform

**Sections:**
1. **Mission & Vision**
   - Platform's purpose and goals
   - Vision statement

2. **Team**
   - Team members (if available)
   - Names, roles, photos

3. **Features Overview**
   - Highlight key features with icons

4. **FAQs**
   - Common questions and answers
   - Expandable/collapsible sections

5. **Contact**
   - Contact form
   - Email address
   - Support links

---

### Summary of All 30+ Pages

| Route | Component | Auth | Purpose |
|-------|-----------|------|---------|
| `/` | LandingPageNew | Public | Marketing landing |
| `/login` | LoginNew | Public | Authentication |
| `/forgot-password` | ForgotPassword | Public | Password recovery |
| `/register` | RoleSelection | Public | Role selection |
| `/register/student` | StudentRegister | Public | Student signup |
| `/register/faculty` | FacultyRegister | Public | Faculty signup |
| `/404` | NotFoundPage | Public | 404 error |
| `/dashboard` | Dashboard | Required | User hub |
| `/home` | Home | Required | Main feed |
| `/feed` | PersonalizedFeed | Required | AI recommendations |
| `/matched-posts` | SkillMatchedPosts | Required | Skill matching |
| `/my-posts` | MyPosts | Required | User's posts |
| `/create-post` | CreatePostMultiStep | Required | Post creation |
| `/post/:id` | PostDetailPage | Required | Post details |
| `/post/:id/manage` | PostManagePage | Required (author) | Post management |
| `/invitations` | Invitations | Required | Invitation hub |
| `/applications` | Applications | Required | Applications list |
| `/applied` | AppliedOpportunities | Required | Applied timeline |
| `/accepted-applications` | AcceptedApplications | Required | Active teams |
| `/recommended-candidates` | RecommendedCandidatesPage | Required (faculty) | Candidate recommendations |
| `/candidate/:id` | CandidateProfilePage | Required (faculty) | Candidate details |
| `/chatrooms` | ChatroomsNew | Required | Chat list |
| `/chatroom/:id` | ChatroomPage | Required | Chat room |
| `/forums` | Forums | Required | Forum list |
| `/forum/:threadId` | ForumThread | Required | Forum thread |
| `/notifications` | Notifications | Required | Notification center |
| `/profile` | Profile | Required | Own profile |
| `/profile/:userId` | UserProfile | Required | Other profile |
| `/settings` | Settings | Required | App settings |
| `/settings/profile` | ProfileSettingsNew | Required | Profile edit |
| `/about` | AboutNew | Public/Required | About page |

---

## Component Library

### 3.1 Design System Components

Located in `src/components/Design/`

#### Button.tsx
**Props:**
- `variant`: "primary" | "secondary" | "danger" | "outline" | "ghost"
- `size`: "small" | "medium" | "large"
- `disabled`: boolean
- `loading`: boolean
- `icon`: React.ReactNode (optional)
- `onClick`: callback
- `children`: React.ReactNode

**States:**
- Default
- Hover (opacity increase, shadow)
- Active (pressed effect)
- Disabled (reduced opacity)
- Loading (shows spinner, disabled)

**Examples:**
```jsx
<Button variant="primary" onClick={handleClick}>
  Create Post
</Button>

<Button variant="danger" size="small" disabled>
  Delete
</Button>

<Button loading icon={<SaveIcon />}>
  Save Changes
</Button>
```

---

#### Card.tsx
**Props:**
- `padding`: "sm" | "md" | "lg" | "none"
- `shadow`: "sm" | "md" | "lg" | "none"
- `border`: boolean
- `interactive`: boolean
- `onClick`: callback (if interactive)
- `children`: React.ReactNode

**Sub-components:**
- `Card.Header` - Top section with background
- `Card.Title` - Heading
- `Card.Subtitle` - Secondary text
- `Card.Content` - Main content area
- `Card.Footer` - Bottom section
- `Card.Actions` - Action buttons area

**States:**
- Default
- Hover (lift effect if interactive)
- Focus

**Examples:**
```jsx
<Card shadow="md" interactive onClick={handleClick}>
  <Card.Header>
    <Card.Title>Project Title</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Description text...</p>
  </Card.Content>
  <Card.Actions>
    <Button>View</Button>
    <Button variant="outline">Interested</Button>
  </Card.Actions>
</Card>
```

---

#### Avatar.tsx
**Props:**
- `src`: string (image URL)
- `alt`: string
- `size`: "sm" | "md" | "lg" | "xl"
- `initials`: string (if no image)
- `role`: "student" | "faculty"
- `online`: boolean
- `onClick`: callback

**States:**
- Image loaded
- Image failed (shows initials)
- Online indicator (green dot)
- Clickable (cursor pointer)

**Sub-components:**
- `AvatarGroup` - Stack multiple avatars

**Examples:**
```jsx
<Avatar src="..." alt="John" size="lg" online />

<Avatar initials="JD" size="md" role="student" />

<AvatarGroup spacing="sm">
  <Avatar src="..." alt="User1" />
  <Avatar src="..." alt="User2" />
  <Avatar src="..." alt="User3" />
</AvatarGroup>
```

---

#### Badge.tsx
**Props:**
- `variant`: "filled" | "outlined" | "soft"
- `color`: "primary" | "secondary" | "success" | "warning" | "error" | "info"
- `size`: "sm" | "md" | "lg"
- `icon`: React.ReactNode
- `onClose`: callback (if closable)
- `children`: React.ReactNode

**States:**
- Filled (solid background)
- Outlined (border only)
- Soft (light background)
- With icon
- Closable

**Examples:**
```jsx
<Badge color="success">Active</Badge>

<Badge variant="outlined" color="warning" icon={<AlertIcon />}>
  Pending
</Badge>

<Badge onClose={handleClose}>
  Skill Name ×
</Badge>
```

---

#### Animated Components
Located in `src/components/Design/AnimatedComponents.tsx`

Pre-built Framer Motion animations:
- `FadeIn` - Fade in animation
- `SlideInFromBottom` - Slide from bottom
- `SlideInFromLeft` - Slide from left
- `SlideInFromRight` - Slide from right
- `ScaleIn` - Scale in animation
- `HoverCard` - Hover lift effect
- `PulseButton` - Pulsing button animation
- `ShinyButton` - Shiny/glossy button effect
- `FloatingElement` - Floating bobbing animation
- `PageTransition` - Page fade/slide transition
- `StaggerContainer` - Container for staggered children

**Examples:**
```jsx
<FadeIn delay={0.2}>
  <Card>Content</Card>
</FadeIn>

<SlideInFromBottom>
  <Modal>Modal content</Modal>
</SlideInFromBottom>

<StaggerContainer>
  <FadeIn>Item 1</FadeIn>
  <FadeIn>Item 2</FadeIn>
  <FadeIn>Item 3</FadeIn>
</StaggerContainer>
```

---

### 3.2 Layout Components

Located in `src/components/Layout/`

#### MainLayout.tsx
**Purpose:** Wrapper for all protected routes

**Structure:**
```jsx
<MainLayout>
  <Navbar />
  <div class="main-container">
    <Sidebar />
    <main>
      <Outlet /> {/* Page content */}
    </main>
  </div>
  <Footer />
</MainLayout>
```

---

#### Navbar.tsx
**Features:**
- Logo/branding (left)
- Search bar (center)
- Notifications bell with badge
- User dropdown menu (right)
- Theme toggle
- Responsive hamburger menu (mobile)

**User Dropdown:**
- Profile link
- Settings link
- Logout button
- Help/Support link

---

#### Sidebar.tsx
**Features:**
- Navigation menu items
- Collapse/expand toggle (desktop)
- Active route highlighting
- Icons and labels
- Footer with logout (mobile)

**Menu Items:**
- Dashboard
- Feed
- Create Post
- My Posts
- Invitations
- Applications
- Chat
- Forums
- Notifications
- Profile
- Settings

---

#### PrivateRoute.tsx
**Purpose:** Route protection wrapper

**Logic:**
1. Check if user authenticated (AuthContext)
2. If not: Redirect to `/login`
3. If yes: Render component
4. Show loading spinner while checking

---

### 3.3 Invitation Components

Located in `src/components/Invitations/`

#### InvitationDashboard.tsx
**Purpose:** Main container with tab switching

**Features:**
- Tab navigation (Sent | Received)
- Header with emoji
- Info box
- How it works section (collapsible)

---

#### SentInvitationsList.tsx
**Features:**
- Filter dropdown
- Statistics display
- Pagination (10 per page)
- Loading/empty/error states
- InvitationCard list
- Cancel actions

---

#### ReceivedInvitationsList.tsx
**Features:**
- Filter dropdown with "Action Needed" badge
- Statistics display
- Pagination
- Loading/empty/error states
- InvitationCard list
- Accept/Reject/Disconnect actions

---

#### InvitationCard.tsx
**Props:**
- `invitation`: Invitation object
- `type`: "sent" | "received"
- `onAction`: callback for actions
- `loading`: boolean

**Features:**
- Color-coded status border
- User avatar
- Project link
- Custom message display
- Timestamps
- Action buttons
- Framer Motion animations

---

### 3.4 Application Components

Located in `src/components/Application/`

#### ApplicationModal.tsx
**Purpose:** Modal to submit application to post

**Features:**
- Header: "Apply to [Project Name]"
- Required fields form
- Cover letter text area
- Submit button
- Close button
- Form validation
- Loading state
- Success message

---

### 3.5 Advanced Components

Located in `src/components/Advanced/`

#### ProjectCard.tsx
- Compact post display
- Shows title, author, skills, team size
- Click to view full post

#### UserCard.tsx
- Compact user display
- Shows name, role, skills
- Connect/message buttons

---

### 3.6 Landing Components

Located in `src/components/Landing/`

#### FeatureShowcase.tsx
#### HeroSection.tsx
#### Testimonials.tsx
#### Footer.tsx
#### etc.

---

## Services & API Integration

### 4.1 API Configuration

**File:** `src/config/api.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 4.2 Authentication Services

**File:** `src/services/authApiService.ts`

**Functions:**

1. **register(userData)**
   - POST `/api/auth/register`
   - Input: firstName, lastName, email, password, role, department
   - Returns: { token, user }
   - Throws: Error with validation messages

2. **login(email, password)**
   - POST `/api/auth/login`
   - Input: email, password
   - Returns: { token, user, expiresIn }
   - Throws: "Invalid credentials" error

3. **logout()**
   - POST `/api/auth/logout`
   - Headers: Authorization: Bearer token
   - Returns: { message: "Logged out" }

4. **refreshToken(refreshToken)**
   - POST `/api/auth/refresh-token`
   - Input: refreshToken
   - Returns: { token, expiresIn }

5. **verifyToken()**
   - GET `/api/auth/verify`
   - Headers: Authorization: Bearer token
   - Returns: { valid: boolean, user: User }

6. **forgotPassword(email)**
   - POST `/api/auth/forgot-password`
   - Input: email
   - Returns: { message: "Email sent" }

7. **resetPassword(token, newPassword)**
   - POST `/api/auth/reset-password`
   - Input: token, newPassword
   - Returns: { message: "Password reset" }

---

### 4.3 User Services

**File:** `src/services/userApiService.ts`

**Functions:**

1. **getProfile(userId)**
   - GET `/api/users/:userId`
   - Returns: User object with all details

2. **updateProfile(userId, data)**
   - PUT `/api/users/:userId`
   - Input: Partial user data
   - Returns: Updated user object

3. **uploadAvatar(userId, file)**
   - POST `/api/users/:userId/avatar`
   - Input: Multipart file
   - Returns: { avatarUrl: string }

4. **deleteAccount(userId)**
   - DELETE `/api/users/:userId`
   - Returns: { message: "Account deleted" }

5. **getUserPosts(userId, page, limit)**
   - GET `/api/users/:userId/posts?page=1&limit=10`
   - Returns: { posts: Post[], pagination }

6. **getUserSkills(userId)**
   - GET `/api/users/:userId/skills`
   - Returns: { skills: string[] }

---

### 4.4 Post Services

**File:** `src/services/postsApiService.ts`

**Functions:**

1. **getPosts(filters)**
   - GET `/api/posts?page=1&limit=20&category=&skills=`
   - Input: Filters object
   - Returns: { posts: Post[], pagination }

2. **createPost(postData)**
   - POST `/api/posts`
   - Input: Post object
   - Returns: New post with ID

3. **getPost(postId)**
   - GET `/api/posts/:postId`
   - Returns: Post object with full details

4. **updatePost(postId, data)**
   - PUT `/api/posts/:postId`
   - Input: Partial post data
   - Returns: Updated post

5. **deletePost(postId)**
   - DELETE `/api/posts/:postId`
   - Returns: { message: "Post deleted" }

6. **closePost(postId)**
   - POST `/api/posts/:postId/close`
   - Returns: Post with status CLOSED
   - Side effect: Auto-disconnects all invitations

7. **getApplications(postId, filters)**
   - GET `/api/posts/:postId/applications?status=PENDING`
   - Returns: { applications: Application[], pagination }

8. **submitApplication(postId, coverLetter)**
   - POST `/api/posts/:postId/apply`
   - Input: { coverLetter: string }
   - Returns: Application object

9. **acceptApplication(postId, appId)**
   - POST `/api/posts/:postId/applications/:appId/accept`
   - Returns: Updated application

10. **rejectApplication(postId, appId)**
    - POST `/api/posts/:postId/applications/:appId/reject`
    - Returns: Updated application

---

### 4.5 Invitation Services

**File:** `src/services/invitationApiService.ts`

**Functions:**

1. **sendInvitation(postId, inviteeId, message)**
   - POST `/api/invitations`
   - Input: { postId, inviteeId, message }
   - Returns: Invitation object

2. **getSentInvitations(page, limit, status)**
   - GET `/api/invitations/sent?page=1&limit=10&status=PENDING`
   - Returns: { invitations: Invitation[], pagination }

3. **getReceivedInvitations(page, limit, status)**
   - GET `/api/invitations/received?page=1&limit=10&status=PENDING`
   - Returns: { invitations: Invitation[], pagination }

4. **acceptInvitation(invitationId)**
   - POST `/api/invitations/:invitationId/accept`
   - Returns: Updated invitation

5. **rejectInvitation(invitationId)**
   - POST `/api/invitations/:invitationId/reject`
   - Returns: Updated invitation

6. **cancelInvitation(invitationId)**
   - POST `/api/invitations/:invitationId/cancel`
   - Returns: Updated invitation

7. **disconnectInvitation(invitationId)**
   - POST `/api/invitations/:invitationId/disconnect`
   - Returns: Updated invitation (status: DISCONNECTED)

8. **getPostConnections(postId)**
   - GET `/api/invitations/post/:postId/connections`
   - Returns: Array of connected user objects

---

### 4.6 Notification Services

**File:** `src/services/notificationService.ts`

**Functions:**

1. **getNotifications(page, limit)**
   - GET `/api/notifications?page=1&limit=20`
   - Returns: { notifications: Notification[], unreadCount }

2. **markAsRead(notificationId)**
   - POST `/api/notifications/:notificationId/read`
   - Returns: Updated notification

3. **deleteNotification(notificationId)**
   - DELETE `/api/notifications/:notificationId`
   - Returns: { message: "Deleted" }

4. **getUnreadCount()**
   - GET `/api/notifications/unread/count`
   - Returns: { count: number }

---

### 4.7 Chatroom Services

**File:** `src/services/chatroomService.ts`

**Functions:**

1. **getChatrooms()**
   - GET `/api/chatrooms`
   - Returns: Chatroom[] with recent messages

2. **getChatroom(chatroomId)**
   - GET `/api/chatrooms/:chatroomId`
   - Returns: Chatroom object

3. **getMessages(chatroomId, page)**
   - GET `/api/chatrooms/:chatroomId/messages?page=1&limit=50`
   - Returns: { messages: Message[], pagination }

4. **sendMessage(chatroomId, content, type)**
   - POST `/api/chatrooms/:chatroomId/messages`
   - Input: { content, type: 'text' | 'file' }
   - Returns: Message object
   - Emits: Socket.io event to all connected clients

5. **editMessage(messageId, content)**
   - PUT `/api/messages/:messageId`
   - Input: { content }
   - Returns: Updated message

6. **deleteMessage(messageId)**
   - DELETE `/api/messages/:messageId`
   - Returns: { message: "Deleted" }

---

### 4.8 Storage Services

**File:** `src/services/localStorageAuthService.ts`

**Functions:**
- `saveToken(token)` - Save JWT to localStorage
- `getToken()` - Retrieve JWT from localStorage
- `removeToken()` - Clear JWT from localStorage
- `isLoggedIn()` - Check if user has valid token

**File:** `src/services/secureStorageService.ts`

**Functions:**
- `set(key, value)` - Encrypt and save
- `get(key)` - Retrieve and decrypt
- `remove(key)` - Delete encrypted value
- `clear()` - Clear all secure data

---

## User Types & Roles

### Students
**Can:**
- Create posts for projects (own projects)
- Apply to opportunities
- Receive invitations
- Send invitations (if they create a post)
- Participate in chat and forums
- Search and browse opportunities

**Cannot:**
- Create research projects (faculty only)
- Access faculty-specific features
- Moderate forums
- Delete other users' content

---

### Faculty
**Can:**
- Create research projects and opportunities
- Invite students to projects
- Manage applications for their posts
- Coordinate teams
- Mentor students
- Participate in all features

**Cannot:**
- Access student-only job opportunities (if applicable)
- Be limited in post creation

---

### Admins (Future)
**Can:**
- Manage all users
- Delete posts/comments
- Moderate forums
- Access analytics
- Manage system settings

---

## Features by Module

### Feature 1: Post/Opportunity Management
- Create multi-step posts
- Edit/delete own posts
- Publish/draft/close posts
- View post details and comments
- Manage applications
- Invite team members
- Close projects with auto-disconnect

### Feature 2: Invitation System
- Send invitations with optional message
- View sent/received invitations
- Filter by status (Pending, Accepted, Rejected, etc.)
- Accept/reject/cancel invitations
- Disconnect from active projects
- Auto-disconnect on project closure

### Feature 3: Application System
- Apply to posts with optional cover letter
- Withdraw applications
- Accept/reject applications (as author)
- Track application status

### Feature 4: Team Collaboration
- Real-time chat for project teams
- Discussion forums
- File sharing (in chat)
- @mentions and notifications
- Typing indicators
- Online status

### Feature 5: Networking
- View user profiles
- Connect with other users
- Build skill-based connections
- View shared projects

### Feature 6: Notifications
- Real-time notifications
- Multiple types (invitations, applications, messages, system)
- Mark as read/unread
- Delete notifications
- Filter by type

### Feature 7: Discovery & Recommendations
- Feed of all posts
- Personalized recommendations based on skills
- Skill-matched posts
- Candidate recommendations (for faculty)
- Search and filter capabilities

### Feature 8: Profile Management
- View own and others' profiles
- Edit profile information
- Upload avatar
- Manage skills and preferences
- View activity and achievements

---

## User Workflows & Use Cases

### UC1: Student Discovering and Applying to Opportunities

**Preconditions:**
- Student is registered and logged in

**Steps:**
1. Student logs in → Redirected to dashboard
2. Clicks "Browse Opportunities" → `/home`
3. Sees feed of posts
4. Filters by category: "Hackathon"
5. Filters by skills: "React", "Node.js"
6. Clicks "View" on interesting post → `/posts/[id]`
7. Reviews project details, team, skills required
8. Clicks "Apply Now"
9. Enters cover letter: "I'm interested in..."
10. Clicks "Submit Application"
11. Success message: "Application sent!"
12. Application appears in `/applications` tab

**Postconditions:**
- Application created
- Post author notified
- Application trackable in "Applied Opportunities"

---

### UC2: Faculty Inviting Student to Join Project

**Preconditions:**
- Faculty has published post
- Student's profile exists with skills

**Steps:**
1. Faculty creates post → `/create-post`
   - Title: "Mobile App Development"
   - Skills needed: React, TypeScript
   - Team size: 5
   - Publishes post
2. Post published → `/posts/[id]`
3. Faculty clicks "Manage Project" (or "+" button)
4. Navigates to Manage tab → "Team" section
5. Clicks "Invite Team Member"
6. Searches for "John" → Student John appears
7. Clicks "Invite"
8. Optional: Adds message "We need your React skills!"
9. Clicks "Send Invitation"
10. Invitation sent → Student John notified

**Student Side:**
1. John receives notification
2. Goes to `/invitations` tab "They Invited Me"
3. Sees invitation from Faculty for Mobile App project
4. Reads custom message (if any)
5. Clicks "Accept"
6. Confirmation dialog: "Confirm acceptance?"
7. Clicks "Accept"
8. Status updates to "Accepted"
9. John is now team member
10. Can access team chat

---

### UC3: Invitation Auto-Disconnect on Project Close

**Preconditions:**
- Project has 3 accepted team members via invitations
- Project is published

**Steps:**
1. Faculty decides project is complete
2. Goes to `/post/[id]/manage` → "Overview" tab
3. Clicks "Close Project"
4. Confirmation: "This will close the project and disconnect all team members"
5. Faculty confirms
6. API: POST `/api/posts/[id]/close`
7. Post status changes to CLOSED
8. All ACCEPTED invitations set to DISCONNECTED status
9. All 3 team members notified: "Project closed, you've been disconnected"
10. Team members can no longer access team chat
11. Post no longer accepts applications

**Result:**
- Project closed
- All team connections severed
- Campus resource freed up

---

(Additional workflows can be documented similarly)

---

## UI/UX Specifications

### Design Tokens

**Colors:**
```
Primary: #5B63FF (Blue)
Secondary: #FF6B9D (Pink)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Info: #3B82F6 (Light Blue)
Background: #FFFFFF (Light) / #121212 (Dark)
Surface: #F5F5F5 (Light) / #1E1E1E (Dark)
Text: #1F2937 (Light) / #F3F4F6 (Dark)
Muted: #6B7280
Border: #E5E7EB (Light) / #374151 (Dark)
```

**Typography:**
```
Font: Roboto
Body: 16px / 1.5
Heading 1: 32px / 1.2, weight 700
Heading 2: 24px / 1.3, weight 700
Heading 3: 20px / 1.4, weight 600
Heading 4: 18px / 1.4, weight 600
Small: 14px / 1.5
Tiny: 12px / 1.6
```

**Spacing (8px base unit):**
```
xs: 4px (0.5 units)
sm: 8px (1 unit)
md: 16px (2 units)
lg: 24px (3 units)
xl: 32px (4 units)
2xl: 48px (6 units)
3xl: 64px (8 units)
```

**Shadows:**
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

**Breakpoints:**
```
xs: 0px
sm: 600px
md: 960px
lg: 1280px
xl: 1920px
```

---

### Responsive Design

**Mobile First Approach:**
- Design base styles for mobile (< 600px)
- Enhance for tablet (600px - 960px)
- Optimize for desktop (> 960px)

**Examples:**
```
Mobile:
- Single column layout
- Full-width cards
- Large buttons (48px height min)
- Hamburger menu

Tablet:
- 2-column or 2/3-1/3 split
- Medium buttons
- Visible sidebar (collapsible)

Desktop:
- 3-column or complex layouts
- Smaller, optimized buttons
- Always visible sidebar
```

---

## State Management

### React Context - AuthContext

**State:**
```typescript
{
  user: User | null,
  token: string | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

**Functions:**
```typescript
login(email, password): Promise
logout(): void
register(userData): Promise
updateUser(userData): void
setLoading(boolean): void
setError(string | null): void
clearError(): void
```

---

### React Context - NotificationContext

**State:**
```typescript
{
  notifications: Notification[],
  unreadCount: number,
  loading: boolean
}
```

**Functions:**
```typescript
addNotification(notification): void
removeNotification(id): void
markAsRead(id): void
clearAll(): void
fetchNotifications(): Promise
```

---

### Local Component State

Use `useState` for:
- Form input values
- Toggle states (modals, dropdowns)
- Loading states during API calls
- Temporary UI states

Use `useEffect` for:
- Fetching data when component mounts
- Polling real-time data
- Setting up WebSocket listeners

---

## Authentication & Authorization

### Login Flow

1. User navigates to `/login`
2. Enters email and password
3. Clicks login button
4. Frontend validates inputs
5. API call: POST `/api/auth/login`
6. Backend validates credentials
7. Backend returns JWT token + user object
8. Frontend stores token in secure storage
9. Frontend sets AuthContext with user
10. Redirects to `/dashboard` (or previous page if returning)

### Protected Routes

1. `<PrivateRoute>` wrapper checks AuthContext
2. If not authenticated: Redirect to `/login`
3. If authenticated: Render component
4. Token automatically added to API requests via interceptor
5. If token expires (401): Redirect to `/login`

### JWT Token Structure

```
Header: {
  alg: "HS256",
  typ: "JWT"
}

Payload: {
  userId: "uuid",
  email: "user@example.com",
  role: "STUDENT",
  iat: 1707450000,
  exp: 1707536400  (24 hours)
}

Signature: HMACSHA256(header + payload, secret)
```

### Authorization Checks

**Frontend:**
- Check user role before rendering UI elements
- Disable buttons/links for unauthorized users
- Show error/403 pages if accessing restricted resources

**Backend:**
- Verify JWT on every protected endpoint
- Check user permissions on resources
- Return 403 if unauthorized

---

## Error Handling & Validation

### Frontend Form Validation

**Real-time validation:**
- Email format (regex pattern)
- Password strength (complexity rules)
- Required fields (non-empty)
- Min/max length
- Confirming match (password confirmation)

**Submit validation:**
- All validations pass before allowing submit
- Disable submit button if invalid
- Show error messages inline
- Prevent API submission if invalid

### API Error Handling

**Status Codes:**
- 400: Validation error → Show field-specific messages
- 401: Unauthorized → Redirect to login
- 403: Forbidden → Show "Access Denied" page
- 404: Not found → Show 404 page
- 500: Server error → Show generic error, log to console

**Error Responses:**
```javascript
{
  success: false,
  message: "Invalid email or password",
  errorCode: "INVALID_CREDENTIALS",
  details: { email: "Email not found" }  // Optional
}
```

### UI Error States

- Inline validation messages (red text below field)
- Toast notifications for temporary errors
- Error banners for critical errors
- Retry buttons for network errors
- Support contact link for unexpected errors

---

## Performance Requirements

### Load Time Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

### Optimization Strategies
1. **Code Splitting**
   - Lazy load page components
   - Dynamic imports for large modules

2. **Bundling**
   - Vite for fast build
   - Tree-shaking unused code
   - Minification in production

3. **Images**
   - Optimized image formats (WebP)
   - Responsive images (srcset)
   - Lazy loading with `react-intersection-observer`

4. **Caching**
   - Browser cache headers
   - Service worker for offline support (optional)
   - API response caching (with cache invalidation)

5. **API Optimization**
   - Pagination (load data in chunks)
   - Filter/search on backend
   - Debounce search input
   - Request deduplication

---

## Browser & Device Support

### Supported Browsers
- Chrome 90+
- Safari 14+

### Supported Devices
- Desktop (1280px+)
- Laptop (960px - 1280px)
- Tablet (600px - 960px)
- Mobile (< 600px)

### Testing Devices
- iPhone 12/13/14/15
- Android (Samsung Galaxy S21+)
- iPad (7th gen+)
- Desktop (Chrome, Firefox, Safari, Edge)

---

## Accessibility (A11y) Requirements

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Logical tab order
- Skip to main content link
- Escape key closes modals/dropdowns

**Screen Readers:**
- ARIA labels on icon buttons
- ARIA live regions for notifications
- Form labels properly associated with inputs
- Heading hierarchy (h1 > h2 > h3)
- Image alt text

**Color Contrast:**
- Minimum 4.5:1 contrast for text
- 3:1 contrast for UI components
- Don't rely on color alone for information

**Focus Management:**
- Visible focus indicators
- Focus trap in modals
- Focus returned after closing modal

### Testing Tools
- axe DevTools
- WAVE
- Lighthouse
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)

---

## Security Requirements

### Frontend Security

1. **Input Validation**
   - Sanitize user inputs
   - Prevent XSS with DOMPurify (if needed)
   - Validate file uploads

2. **Token Management**
   - Store tokens securely (localStorage or sessionStorage)
   - Clear tokens on logout
   - Validate token expiration

3. **HTTPS Only**
   - Force HTTPS in production
   - Secure cookie flags (httpOnly, secure, sameSite)

4. **Content Security Policy**
   - Restrict script sources
   - Prevent inline scripts
   - Restrict external resource loading

5. **CORS & CSRF**
   - Configure CORS properly on backend
   - CSRF tokens for state-changing requests (if not using SameSite cookies)

---

## API Integration Details

### Base URL Configuration

```typescript
// Development
VITE_API_BASE_URL=http://localhost:3000/api

// Production
VITE_API_BASE_URL=https://api.united.example.com/api
```

### Request/Response Format

**Request:**
```javascript
{
  method: 'POST',
  url: '/posts',
  headers: {
    'Authorization': 'Bearer {token}',
    'Content-Type': 'application/json'
  },
  data: {
    title: 'Post Title',
    description: 'Description...',
    ...
  }
}
```

**Success Response:**
```javascript
{
  success: true,
  message: 'Post created successfully',
  data: { id: '...', title: '...', ... }
}
```

**Error Response:**
```javascript
{
  success: false,
  message: 'Validation error',
  errorCode: 'VALIDATION_ERROR',
  details: { field: 'email', error: 'Already registered' }
}
```

---

## Data Models & Types

(Refer to [Section 19](#data-models--types) for detailed TypeScript types)

---

## Testing Requirements

### Unit Testing
- Component rendering and props
- Service function outputs
- Utility function correctness
- Context provider logic

### Integration Testing
- User authentication flow
- Post creation and management
- Invitation sending and acceptance
- Application submission

### E2E Testing
- Complete user journeys (e.g., register → create post → apply)
- Role-based access
- Real-time features (chat, notifications)

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] API calls work as expected
- [ ] Responsive design on mobile/tablet
- [ ] Invitations flow: send → receive → accept
- [ ] Application flow: apply → accept/reject
- [ ] Chat sends and receives messages
- [ ] Notifications display correctly
- [ ] Dark/light theme toggle works
- [ ] Logout clears auth state
- [ ] 404 page on undefined routes
- [ ] Error states show helpful messages
- [ ] Loading states display spinners
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader announces content
- [ ] Performance: Pages load quickly
- [ ] Security: XSS protection works
- [ ] Security: CSRF protection (if applicable)

---

## Deployment & Environment

### Environment Variables

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.united.example.com/api
VITE_SOCKET_URL=https://socket.united.example.com
```

### Build & Deploy

```bash
# Build
npm run build  # Outputs to dist/

# Preview
npm run preview  # Local preview of build

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod

# Deploy to AWS S3 + CloudFront
aws s3 sync dist/ s3://bucket-name/
```

### CI/CD Pipeline (Recommended)

```yaml
# GitHub Actions example
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: actions/upload-artifact@v2
        with:
          name: dist
          path: dist/
```

---

## Future Enhancements

### Phase 2 Features
1. **Video Calls Integration**
   - Jitsi or Twilio integration
   - Screen sharing
   - Recording capability

2. **Advanced Recommendations**
   - ML-based candidate matching
   - Skill gap analysis
   - Project difficulty scoring

3. **Portfolio Showcase**
   - User portfolio pages
   - Project showcase
   - Achievement badges

4. **Gamification**
   - Points/reputation system
   - Achievements and badges
   - Leaderboards

5. **Mobile App**
   - React Native app
   - Push notifications
   - Offline support

---

## Glossary

| Term | Definition |
|------|-----------|
| **Post/Opportunity** | A project or opportunity listing created by users (typically faculty) seeking team members |
| **Invitation** | A direct request from post author to a user to join their project team |
| **Application** | A user's expression of interest to join a post, optional cover letter |
| **Team Member/Connection** | A user accepting an invitation or accepted application, active collaborator on project |
| **Chatroom** | Real-time messaging space for project team collaboration |
| **Forum** | Asynchronous discussion space for project discussions |
| **Notification** | Real-time alert about platform events (invitations, messages, etc.) |
| **JWT Token** | JSON Web Token for user authentication and session management |
| **Auto-Disconnect** | Automatic removal of team connections when project closes |
| **Skill Match** | Percentage match between post requirements and user's skills |
| **Status** | Current state of entity (PENDING, ACCEPTED, REJECTED, OPEN, CLOSED, etc.) |
| **Pagination** | Breaking large datasets into pages (page number, limit, total) |
| **Rich Text Editor** | Text input with formatting options (bold, italic, heading, list, etc.) |
| **Socket.io** | WebSocket library for real-time bidirectional communication |
| **Axios** | Promise-based HTTP client for API requests |
| **Vite** | Modern build tool and dev server for fast development |
| **MUI** | Material-UI, React component library |
| **Context API** | React state management mechanism for global state |
| **useEffect Hook** | React hook for side effects (fetch, subscribe, cleanup) |
| **useState Hook** | React hook for component state management |

---

## Conclusion

This comprehensive Frontend SRS document covers every aspect of the UnitEd platform's user-facing application. It includes:

- **30+ page specifications** with detailed layouts and user interactions
- **Component library documentation** with props and states
- **API service documentation** with every endpoint
- **User workflows** for common scenarios
- **Design system** with tokens and responsive requirements
- **Security, accessibility, and performance** specifications
- **Testing and deployment** guidelines

Use this document as the single source of truth when:
- Implementing new features
- Fixing bugs or UX issues
- Onboarding new developers
- Designing UI improvements
- Planning sprints and iterations

For questions or updates, always refer back to this document to ensure consistency across the platform.

---

**Document Metadata:**
- **Version:** 2.0 (Comprehensive)
- **Last Updated:** February 9, 2026
- **Status:** Production-Ready
- **Scope:** Complete Frontend Documentation
- **Audience:** Developers, Designers, Product Managers, QA

