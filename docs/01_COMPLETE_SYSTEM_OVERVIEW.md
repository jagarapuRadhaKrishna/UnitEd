# Part 1: Complete System Overview

**Documentation**: United Platform - Academic Collaboration Network  
**Last Updated**: November 11, 2025  
**Part**: 1 of 8

---

## Table of Contents
1. [What is United Platform](#what-is-united-platform)
2. [Complete Feature List](#complete-feature-list)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [User Roles and Permissions](#user-roles-and-permissions)
6. [How the System Works Together](#how-the-system-works-together)
7. [Data Flow Overview](#data-flow-overview)
8. [Security and Authentication](#security-and-authentication)

---

## What is United Platform

United Platform is an **academic collaboration network** designed specifically for universities to connect students and faculty for research work, projects, and hackathons. Think of it as LinkedIn meets GitHub meets Slack, but specifically for academic collaboration.

### Purpose
The platform solves a key problem in universities: **finding the right collaborators for academic projects**. Instead of manually searching for team members or relying on word-of-mouth, United Platform provides:

- **Opportunity Discovery**: Browse available research projects, hackathons, and collaborative opportunities
- **Skill-Based Matching**: Find people with specific technical skills you need
- **Application System**: Formal process for applying to join projects
- **AI-Powered Recommendations**: Get suggested candidates based on skill requirements
- **Team Communication**: Built-in chatrooms for project teams
- **Professional Networking**: Build connections with peers and faculty
- **Reputation System**: Earn reputation points for contributions and achievements

### Who Uses It

**Students** use United to:
- Find research opportunities and projects to join
- Showcase their skills and experience
- Apply to join interesting projects
- Create their own projects and recruit team members
- Build their professional network
- Earn reputation through contributions

**Faculty** use United to:
- Post research opportunities and recruit students
- View AI-powered candidate recommendations based on required skills
- Invite specific candidates to join their projects (temporary collaboration)
- Mentor and guide student projects
- Manage multiple research teams
- Connections with students are temporary and project-based only

---

## Complete Feature List

### 1. User Management
**What it does**: Handles all user accounts, profiles, and authentication

**Features**:
- Separate registration for students and faculty
- University email verification
- Profile creation with skills, projects, and achievements
- Profile editing and privacy controls
- Password reset functionality
- Session management (login/logout)
- Role-based access control

**Where you use it**: Login page, Registration pages, Profile page, Settings

---

### 2. Posts (Opportunities)
**What it does**: Create and manage academic opportunities

**Features**:
- Create posts for Research Work, Projects, or Hackathons
- Define required skills with specific counts needed
- Set deadlines and duration
- Add detailed descriptions and requirements
- Attach links to additional resources
- Edit and delete your own posts
- Track application status
- Mark posts as filled when team is complete
- View post analytics (views, applications)

**Where you use it**: Create Post page, Home page, Dashboard, Post Detail page

---

### 3. Applications
**What it does**: Formal application system for joining projects

**Features**:
- Apply to any open opportunity
- Write cover letters for applications
- Attach resume to applications
- Select which skills you're applying for
- Track sent applications status
- View received applications (if you own a post)
- Accept or reject applications
- Add feedback when accepting/rejecting
- Automatic skill count updates
- Prevent duplicate applications

**Where you use it**: Post Detail page, Applications page, Applied Opportunities page

---

### 4. Invitations
**What it does**: Direct invitation system for recruiting specific people

**Features**:
- Send invitations to specific users
- AI-powered candidate recommendations based on skills
- View similarity scores for recommended candidates
- Include personal messages with invitations
- Accept or decline invitations
- Track invitation status (pending, accepted, declined)
- Automatic post updates when invitation accepted
- Notification when invitation sent/received

**Where you use it**: Recommended Candidates page, Invitations page

---

### 5. Chatrooms
**What it does**: Team communication for accepted project members

**Features**:
- Automatic chatroom creation when first member accepted
- Real-time messaging
- View all team members in chatroom
- Message history
- Chatroom lifecycle management (active → read-only → deleted)
- File sharing in messages
- Member roles (owner, member)
- Chatroom expiration based on project deadline
- Grace period for wrapping up discussions

**Where you use it**: Chatrooms page, Chatroom Detail page

---

### 6. Notifications
**What it does**: Keep users informed of all activities

**Features**:
- Real-time notifications
- Notification bell with unread count
- Different notification types:
  - New application received
  - Application accepted/rejected
  - Invitation received
  - Invitation accepted/declined
  - New message in chatroom
  - Connection request received
  - Connection request accepted
  - Post deadline approaching
  - Post status changed
- Mark notifications as read
- Clear all notifications
- Notification history

**Where you use it**: Top navigation bar, Notifications page

---

### 7. Temporary Collaboration Connections
**What it does**: Project-based temporary connections that exist only during active collaboration

**Features**:
- Connections created automatically when invited to a project
- Connection exists only while project is active
- Access to collaborator profiles during project
- Connections automatically removed when project ends/closes
- View current project collaborators
- No permanent networking - focus on project collaboration

**Where you use it**: Chatrooms, Project member lists, Active collaborations

**Note**: This is NOT a permanent networking feature. Connections are temporary and project-specific only.

---

### 8. Search and Discovery
**What it does**: Find opportunities and people

**Features**:
- Search posts by keywords
- Filter posts by purpose (Research/Projects/Hackathons)
- Filter by required skills
- Filter by deadline
- Sort by newest, deadline, popularity
- Search users by name, skills, department
- Filter users by role (student/faculty)
- Advanced filters for user discovery
- View detailed user profiles

**Where you use it**: Home page, User Discovery page, Dashboard

---

### 9. Profile Management
**What it does**: Showcase your skills and experience

**Features**:
- Complete profile with personal information
- Skills list with proficiency levels
- Projects portfolio with descriptions
- Achievements and certifications
- Resume upload
- Social links (GitHub, LinkedIn, LeetCode, Portfolio)
- Bio and location
- Profile picture upload
- Public/private profile toggle
- View your own profile as others see it

**Where you use it**: Profile page, Profile Settings page

---

### 10. Dashboard
**What it does**: Personalized overview of your activities

**Features**:
- Quick stats (posts created, applications sent/received, active collaborations)
- Your active posts
- Recent applications
- Upcoming deadlines
- Suggested opportunities based on skills
- Quick actions (create post, view applications)
- Activity feed

**Where you use it**: Dashboard page

---

### 11. Forums
**What it does**: Community discussions and Q&A

**Features**:
- Create discussion threads
- Post questions and answers
- Tag threads by topic
- Upvote/downvote posts
- Mark best answers
- Follow threads
- Search forum content
- Filter by tags and popularity

**Where you use it**: Forums page, Forum Thread pages

---

### 12. Events
**What it does**: Manage hackathons, workshops, and academic events

**Features**:
- Create events
- Register for events
- Event calendar view
- Event details and schedules
- RSVP tracking
- Event reminders
- Past events archive

**Where you use it**: Events page, Calendar page, Event Details page

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  React 18 + TypeScript + Material-UI + React Router         │
│  - Pages (40+ pages)                                        │
│  - Components (Design System, Advanced, Layout)             │
│  - Contexts (Auth, Notifications, Connections, Reputation)  │
│  - Services (Application, Chatroom, Email, Notification)    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS Requests (REST API)
                      │ WebSocket Connection (Real-time)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                        BACKEND LAYER                         │
│  Node.js + Express.js + TypeScript                          │
│  - API Routes (REST endpoints)                              │
│  - Controllers (Business logic)                             │
│  - Services (Application logic)                             │
│  - Middleware (Auth, Validation, Error handling)            │
│  - WebSocket Server (Real-time messaging)                   │
│  - Background Jobs (Post lifecycle, Notifications)          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Database Queries (Prisma ORM)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                       DATABASE LAYER                         │
│  PostgreSQL 14+                                             │
│  - Users table (Students + Faculty)                         │
│  - Posts table (Opportunities)                              │
│  - Applications table                                       │
│  - Invitations table                                        │
│  - Chatrooms table                                          │
│  - Messages table                                           │
│  - Notifications table                                      │
│  - Connections table                                        │
│  - 15+ tables total                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                      SUPPORTING SERVICES                     │
│  - Redis (Caching, Session management)                      │
│  - AWS S3 (File storage: images, resumes, documents)        │
│  - Email Service (SendGrid/AWS SES for notifications)       │
│  - Background Job Queue (Bull.js or similar)                │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture (Frontend)

```
src/
├── pages/              (40+ page components)
│   ├── Home.tsx                  - Main feed of opportunities
│   ├── Dashboard.tsx             - Personal dashboard
│   ├── PostDetailPage.tsx        - Single post details
│   ├── Applications.tsx          - Received applications
│   ├── AppliedOpportunities.tsx  - Sent applications
│   ├── Invitations.tsx           - Invitation management
│   ├── Chatrooms.tsx             - List of chatrooms
│   ├── ChatroomPage.tsx          - Single chatroom
│   ├── Profile.tsx               - User profile
│   └── ... (30+ more pages)
│
├── components/
│   ├── Design/         (Reusable UI components)
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ... (15+ components)
│   │
│   ├── Advanced/       (Complex components)
│   │   ├── ProjectCard.tsx        - Display post cards
│   │   └── ProjectDetailModal.tsx - Quick post view
│   │
│   ├── Application/    (Application-specific)
│   │   └── ApplicationModal.tsx   - Apply to opportunities
│   │
│   ├── Layout/         (Layout components)
│   │   ├── MainLayout.tsx         - App shell with navigation
│   │   └── PrivateRoute.tsx       - Protected route wrapper
│   │
│   └── Gamification/   (Gamification features)
│       ├── AchievementCard.tsx
│       └── ReputationWidget.tsx
│
├── contexts/           (State management)
│   ├── AuthContext.tsx          - User authentication state
│   ├── NotificationContext.tsx  - Real-time notifications
│   ├── ConnectionContext.tsx    - User connections
│   └── ReputationContext.tsx    - Reputation system
│
├── services/           (Business logic)
│   ├── applicationService.ts     - Application CRUD
│   ├── chatroomService.ts        - Chatroom lifecycle
│   ├── notificationService.ts    - Notification management
│   ├── invitationService.ts      - Invitation workflow
│   └── postLifecycleService.ts   - Post status automation
│
├── types/              (TypeScript definitions)
│   └── index.ts                  - All type definitions
│
└── utils/              (Helper functions)
    ├── validation.ts             - Form validation
    └── performance.ts            - Performance optimization
```

---

## Technology Stack

### Frontend Technologies

**Core Framework**:
- **React 18**: Component-based UI library
- **TypeScript 5**: Static type checking for reliability
- **Vite 4**: Fast build tool and development server

**UI Framework**:
- **Material-UI (MUI) v5**: Complete component library
- **Emotion**: CSS-in-JS styling
- **Custom Design System**: Tokens, theme, and design guidelines

**Routing**:
- **React Router v6**: Client-side routing and navigation

**State Management**:
- **React Context API**: Global state (Auth, Notifications, Connections)
- **Local State**: Component-level state with useState/useReducer

**Data Storage (Current - Development)**:
- **LocalStorage**: Mock backend for development and testing

**HTTP Client**:
- **Fetch API**: Native browser HTTP requests
- **Axios**: (Can be added) HTTP client with interceptors

**Form Handling**:
- **React Hook Form**: (Recommended) Form validation and management
- **Custom Validation**: Utility functions for validation

**Real-time** (To be implemented):
- **Socket.io Client**: WebSocket connection for real-time features

---

### Backend Technologies (To Implement)

**Runtime & Framework**:
- **Node.js 18+**: JavaScript runtime
- **Express.js 4**: Web application framework
- **TypeScript 5**: Type-safe backend code

**Database**:
- **PostgreSQL 14+**: Relational database for primary data storage
- **Prisma ORM**: Type-safe database client and migration tool

**Caching**:
- **Redis 7**: In-memory cache for sessions and frequently accessed data

**Authentication**:
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcrypt**: Password hashing
- **Passport.js**: (Optional) Authentication middleware

**File Storage**:
- **AWS S3**: Cloud storage for uploaded files (images, resumes, documents)
- **Multer**: Multipart form-data handling for file uploads

**Real-time Communication**:
- **Socket.io**: WebSocket library for real-time messaging

**Background Jobs**:
- **Bull.js**: Redis-based queue for background tasks
- **node-cron**: Scheduled tasks (post lifecycle, cleanup)

**Email Service**:
- **SendGrid**: Transactional email service (or AWS SES)
- **Nodemailer**: Email sending library

**Validation**:
- **Joi** or **Zod**: Request validation schemas

**Security**:
- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: Express-rate-limit for API protection

**Logging**:
- **Winston**: Logging library
- **Morgan**: HTTP request logger

**Testing**:
- **Jest**: Unit and integration testing
- **Supertest**: API endpoint testing

---

### Development Tools

**Code Quality**:
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

**Version Control**:
- **Git**: Version control system
- **GitHub**: Code repository and collaboration

**API Development**:
- **Postman**: API testing and documentation
- **Swagger/OpenAPI**: API documentation

**Database Tools**:
- **Prisma Studio**: Database GUI
- **pgAdmin**: PostgreSQL administration

---

## User Roles and Permissions

### Student Role

**Who they are**:
- Undergraduate or graduate students enrolled at the university
- Identified by Roll Number (format: A*********** - 12 digits)
- Have department and year of graduation

**What they can do**:

✅ **Create Posts**: Students can create opportunities for research, projects, or hackathons
✅ **Apply to Posts**: Can apply to any post they didn't create
✅ **Send Applications**: Submit applications with cover letters and resume
✅ **Receive Applications**: If they create a post, they receive applications
✅ **Accept/Reject Applications**: Manage applications to their own posts
✅ **Send Invitations**: Can invite specific users to their posts
✅ **Receive Invitations**: Can receive invitations from others
✅ **Create Chatrooms**: Chatrooms created when they accept first application
✅ **Send Messages**: Can message in chatrooms they're part of
✅ **Collaborate Temporarily**: Connect with team members during active projects only
✅ **Edit Profile**: Manage their own profile and settings
✅ **View All Posts**: Browse all opportunities on the platform
✅ **Participate in Forums**: Create threads, post answers, vote
✅ **Register for Events**: RSVP to events and hackathons

❌ **Cannot do**:
- Cannot apply to their own posts
- Cannot edit or delete others' posts
- Cannot send messages in chatrooms they're not part of
- Cannot access others' private information
- Cannot maintain permanent connections after project ends
- Cannot browse all users (only see recommended candidates for their posts)

**Required Information for Registration**:
- First Name, Middle Name (optional), Last Name
- University Email (must be valid university domain)
- Contact Number
- Gender
- Roll Number (12 digits, format: A***********)
- Department
- Year of Graduation
- Skills (at least 1 skill required)
- Projects (optional but recommended)
- Achievements (optional)

---

### Faculty Role

**Who they are**:
- Professors, researchers, teaching staff at the university
- Identified by Employee ID (format: 100*** - 6 digits)
- Have designation, qualification, and experience details

**What they can do**:

✅ **Create Posts**: Faculty can create research opportunities and projects
✅ **Apply to Posts**: Can apply to other faculty's posts (less common)
✅ **Send Applications**: Can apply to collaborative research opportunities
✅ **Receive Applications**: Receive applications from students and faculty
✅ **Accept/Reject Applications**: Manage applications to their posts
✅ **Send Invitations**: Can invite specific candidates to their research
✅ **Receive Invitations**: Can be invited to collaborate
✅ **Use AI Recommendations**: Get skill-matched candidate suggestions
✅ **Invite Candidates**: Send temporary project invitations to recommended students
✅ **Create Chatrooms**: Manage team communication
✅ **Send Messages**: Communicate with team members
✅ **View Collaborators**: See profiles of invited/accepted team members during project
✅ **Edit Profile**: Manage profile and showcase specializations
✅ **View Posts**: See their own posts and recommendations
✅ **Search Users**: Find collaborators
✅ **Create Events**: Organize workshops, hackathons, seminars
✅ **Mentor Students**: Guide and supervise student projects
✅ **Participate in Forums**: Share knowledge and answer questions
✅ **Earn Reputation**: Gain reputation through contributions

❌ **Cannot do**:
- Cannot apply to their own posts
- Cannot edit or delete others' posts (unless admin)
- Cannot access others' private information
- Cannot maintain permanent connections with students
- Cannot browse all users - only see their own posts and recommended candidates
- Cannot view other faculty's posts or projects

**Required Information for Registration**:
- First Name, Middle Name (optional), Last Name
- University Email (must be valid university domain)
- Contact Number
- Gender
- Employee ID (6 digits, format: 100***)
- Designation (Professor, Associate Professor, Assistant Professor, etc.)
- Date of Joining
- Total Experience (in years)
- Industry Experience (in years)
- Teaching Experience (in years)
- Qualification (Highest degree: PhD, M.Tech, etc.)
- Specialization (Areas of expertise)
- Skills
- Projects (optional)
- Achievements (optional)

---

### Permission Matrix

| Feature | Student | Faculty | Post Owner | Chatroom Member | Notes |
|---------|---------|---------|------------|-----------------|-------|
| **Create Post** | ✅ | ✅ | - | - | Anyone can create |
| **View Posts** | ✅ | ✅ | - | - | All posts public |
| **Apply to Post** | ✅ | ✅ | ❌ | - | Cannot apply to own post |
| **View Applications** | Owner only | Owner only | ✅ | ❌ | Only post owner sees applications |
| **Accept/Reject Application** | Owner only | Owner only | ✅ | ❌ | Only post owner decides |
| **Send Invitation** | Owner only | Owner only | ✅ | ❌ | Only post owner invites |
| **View AI Recommendations** | Owner only | Owner only | ✅ | ❌ | Helps find candidates |
| **Edit Post** | Owner only | Owner only | ✅ | ❌ | Own posts only |
| **Delete Post** | Owner only | Owner only | ✅ | ❌ | Own posts only |
| **Send Message in Chatroom** | ❌ | ❌ | ✅ | ✅ | Members only |
| **View Chatroom** | ❌ | ❌ | ✅ | ✅ | Members only |
| **View Own Profile** | ✅ | ✅ | - | - | Always allowed |
| **Edit Own Profile** | ✅ | ✅ | - | - | Always allowed |
| **View Collaborator Profiles** | Project only | Project only | ✅ | ✅ | During active project |
| **Browse All Posts** | ✅ | ❌ | - | - | Students browse, faculty see only their posts |
| **Participate in Forums** | ✅ | ✅ | - | - | All can participate |
| **Create Events** | ✅ | ✅ | - | - | Both roles can create |
| **Register for Events** | ✅ | ✅ | - | - | Both roles can register |

---

## How the System Works Together

Let me explain how all the features connect and work together in real scenarios:

### Scenario 1: Faculty Posts Research Opportunity

**Step-by-step flow**:

1. **Faculty logs in** → Authentication system verifies credentials → Dashboard loaded
2. **Clicks "Create Post"** → Navigate to Create Post page
3. **Fills out form**:
   - Title: "Machine Learning Research Project"
   - Purpose: "Research Work"
   - Description: Detailed research description
   - Skills Required: Python (2 people), TensorFlow (1 person), Data Analysis (1 person)
   - Deadline: 3 months from now
4. **Submits form** → Frontend validates → Sends POST request to backend
5. **Backend processes**:
   - Saves post to database
   - Creates skill requirements entries
   - Sets post status to "open"
   - Returns success
6. **Post now visible** on Home page for all users to see

**What happens in the database**:
- New row in `posts` table with post details
- Rows in `skill_requirements` table for each skill needed
- Post ID generated and linked

**What users see**:
- Post appears in Home feed
- Post appears on faculty's Dashboard under "My Posts"
- Post searchable and filterable

---

### Scenario 2: Student Applies to Opportunity

**Step-by-step flow**:

1. **Student browses Home page** → Sees list of posts
2. **Filters by Python skill** → Posts with Python requirement shown
3. **Clicks on post card** → Opens Post Detail page
4. **Reads full description** → Decides to apply
5. **Clicks "Apply" button** → Application Modal opens
6. **Fills application form**:
   - Selects skill: "Python"
   - Writes cover letter explaining interest
   - Attaches resume (optional if already in profile)
7. **Submits application** → Frontend validates → Sends POST request to backend
8. **Backend processes**:
   - Checks if student already applied (prevent duplicates)
   - Checks if post is still open
   - Saves application to database with status "pending"
   - Creates notification for post owner
   - Returns success
9. **Student sees confirmation** → Application appears in "Applied Opportunities"
10. **No connection created yet** → Temporary connection only created upon acceptance

**What happens in the database**:
- New row in `applications` table
- `applicant_id` = student's ID
- `post_id` = the post ID
- `status` = "pending"
- `skill_applied_for` = "Python"
- New row in `notifications` table for post owner

**What both users see**:
- **Student**: Application listed in "Applied Opportunities" with "Pending" status
- **Faculty**: New notification "You have a new application"
- **Faculty**: Application appears in "Applications" page

---

### Scenario 3: Faculty Reviews and Accepts Application

**Step-by-step flow**:

1. **Faculty receives notification** → "New application received"
2. **Clicks notification** → Navigates to Applications page
3. **Sees list of applications** for all their posts
4. **Filters by specific post** → Sees applications for that post
5. **Clicks on an application** → Views applicant's details:
   - Applicant profile
   - Cover letter
   - Resume
   - Skills match
6. **Decides to accept** → Clicks "Accept" button
7. **Confirmation dialog** → Confirms acceptance
8. **Backend processes**:
   - Updates application status to "accepted"
   - Increments `accepted_count` for that skill in post
   - Increments `current_members` count in post
   - Checks if post is now filled (all skills have required count)
   - If filled, updates post status to "filled"
   - If chatroom doesn't exist, creates new chatroom
   - Adds student to chatroom members
   - Creates temporary project connection (student ↔ post owner)
   - Creates notification for student
   - Creates reputation points for student
9. **Chatroom created/updated** → Both can now communicate

**What happens in the database**:
- `applications` table: status changed to "accepted"
- `posts` table: skill requirements updated, current_members incremented
- `chatrooms` table: New chatroom created (if first acceptance) or existing updated
- `chat_members` table: Student added to chatroom
- `notifications` table: New notification for student

**What both users see**:
- **Student**: Notification "Your application was accepted!"
- **Student**: Application status changes to "Accepted" in Applied Opportunities
- **Student**: New chatroom appears in Chatrooms page
- **Faculty**: Application marked as accepted
- **Faculty**: Chatroom accessible with new member
- **Both**: Can now send messages in chatroom

---

### Scenario 4: Faculty Uses AI to Invite Candidate

**Step-by-step flow**:

1. **Faculty views their post** → Post Detail page
2. **Notices still need 1 TensorFlow expert** → Wants to find one
3. **Clicks "Find Candidates"** → Navigates to Recommended Candidates page
4. **AI system processes**:
   - Analyzes post's skill requirements
   - Searches database for users with those skills
   - Calculates similarity scores
   - Filters out people who already applied
   - Filters out post owner
   - Ranks by skill match
5. **Page shows ranked candidates** with:
   - Profile pictures
   - Names and roles
   - Skill matches highlighted
   - Similarity score (e.g., "85% match")
   - Brief bio
6. **Faculty reviews candidates** → Clicks on one to see full profile
7. **Decides to invite** → Clicks "Send Invitation" button
8. **Invitation modal opens** → Writes personal message
9. **Sends invitation** → Backend processes:
   - Creates invitation record
   - Sets status to "pending"
   - Creates notification for candidate
   - Returns success
10. **Candidate receives notification** → "You received an invitation"

**What happens in the database**:
- `invitations` table: New row with invitation details
- `notifications` table: Notification for candidate

**What both users see**:
- **Faculty**: Invitation listed in "Sent Invitations" with "Pending" status
- **Candidate**: Notification about invitation
- **Candidate**: Invitation appears in "Invitations" page

---

### Scenario 5: Candidate Accepts Invitation

**Step-by-step flow**:

1. **Candidate sees notification** → "You have a new invitation"
2. **Clicks notification** → Navigates to Invitations page
3. **Sees invitation details**:
   - Post title and description
   - Who sent invitation (faculty name)
   - Personal message from faculty
   - Skill they're invited for
4. **Interested in opportunity** → Clicks "Accept" button
5. **Backend processes**:
   - Updates invitation status to "accepted"
   - Creates application automatically with status "accepted"
   - Increments skill count in post
   - Increments current_members in post
   - Adds candidate to chatroom
   - Creates notifications
   - Awards reputation points
6. **Automatically joined** → No separate application needed

**What happens in the database**:
- `invitations` table: status = "accepted"
- `applications` table: New row with status = "accepted" (auto-created)
- `posts` table: Skill requirements and member count updated
- `chat_members` table: Candidate added to chatroom
- `project_connections` table: Temporary connection created (candidate ↔ post owner)
- `notifications` table: Notifications for faculty

**What both users see**:
- **Candidate**: Invitation status changes to "Accepted"
- **Candidate**: New chatroom appears
- **Candidate**: Can message team
- **Faculty**: Notification "Your invitation was accepted"
- **Faculty**: Sees new member in chatroom
- **Both**: Post updated to reflect new member

---

### Scenario 6: Team Communicates via Chatroom

**Step-by-step flow**:

1. **Team member opens app** → Sees chatroom notification
2. **Clicks on Chatrooms** → Sees list of active chatrooms
3. **Chatroom shows**:
   - Project title
   - Number of members
   - Last message preview
   - Unread count
4. **Clicks on chatroom** → Opens chatroom page
5. **Sees**:
   - All previous messages with timestamps
   - Who sent each message
   - Member list on sidebar
   - Message input at bottom
6. **Types message** → "Hi everyone, excited to work on this!"
7. **Presses send** → Backend processes:
   - Validates user is member
   - Saves message to database
   - Broadcasts to all members via WebSocket
   - Creates notifications for other members
   - Updates chatroom's last_activity timestamp
8. **Other members see message** in real-time (if online) or when they open chatroom

**What happens in the database**:
- `messages` table: New row with message content, sender, timestamp
- `chatrooms` table: last_activity updated
- `notifications` table: Notifications for other members (if they're not in chatroom)

**Real-time behavior**:
- WebSocket connection established when chatroom opened
- New messages appear instantly without page refresh
- Typing indicators (optional feature)
- Read receipts (optional feature)

---

### Scenario 7: Post Lifecycle Management

**Automated background process**:

1. **Post created** with deadline of "2024-12-15"
2. **Post status** = "open"
3. **Background job checks daily**:
   - Is current date past deadline?
   - If yes, change status to "closed"
4. **When post closes**:
   - No new applications accepted
   - Existing team continues working
   - Chatroom stays active
5. **Grace period** (e.g., 3 days after deadline):
   - Chatroom remains active for final discussions
6. **After grace period**:
   - Chatroom status changes to "read_only"
   - Members can read messages but not send new ones
7. **After additional 7 days**:
   - Chatroom status changes to "deleted"
   - Messages archived
   - Chatroom hidden from active list
   - All temporary project connections removed
   - Team members can no longer see each other's profiles

**What happens in the database**:
- `posts` table: status changes from "open" → "closed"
- `chatrooms` table: status changes "active" → "read_only" → "deleted"
- Automated by `postLifecycleService.ts`

---

## Data Flow Overview

### Application Submission Flow

```
User Interface (Post Detail Page)
         ↓
  Click "Apply" button
         ↓
Application Modal opens
         ↓
User fills form:
  - Select skill
  - Write cover letter
  - Attach resume
         ↓
Click "Submit"
         ↓
Frontend Validation:
  - Required fields filled?
  - Valid format?
         ↓
POST /api/v1/applications
  {
    postId: "123",
    skillAppliedFor: "Python",
    coverLetter: "...",
    resumeUrl: "..."
  }
         ↓
Backend Receives Request
         ↓
Middleware: Authentication
  - Is user logged in?
  - Valid token?
         ↓
Controller: Application Controller
         ↓
Validation:
  - Post exists?
  - Post is open?
  - User hasn't already applied?
  - User isn't post owner?
         ↓
Service: Application Service
         ↓
Database Operations:
  1. Insert into applications table
  2. Insert notification for post owner
  3. Commit transaction
         ↓
Response to Frontend:
  {
    success: true,
    application: { ... },
    message: "Application submitted"
  }
         ↓
Frontend Updates:
  - Close modal
  - Show success message
  - Update "Applied Opportunities" list
  - Disable "Apply" button on post
         ↓
Post Owner Receives Notification
  - Real-time via WebSocket
  - Or on next page load
```

---

### Authentication Flow

```
User Opens Login Page
         ↓
Enters email and password
         ↓
Click "Login"
         ↓
POST /api/v1/auth/login
  {
    email: "student@university.edu",
    password: "********"
  }
         ↓
Backend Receives
         ↓
Find User in Database:
  - Query users table by email
         ↓
User Found?
  ├─ No → Return error "User not found"
  └─ Yes → Continue
         ↓
Verify Password:
  - Hash submitted password
  - Compare with stored hash
         ↓
Password Correct?
  ├─ No → Return error "Invalid password"
  └─ Yes → Continue
         ↓
Generate JWT Token:
  - Include user ID, role, email
  - Set expiration (24 hours)
  - Sign with secret key
         ↓
Generate Refresh Token:
  - Longer expiration (7 days)
  - Store in database
         ↓
Return Response:
  {
    token: "eyJhbGc...",
    refreshToken: "xyz123...",
    user: {
      id, firstName, lastName,
      email, role, etc.
    }
  }
         ↓
Frontend Receives:
  - Store token in localStorage
  - Store user in AuthContext
  - Redirect to /home
         ↓
All Future Requests Include:
  Authorization: Bearer eyJhbGc...
         ↓
Backend Middleware Verifies:
  - Token valid?
  - Not expired?
  - User still exists?
         ↓
Request Proceeds or Rejected
```

---

## Security and Authentication

### Password Security

**How passwords are protected**:
1. User creates password during registration
2. Backend receives password (over HTTPS)
3. Password is hashed using bcrypt with salt rounds (10+)
4. Only hash is stored in database
5. Original password never stored
6. When logging in, submitted password is hashed and compared
7. If hashes match, authentication succeeds

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot contain email or name

---

### JWT Token System

**How authentication tokens work**:

**Access Token**:
- Short-lived (24 hours)
- Contains: user ID, role, email, issued time, expiration time
- Sent with every API request in Authorization header
- Verified on backend for each protected endpoint

**Refresh Token**:
- Long-lived (7 days)
- Stored in database
- Used to get new access token when expired
- Can be revoked for security

**Token Flow**:
```
Login → Get both tokens → Store access token → Use for requests
       ↓
Access token expires after 24h
       ↓
Frontend detects expiration → Use refresh token → Get new access token
       ↓
Continue using new access token
       ↓
Refresh token expires after 7 days → Must login again
```

---

### Authorization Checks

**Every API request checks**:
1. **Authentication**: Is user logged in? (Valid token?)
2. **Authorization**: Can user perform this action?

**Examples**:
- **Viewing post**: Anyone (authenticated or not)
- **Applying to post**: Authenticated users only (not post owner)
- **Accepting application**: Post owner only
- **Sending message in chatroom**: Chatroom members only
- **Editing post**: Post owner only
- **Viewing applications**: Post owner only

---

### Data Privacy

**What's public**:
- Post titles and descriptions
- Public user profiles (if user chooses public)
- User's public projects and achievements

**What's private**:
- Email addresses (only shown to connections or post owners for accepted applications)
- Phone numbers
- Resume content (only visible when applying or in profile)
- Applications (only post owner sees)
- Chatroom messages (only members see)
- Connection requests (only sender and receiver)

**Privacy Controls**:
- Users can set profile to public or private
- Private profiles only show basic info (name, role, skills)
- Full profile visible to connections
- Email only visible when needed for communication

---

This completes Part 1 of the comprehensive system documentation. The system is designed as a complete academic collaboration platform with robust features for both students and faculty to connect, collaborate, and manage projects effectively.

**Next**: Read Part 2 for complete Student Account documentation with every page, click, and API detailed.
