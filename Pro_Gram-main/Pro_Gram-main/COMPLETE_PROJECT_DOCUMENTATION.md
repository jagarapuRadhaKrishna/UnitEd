# United With Landing Page - Complete End-to-End Project Development Documentation

## Table of Contents
1. Project Overview & Architecture
2. Frontend Routes & Pages
3. Frontend Components & Features
4. Frontend Services & APIs
5. Backend API Endpoints & Services
6. Database Design & Schema
7. User Flows & Interactions
8. Business Logic & Rules
9. Error Handling & Validation
10. Authentication & Authorization
11. Notifications & Alerts
12. Theme & Styling
13. Glossary & Terms

---

## 1. Project Overview & Architecture

### 1.1 Technology Stack
- **Frontend:**
  - React 18 with TypeScript
  - Material-UI (MUI) components
  - Framer Motion for animations
  - React Router for navigation
  - Context API for state management
  - Axios for HTTP requests
  
- **Backend:**
  - Node.js runtime
  - Express.js framework
  - Prisma ORM
  - PostgreSQL database
  - JWT for authentication

### 1.2 Monorepo Structure
```
project-root/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API and local services
│   ├── contexts/           # React contexts
│   ├── config/             # Configuration
│   ├── theme/              # Theme and styling
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root app component
│   └── main.tsx            # Entry point
├── backend/                # Backend source
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Middleware
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry
│   ├── prisma/             # Database
│   │   ├── schema.prisma   # Schema definition
│   │   └── migrations/     # DB migrations
│   └── package.json        # Backend dependencies
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

---

## 2. Frontend Routes & Pages (Complete Details)

### 2.1 Public Routes (No Authentication Required)
#### 2.1.1 Landing Page
- **Route:** `/`
- **Component:** `LandingPageNew.tsx`
- **Features:**
  - Hero section with call-to-action
  - Navigation bar
  - Feature highlights
  - Testimonials/social proof
  - Footer with links
  - Responsive design
  - Dark/light theme toggle (if available)

#### 2.1.2 Login Page
- **Route:** `/login`
- **Component:** `LoginNew.tsx`
- **Features:**
  - Email input field
  - Password input field
  - "Remember me" checkbox
  - Login button with loading state
  - Link to forgot password
  - Link to registration
  - Form validation with error messages
  - Success redirect to dashboard

#### 2.1.3 Forgot Password Page
- **Route:** `/forgot-password`
- **Component:** `ForgotPassword.tsx`
- **Features:**
  - Email input
  - Submit button
  - Email verification sending
  - Success message

#### 2.1.4 Registration Pages
- **Route:** `/register/student`
- **Route:** `/register/faculty`
- **Components:** `StudentRegister.tsx`, `FacultyRegister.tsx`
- **Features:**
  - Multi-step form (Step 1: Basic info, Step 2: Profile, Step 3: Preferences)
  - First name, last name inputs
  - Email, password inputs
  - Password confirmation
  - Role selection (student/faculty)
  - Department selection
  - Avatar/profile picture upload
  - Terms & conditions checkbox
  - Form validation
  - Success message and redirect to login

#### 2.1.5 Role Selection Page
- **Route:** `/role-selection`
- **Component:** `RoleSelection.tsx`
- **Features:**
  - Student role option
  - Faculty role option
  - Role descriptions
  - Navigation to respective registration pages

#### 2.1.6 Not Found Page
- **Route:** `*` (catch-all for undefined routes)
- **Component:** `NotFoundPage.tsx`
- **Features:**
  - 404 error message
  - Link back to home
  - Friendly UI

---

### 2.2 Protected Routes (Authentication Required)

#### 2.2.1 Dashboard
- **Route:** `/dashboard`
- **Component:** `Dashboard.tsx`
- **Features:**
  - Welcome message with user name
  - Quick stats (posts created, invitations pending, etc.)
  - Recent activity feed
  - Action buttons (create post, browse opportunities)
  - Profile quick access
  - Settings quick access
  - Responsive grid layout
  - Loading states

#### 2.2.2 Home/Feed Page
- **Route:** `/home`
- **Component:** `Home.tsx`
- **Features:**
  - Personalized feed of posts/opportunities
  - Filter by category/status
  - Search functionality
  - Sort by date/relevance
  - Post preview cards
  - Like/bookmark buttons
  - View count
  - Author information
  - Pagination or infinite scroll
  - Empty state messaging

#### 2.2.3 Personalized Feed
- **Route:** `/feed`
- **Component:** `PersonalizedFeed.tsx`
- **Features:**
  - AI-recommended posts based on skills
  - Filter recommendations
  - Mark as interested
  - Dismiss recommendations
  - View full post details

#### 2.2.4 Skill-Matched Posts
- **Route:** `/skill-matched-posts`
- **Component:** `SkillMatchedPosts.tsx`
- **Features:**
  - Posts matching user skills
  - Skill filter
  - Match percentage display
  - Apply/express interest button

#### 2.2.5 Profile Pages
- **Route:** `/profile`
- **Component:** `Profile.tsx`
- **Features:**
  - User avatar
  - Name and bio
  - Department/role
  - Skills section
  - Projects contributed to
  - Experience section
  - Edit profile button
  - Connection count

- **Route:** `/profile/:userId`
- **Component:** `UserProfile.tsx`
- **Features:**
  - View other user's profile
  - Same fields as own profile
  - Send invitation button
  - View shared projects

#### 2.2.6 Candidate Profile Page
- **Route:** `/candidate/:userId`
- **Component:** `CandidateProfilePage.tsx`
- **Features:**
  - Candidate details
  - Skills matching
  - Experience
  - Availability status
  - Send invitation button

#### 2.2.7 Post Management Pages
- **Route:** `/posts/create`
- **Component:** `CreatePostMultiStep.tsx`
- **Features:**
  - Multi-step form
  - Step 1: Basic details (title, description)
  - Step 2: Requirements (skills needed)
  - Step 3: Team size, deadline
  - Step 4: Review and publish
  - Save draft option
  - Publish button
  - Form validation
  - Success message

- **Route:** `/posts/manage`
- **Component:** `PostManagementDashboard.tsx`
- **Features:**
  - List all user's posts
  - Filter by status (draft, published, closed)
  - Edit post button
  - Delete post button
  - View applications
  - View team members
  - Close project button
  - Stats for each post

- **Route:** `/posts/:postId/manage`
- **Component:** `PostManagePage.tsx`
- **Features:**
  - Edit post details
  - Manage team members
  - View applications
  - Accept/reject applications
  - Send invitations to users
  - Close project
  - View discussion thread

#### 2.2.8 Post Detail Page
- **Route:** `/posts/:postId`
- **Component:** `PostDetailPage.tsx`
- **Features:**
  - Full post details
  - Author information
  - Skills required
  - Team members
  - Applications submitted
  - Discussion/comments section
  - Send invitation button (if author)
  - Apply/express interest button (if not author)
  - Like/bookmark
  - Share options

#### 2.2.9 Project Detail Page
- **Route:** `/projects/:projectId`
- **Component:** `ProjectDetail.tsx`
- **Features:**
  - Project overview
  - Project objectives
  - Team members
  - Chat/discussion area
  - Documents/resources section
  - Timeline/milestones
  - View team connections

#### 2.2.10 Invitations Page
- **Route:** `/invitations`
- **Component:** `Invitations.tsx` (wrapper) → `InvitationDashboard.tsx`
- **Sub-components:**
  - **InvitationDashboard.tsx**: Main container with tabs
  - **SentInvitationsList.tsx**: List of sent invitations
  - **ReceivedInvitationsList.tsx**: List of received invitations
  - **InvitationCard.tsx**: Individual invitation display
- **Features:**
  - Two tabs: "I Invited" and "They Invited Me"
  - Filter by status (ALL, PENDING, ACCEPTED, REJECTED, CANCELLED)
  - Pagination (10 items per page)
  - Loading states
  - Empty states
  - Error handling with alerts
  - Sent invitations: Can cancel pending
  - Received invitations: Can accept or reject pending
  - Timestamps for creation and response
  - User avatars with initials
  - Success/error messages
  - Statistics display (pending, accepted, rejected counts)

#### 2.2.11 Applications Page
- **Route:** `/applications`
- **Component:** `Applications.tsx`
- **Features:**
  - List of applications submitted by user
  - Status of each application
  - Links to projects
  - Withdraw application option

#### 2.2.12 Applied Opportunities Page
- **Route:** `/applied-opportunities`
- **Component:** `AppliedOpportunities.tsx`
- **Features:**
  - List of opportunities user applied to
  - Status (pending, accepted, rejected)
  - Application date
  - View opportunity details
  - Timeline view

#### 2.2.13 Accepted Applications Page
- **Route:** `/accepted-applications`
- **Component:** `AcceptedApplications.tsx`
- **Features:**
  - List of accepted applications
  - Associated projects
  - Team members
  - Chat link
  - Project status

#### 2.2.14 Application Management
- **Route:** `/applications/manage`
- **Component:** `ApplicationManagement.tsx`
- **Features:**
  - View all applications for user's posts
  - Filter by status
  - Accept/reject applications
  - Send invitation to applicants
  - View applicant profile
  - Add notes

#### 2.2.15 Invitations & Recommendations
- **Route:** `/invitations`
- **Component:** `Invitations.tsx`
- (Already documented above)

- **Route:** `/recommended-candidates`
- **Component:** `RecommendedCandidatesPage.tsx`
- **Features:**
  - AI-recommended candidates for projects
  - Filter by skills
  - View candidate profiles
  - Send invitations
  - Match percentage

#### 2.2.16 Chat Pages
- **Route:** `/chatrooms`
- **Component:** `ChatroomsNew.tsx`
- **Features:**
  - List of active chatrooms
  - Filter chatrooms
  - Create new chatroom
  - Recent messages preview
  - Unread message count
  - Search chatrooms

- **Route:** `/chatrooms/:chatroomId`
- **Component:** `ChatroomPage.tsx`
- **Features:**
  - Message list with pagination
  - Message input box
  - Send message button
  - Real-time message updates
  - User avatars
  - Timestamps
  - Edit/delete messages
  - Pin message
  - File upload support
  - Emoji picker
  - User typing indicator
  - Online status

#### 2.2.17 Forums Page
- **Route:** `/forums`
- **Component:** `Forums.tsx`
- **Features:**
  - List of discussion forums
  - Filter by project/category
  - Search threads
  - Create new thread
  - Thread preview
  - Reply count
  - Last activity date

- **Route:** `/forums/:forumId`
- **Component:** `Forums/` (subfolder)
- **Features:**
  - Forum details
  - Thread list
  - Create thread button
  - Search threads

#### 2.2.18 Notifications Page
- **Route:** `/notifications`
- **Component:** `Notifications.tsx`
- **Features:**
  - List of all notifications
  - Filter by type (invitations, applications, messages, etc.)
  - Mark as read/unread
  - Delete notification
  - View notification details
  - Real-time notification updates
  - Sort by date

#### 2.2.19 Settings & Profile Settings
- **Route:** `/settings`
- **Component:** `Settings.tsx`
- **Features:**
  - General settings
  - Privacy settings
  - Notification preferences
  - Theme selection
  - Language selection
  - Account management
  - Logout button

- **Route:** `/profile/settings`
- **Component:** `ProfileSettingsNew.tsx`
- **Features:**
  - Edit name
  - Edit bio
  - Edit skills
  - Edit department
  - Upload avatar
  - Change password
  - Add social links
  - Save changes button
  - Validation errors

#### 2.2.20 About Page
- **Route:** `/about`
- **Component:** `AboutNew.tsx`
- **Features:**
  - Project mission/vision
  - Team information
  - Features overview
  - Contact information

---

## 3. Frontend Components & Features (Detailed)

### 3.1 Layout Components
#### 3.1.1 Layout Folder
- **Navbar.tsx**: Top navigation bar with logo, menu, user dropdown
- **Sidebar.tsx**: Left sidebar with navigation links
- **Footer.tsx**: Footer with links and info
- **Container.tsx**: Main layout wrapper

### 3.2 Advanced Components
#### 3.2.1 ProjectCard.tsx
- Display project summary
- Title, description, author
- Skills required tags
- Team size indicator
- Timeline/deadline
- Action buttons (view, apply, etc.)

### 3.3 Application Components
- **ApplicationForm.tsx**: Form to apply to projects
- **ApplicationCard.tsx**: Display application status
- **ApplicationList.tsx**: List of applications

### 3.4 Design Components
- **DesignSystem.tsx**: Theme tokens and component library
- **Button.tsx**: Custom button component
- **Input.tsx**: Custom input component
- **Modal.tsx**: Modal dialog
- **Dropdown.tsx**: Dropdown menu
- **Card.tsx**: Card container
- **Badge.tsx**: Status badges
- **Avatar.tsx**: User avatar with image/initials
- **Chip.tsx**: Tag/chip component
- **Alert.tsx**: Alert/notification display
- **Spinner.tsx**: Loading spinner

### 3.5 Debug Components
- **DebugPanel.tsx**: Dev tools (if in development)
- **ErrorBoundary.tsx**: Error catching and display

### 3.6 Invitation Components (Detailed)
- **InvitationDashboard.tsx**:
  - Main container component
  - Two tabs: "I Invited" (sent) and "They Invited Me" (received)
  - Tab switching with animation
  - Header with emoji icon
  - Info box explaining features
  - How it works section

- **SentInvitationsList.tsx**:
  - List of invitations sent by user
  - Filter dropdown (ALL, PENDING, ACCEPTED, REJECTED, CANCELLED)
  - Pagination (10 per page)
  - Loading spinner
  - Empty state
  - Error alerts
  - Statistics (pending, accepted, rejected counts)
  - Each invitation rendered via InvitationCard
  - Cancel pending invitations (with confirmation dialog)
  - Success/error messages

- **ReceivedInvitationsList.tsx**:
  - List of invitations received by user
  - Filter dropdown with action needed indicator
  - Pagination (10 per page)
  - Loading spinner
  - Empty state
  - Error alerts
  - Statistics (pending, accepted, rejected)
  - Each invitation rendered via InvitationCard
  - Accept button for pending (green, prominent)
  - Reject button for pending (red outline)
  - Success/error messages

- **InvitationCard.tsx**:
  - Display single invitation
  - Color-coded status border:
    - PENDING: Amber
    - ACCEPTED: Green
    - REJECTED: Red
    - CANCELLED: Gray
  - User avatar with initials
  - Project title
  - Inviter/invitee name
  - Optional custom message
  - Timestamps (created, responded)
  - Framer Motion slide-up animation
  - Conditional action buttons:
    - Received pending: Accept + Reject buttons
    - Sent pending: Cancel button (with confirmation)
    - Non-pending: Status display
  - Loading states during API calls
  - Responsive design

---

## 4. Frontend Services & APIs (Detailed)

### 4.1 API Configuration
#### 4.1.1 config/api.ts
- Base URL configuration
- API client setup (axios instance)
- Default headers
- Timeout settings
- Request/response interceptors
- Error handling

### 4.2 Authentication Services
#### 4.2.1 authApiService.ts
- **POST /auth/register**: User registration
- **POST /auth/login**: User login
- **POST /auth/logout**: User logout
- **POST /auth/refresh-token**: Refresh JWT
- **GET /auth/verify**: Verify token validity
- **POST /auth/forgot-password**: Initiate password reset
- **POST /auth/reset-password**: Complete password reset

#### 4.2.2 localStorageAuthService.ts
- Store JWT token locally
- Retrieve JWT token
- Clear JWT token
- Check if user logged in

#### 4.2.3 secureStorageService.ts
- Secure token storage
- Encrypt/decrypt tokens
- Prevent XSS attacks

#### 4.2.4 mockAuthService.ts
- Mock authentication for development
- Simulate API responses

### 4.3 User Services
#### 4.3.1 userApiService.ts
- **GET /users/:userId**: Get user profile
- **PUT /users/:userId**: Update profile
- **GET /users/:userId/posts**: User's posts
- **GET /users/:userId/skills**: User's skills
- **POST /users/:userId/avatar**: Upload avatar
- **DELETE /users/:userId**: Delete account

#### 4.3.2 mockUserService.ts
- Mock user data for development

### 4.4 Post Services
#### 4.4.1 postsApiService.ts
- **GET /posts**: List all posts
- **POST /posts**: Create new post
- **GET /posts/:postId**: Get post details
- **PUT /posts/:postId**: Update post
- **DELETE /posts/:postId**: Delete post
- **POST /posts/:postId/close**: Close project
- **GET /posts/:postId/applications**: Get applications
- **POST /posts/:postId/apply**: Submit application
- **POST /posts/:postId/applications/:appId/accept**: Accept application
- **POST /posts/:postId/applications/:appId/reject**: Reject application

#### 4.4.2 postLifecycleService.ts
- Track post status changes
- Handle auto-disconnect on close
- Calculate post statistics

#### 4.4.3 mockData.ts
- Mock posts for development
- Mock applications for development

### 4.5 Invitation Services
#### 4.5.1 invitationApiService.ts
- **GET /invitations/sent**: Get sent invitations (paginated, filterable)
- **GET /invitations/received**: Get received invitations (paginated, filterable)
- **POST /invitations**: Send new invitation
- **POST /invitations/:id/accept**: Accept invitation
- **POST /invitations/:id/reject**: Reject invitation
- **POST /invitations/:id/cancel**: Cancel invitation
- **POST /invitations/:id/disconnect**: Manual disconnect
- **GET /invitations/post/:postId/connections**: Get team connections

#### 4.5.2 invitationService.ts (local)
- Legacy local state management
- Local invitation tracking

### 4.6 Notification Services
#### 4.6.1 notificationService.ts
- **GET /notifications**: Get all notifications
- **POST /notifications/:id/read**: Mark as read
- **DELETE /notifications/:id**: Delete notification
- **GET /notifications/unread**: Get unread count

### 4.7 Email Services
#### 4.7.1 emailService.ts
- **POST /emails/send**: Send email (backend)
- Send invitation notifications
- Send application notifications
- Send password reset emails

### 4.8 Chatroom Services
#### 4.8.1 chatroomService.ts
- **GET /chatrooms**: List all chatrooms
- **POST /chatrooms**: Create chatroom
- **GET /chatrooms/:id**: Get chatroom details
- **GET /chatrooms/:id/messages**: Get messages (paginated)
- **POST /chatrooms/:id/messages**: Send message
- **PUT /messages/:msgId**: Edit message
- **DELETE /messages/:msgId**: Delete message

### 4.9 Storage Services
#### 4.9.1 storageSecurityMonitor.ts
- Monitor storage access
- Prevent unauthorized access
- Log security events

---

## 5. Backend API Endpoints & Services (Detailed)

### 5.1 API Response Format
All responses follow this structure:
```
{
  success: boolean,
  message: string,
  data?: any,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### 5.2 Authentication Endpoints
- **POST /api/auth/register**: Register new user
  - Body: firstName, lastName, email, password, role, department
  - Response: JWT token, user details

- **POST /api/auth/login**: Login user
  - Body: email, password
  - Response: JWT token, user details

- **POST /api/auth/logout**: Logout user
  - Headers: Authorization: Bearer {token}
  - Response: Success message

- **POST /api/auth/refresh-token**: Refresh JWT
  - Body: refreshToken
  - Response: New JWT token

### 5.3 User Endpoints
- **GET /api/users/:userId**: Get user profile
  - Response: User object with all details

- **PUT /api/users/:userId**: Update user profile
  - Body: firstName, lastName, bio, skills, department, etc.
  - Response: Updated user object

- **GET /api/users/:userId/posts**: Get user's posts
  - Query: page, limit, status
  - Response: Posts array with pagination

- **GET /api/users/:userId/skills**: Get user skills
  - Response: Skills array

- **POST /api/users/:userId/avatar**: Upload avatar
  - Body: file (multipart)
  - Response: Avatar URL

- **DELETE /api/users/:userId**: Delete account
  - Response: Success message

### 5.4 Post Endpoints
- **GET /api/posts**: List all posts
  - Query: page, limit, filter, sort
  - Response: Posts array with pagination

- **POST /api/posts**: Create new post
  - Body: title, description, skills, teamSize, deadline, category
  - Headers: Authorization: Bearer {token}
  - Response: New post object

- **GET /api/posts/:postId**: Get post details
  - Response: Post object with author, applications, team

- **PUT /api/posts/:postId**: Update post
  - Body: title, description, skills, teamSize, deadline
  - Headers: Authorization: Bearer {token}
  - Response: Updated post object

- **DELETE /api/posts/:postId**: Delete post
  - Headers: Authorization: Bearer {token}
  - Response: Success message

- **POST /api/posts/:postId/close**: Close/complete project
  - Headers: Authorization: Bearer {token}
  - Response: Updated post with status CLOSED
  - Side effect: Auto-disconnect all invitations (set to DISCONNECTED)

- **GET /api/posts/:postId/applications**: Get applications
  - Query: page, limit, status
  - Response: Applications array

- **POST /api/posts/:postId/apply**: Submit application
  - Body: coverLetter (optional)
  - Headers: Authorization: Bearer {token}
  - Response: Application object

- **POST /api/posts/:postId/applications/:appId/accept**: Accept application
  - Headers: Authorization: Bearer {token}
  - Response: Updated application
  - Side effect: Create connection/invitation

- **POST /api/posts/:postId/applications/:appId/reject**: Reject application
  - Headers: Authorization: Bearer {token}
  - Response: Updated application

### 5.5 Invitation Endpoints
- **GET /api/invitations/sent**: Get sent invitations
  - Query: page, limit, status
  - Headers: Authorization: Bearer {token}
  - Response: Invitations array with pagination
  - Filter options: ALL, PENDING, ACCEPTED, REJECTED, CANCELLED

- **GET /api/invitations/received**: Get received invitations
  - Query: page, limit, status
  - Headers: Authorization: Bearer {token}
  - Response: Invitations array with pagination
  - Filter options: ALL, PENDING, ACCEPTED, REJECTED, CANCELLED

- **POST /api/invitations**: Send new invitation
  - Body: postId, inviteeId, message (optional)
  - Headers: Authorization: Bearer {token}
  - Response: New invitation object
  - Validation: No duplicates, no self-invites, must be post author

- **POST /api/invitations/:invitationId/accept**: Accept invitation
  - Headers: Authorization: Bearer {token}
  - Response: Updated invitation with status ACCEPTED
  - Side effect: Add user to project team

- **POST /api/invitations/:invitationId/reject**: Reject invitation
  - Headers: Authorization: Bearer {token}
  - Response: Updated invitation with status REJECTED
  - Side effect: User not added to team

- **POST /api/invitations/:invitationId/cancel**: Cancel invitation
  - Headers: Authorization: Bearer {token}
  - Response: Updated invitation with status CANCELLED
  - Validation: Only PENDING can be cancelled, only by inviter

- **POST /api/invitations/:invitationId/disconnect**: Manual disconnect
  - Headers: Authorization: Bearer {token}
  - Response: Updated invitation with status DISCONNECTED
  - Validation: Only ACCEPTED can be disconnected

- **GET /api/invitations/post/:postId/connections**: Get team connections
  - Headers: Authorization: Bearer {token}
  - Response: Array of connected users

### 5.6 Notification Endpoints
- **GET /api/notifications**: Get all notifications
  - Query: page, limit, type, read
  - Headers: Authorization: Bearer {token}
  - Response: Notifications array with pagination

- **POST /api/notifications/:notificationId/read**: Mark as read
  - Headers: Authorization: Bearer {token}
  - Response: Updated notification

- **DELETE /api/notifications/:notificationId**: Delete notification
  - Headers: Authorization: Bearer {token}
  - Response: Success message

- **GET /api/notifications/unread/count**: Get unread count
  - Headers: Authorization: Bearer {token}
  - Response: { unreadCount: number }

### 5.7 Backend Services
#### 5.7.1 postService.ts
- createPost(data): Create new post
- updatePost(postId, data): Update post
- deletePost(postId): Delete post
- getPost(postId): Get post details
- getPosts(filters): List posts with filters
- closePost(postId): Close project
- getPostApplications(postId): Get applications
- createApplication(postId, userId, coverLetter): Submit app
- acceptApplication(appId): Accept app
- rejectApplication(appId): Reject app

#### 5.7.2 invitationService.ts
- sendInvitation(postId, inviteeId, message): Send invitation
- getSentInvitations(userId, page, limit, status): Get sent
- getReceivedInvitations(userId, page, limit, status): Get received
- acceptInvitation(invitationId): Accept invitation
- rejectInvitation(invitationId): Reject invitation
- cancelInvitation(invitationId): Cancel invitation
- disconnectInvitation(invitationId): Manual disconnect
- getPostConnections(postId): Get team members
- autoDisconnectOnProjectClose(postId): Auto-disconnect all

#### 5.7.3 userService.ts
- createUser(data): Register user
- getUser(userId): Get profile
- updateUser(userId, data): Update profile
- deleteUser(userId): Delete account
- userExists(email): Check if exists
- getUserSkills(userId): Get skills

#### 5.7.4 notificationService.ts
- createNotification(userId, type, data): Create notification
- getNotifications(userId, page, limit): Get all
- markAsRead(notificationId): Mark read
- deleteNotification(notificationId): Delete
- getUnreadCount(userId): Count unread

---

## 6. Database Design & Schema (Detailed)

### 6.1 Entity-Relationship Diagram
```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1:N
     ├─────────────────────┐
     │                     │
     ↓ (invitedBy)         ↓ (invitee)
┌──────────────────────────────┐
│     Invitation               │
│ ┌────────────────────────┐   │
│ │ id (PK)                │   │
│ │ postId (FK)            │   │
│ │ inviterId (FK)         │   │
│ │ inviteeId (FK)         │   │
│ │ status                 │   │
│ │ message                │   │
│ │ createdAt              │   │
│ │ respondedAt            │   │
│ └────────────────────────┘   │
└─────────────┬──────────────┬─┘
              │              │
              ↓ (post)       ↓ (inviter/invitee)
         ┌────────┐    ┌──────────┐
         │ Post   │    │  User    │
         └────────┘    └──────────┘
```

### 6.2 User Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| firstName | String | NOT NULL | First name |
| lastName | String | NOT NULL | Last name |
| email | String | UNIQUE, NOT NULL | Email address |
| passwordHash | String | NOT NULL | Hashed password |
| role | Enum | STUDENT\|FACULTY\|ADMIN | User role |
| department | String | NULLABLE | Department/major |
| profilePicture | String | NULLABLE | Avatar URL |
| bio | String | NULLABLE | User bio |
| skills | String[] | NULLABLE | Skills array |
| createdAt | DateTime | NOT NULL | Registration date |
| updatedAt | DateTime | NOT NULL | Last update |
| deletedAt | DateTime | NULLABLE | Soft delete |

### 6.3 Post Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| title | String | NOT NULL | Project title |
| description | String | NOT NULL | Full description |
| authorId | UUID | FK(User.id) | Project author |
| status | Enum | DRAFT\|PUBLISHED\|CLOSED | Post status |
| skillsRequired | String[] | NULLABLE | Required skills |
| teamSize | Int | NULLABLE | Desired team size |
| deadline | DateTime | NULLABLE | Application deadline |
| category | String | NULLABLE | Project category |
| createdAt | DateTime | NOT NULL | Creation date |
| updatedAt | DateTime | NOT NULL | Last update |
| closedAt | DateTime | NULLABLE | Close date |

### 6.4 Invitation Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| postId | UUID | FK(Post.id) | Related post |
| inviterId | UUID | FK(User.id) | Sender user |
| inviteeId | UUID | FK(User.id) | Recipient user |
| status | Enum | PENDING\|ACCEPTED\|REJECTED\|CANCELLED\|DISCONNECTED | Status |
| message | String | NULLABLE | Custom message |
| createdAt | DateTime | NOT NULL | Sent date |
| respondedAt | DateTime | NULLABLE | Response date |
| updatedAt | DateTime | NOT NULL | Last update |

### 6.5 Application Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| postId | UUID | FK(Post.id) | Applied post |
| userId | UUID | FK(User.id) | Applicant user |
| status | Enum | PENDING\|ACCEPTED\|REJECTED | Status |
| coverLetter | String | NULLABLE | Application message |
| createdAt | DateTime | NOT NULL | Application date |
| respondedAt | DateTime | NULLABLE | Response date |
| updatedAt | DateTime | NOT NULL | Last update |

### 6.6 Notification Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| userId | UUID | FK(User.id) | Recipient user |
| type | Enum | INVITATION\|APPLICATION\|MESSAGE\|SYSTEM | Notification type |
| title | String | NOT NULL | Notification title |
| message | String | NOT NULL | Notification message |
| relatedId | UUID | NULLABLE | Related record ID |
| read | Boolean | NOT NULL | Read status |
| createdAt | DateTime | NOT NULL | Creation date |

### 6.7 Database Relationships
- User 1:N Invitation (as inviter)
- User 1:N Invitation (as invitee)
- User 1:N Post (as author)
- Post 1:N Invitation
- Post 1:N Application
- User 1:N Application
- User 1:N Notification

---

## 7. User Flows & Interactions (Detailed)

### 7.1 Registration Flow
1. User lands on landing page
2. Clicks "Sign Up"
3. Selects role (Student/Faculty)
4. Fills registration form (Step 1: Basic)
5. Fills profile (Step 2: Profile, avatar upload)
6. Sets preferences (Step 3: Skills, department)
7. Reviews info (Step 4: Review)
8. Submits registration
9. Backend validates all inputs
10. Creates user account with hashed password
11. Returns success, redirects to login
12. User logs in with email/password

### 7.2 Login Flow
1. User navigates to login page
2. Enters email and password
3. Clicks login
4. Backend validates credentials
5. If valid: Generates JWT token, returns token + user info
6. Frontend stores token in localStorage/secure storage
7. Redirects to dashboard
8. Subsequent requests include token in Authorization header

### 7.3 Create Post Flow
1. User clicks "Create Post" button
2. Navigates to `/posts/create`
3. Sees multi-step form
4. Step 1: Enters title, description
5. Step 2: Selects required skills
6. Step 3: Sets team size, deadline, category
7. Step 4: Reviews all info
8. Clicks publish
9. Backend validates all required fields
10. Creates post with DRAFT status, changes to PUBLISHED
11. Returns success message
12. Redirects to post details page

### 7.4 Send Invitation Flow
1. User visits post details page (as author)
2. Clicks "Invite Team Member" button
3. Search/select user to invite
4. Optionally adds custom message
5. Clicks "Send Invitation"
6. Frontend calls POST /api/invitations
7. Backend validates:
   - User is post author
   - No duplicate invitation
   - Not inviting self
8. Creates invitation with PENDING status
9. Creates notification for invitee
10. Returns success message
11. Updates sent invitations list

### 7.5 Accept Invitation Flow
1. User visits `/invitations` page
2. Sees "They Invited Me" tab
3. Finds invitation in PENDING status
4. Clicks "Accept" button
5. Sees confirmation
6. Clicks confirm
7. Frontend calls POST /api/invitations/:id/accept
8. Backend validates:
   - Invitation exists
   - User is invitee
   - Status is PENDING
9. Updates status to ACCEPTED
10. Adds user to project team
11. Creates notification for inviter
12. Returns success message
13. Refreshes list, updates UI

### 7.6 Project Close & Auto-Disconnect Flow
1. Project author navigates to post management
2. Clicks "Close Project" button
3. Sees confirmation
4. Confirms closure
5. Frontend calls POST /api/posts/:postId/close
6. Backend:
   - Updates post status to CLOSED
   - Finds all ACCEPTED invitations for this post
   - Sets all statuses to DISCONNECTED
   - Revokes team member access
   - Creates notifications for all affected users
7. Returns success message
8. Redirects to post list

### 7.7 Dashboard Experience
1. User logs in
2. Navigates to `/dashboard`
3. Sees personalized greeting
4. Views quick stats (posts, pending invitations, applications)
5. Sees recent activity feed
6. Can click on activity to navigate to details
7. Can create new post from quick action
8. Can view notifications
9. Can access profile/settings

### 7.8 Browse Posts & Apply
1. User navigates to `/home`
2. Sees feed of posts
3. Can filter by category, skills
4. Clicks on post card
5. Navigates to `/posts/:postId`
6. Sees full details, author, requirements
7. If interested, clicks "Express Interest" or "Apply"
8. Optionally adds cover letter
9. Clicks Submit
10. Backend creates application
11. Author notified of new application
12. Application appears in user's applied list

### 7.9 Accept Application as Author
1. Author navigates to `/posts/:postId/manage`
2. Sees list of applications
3. Reviews applicant profile
4. Clicks "Accept" or "Reject"
5. If accept: Option to send invitation or auto-add
6. Sends invitation to applicant
7. Applicant receives notification
8. Applicant can accept/reject invitation

---

## 8. Business Logic & Rules (Detailed)

### 8.1 Invitation Rules
- Only post author can send invitations
- Cannot send duplicate invitations
- Cannot invite self
- Can only cancel PENDING invitations
- Can only accept/reject PENDING invitations
- Once accepted, invitation becomes connection
- User becomes part of project team
- Only connected users can access team chat/resources

### 8.2 Post Rules
- Posts created by authenticated users
- Author can edit their own posts
- Author can close their own posts
- Closed posts cannot accept new applications
- Closing post auto-disconnects all team members
- Draft posts not visible to others
- Published posts visible in feeds

### 8.3 Application Rules
- Unauthenticated users cannot apply
- User cannot apply to own posts
- Cannot apply twice to same post
- Author can accept/reject applications
- Accepting application may create invitation

### 8.4 Authentication Rules
- All protected endpoints require valid JWT
- JWT expires (default 24 hours)
- Refresh tokens available for renewal
- Role-based access checks enforced
- Only admins can moderate content

### 8.5 Notification Rules
- Notifications created on key actions
- Actions: invitation sent, application received, message sent, etc.
- Users can mark as read
- Users can delete notifications
- Unread count shown in navbar
- Real-time updates preferred

### 8.6 Data Validation Rules
- All emails must be valid format
- All passwords must be 8+ characters
- Required fields cannot be empty
- Skills, department selections from predefined lists
- Post titles 10-200 characters
- Descriptions 50-5000 characters

---

## 9. Error Handling & Validation (Detailed)

### 9.1 Frontend Error Handling
#### Validation Errors
- Show field-level validation on form
- Highlight invalid fields
- Display error message below field
- Disable submit button if form invalid

#### API Errors
- Catch 4xx errors (validation, auth, not found)
- Catch 5xx errors (server errors)
- Display user-friendly error messages
- Log errors for debugging
- Offer retry button for network errors

#### UI States
- Loading spinners during async operations
- Disabled state for buttons during loading
- Empty states when no data
- Error banners for failed operations

### 9.2 Backend Error Handling
#### Error Types
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate entry, invalid state
- **500 Server Error**: Unexpected error

#### Error Response
```
{
  success: false,
  message: "Error description",
  errorCode: "ERROR_CODE",
  timestamp: "2026-02-09T10:30:00Z"
}
```

### 9.3 Validation Rules
#### User Registration
- Email: Valid format, unique
- Password: 8+ chars, mixed case, number, special char
- Name: Non-empty, 2-50 chars
- Role: One of [STUDENT, FACULTY]

#### Post Creation
- Title: 10-200 characters, required
- Description: 50-5000 characters, required
- Skills: Valid from predefined list
- Deadline: Future date if set

#### Invitation
- Post must exist and be PUBLISHED
- Invitee must be valid user
- No duplicate active invitations
- User cannot invite self

---

## 10. Authentication & Authorization (Detailed)

### 10.1 Authentication Flow
1. User logs in with email + password
2. Backend validates credentials against passwordHash
3. If valid: Generate JWT token (payload: userId, role, email)
4. JWT includes expiration (e.g., 24 hours)
5. Return JWT to frontend
6. Frontend stores in localStorage/secure storage
7. All subsequent requests include JWT in Authorization header

### 10.2 JWT Structure
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "...", email: "...", role: "STUDENT", iat: ..., exp: ... }
Signature: HMACSHA256(header + payload, secret)
```

### 10.3 Authorization Levels
- **Public**: No auth required
- **Authenticated**: Any logged-in user
- **Role-based**: Student, Faculty, Admin
- **Owner-based**: Only resource owner

### 10.4 Protected Routes (Middleware)
All protected routes validate:
1. JWT token present in Authorization header
2. Token format valid (Bearer {token})
3. Token signature valid
4. Token not expired
5. User exists and active

### 10.5 Role-Based Access
- **Student**: Can view posts, apply, send invitations, use chat
- **Faculty**: Can create projects, invite students, moderate
- **Admin**: Can delete posts, manage users, system management

---

## 11. Notifications & Alerts (Detailed)

### 11.1 Notification Types
- **Invitation**: When invited to project
- **Application**: When user applies to your project
- **Message**: New message in chatroom
- **System**: Important system announcements

### 11.2 Notification Events
- User sent invitation → Invitee notified
- User accepted invitation → Inviter notified
- User applied to post → Author notified
- Author accepted application → Applicant notified
- Project closed → All team members notified
- New message in chat → All participants notified

### 11.3 In-App Alerts
- **Success**: Green alert with checkmark (auto-dismiss 3s)
- **Error**: Red alert with X (persistent until dismissed)
- **Warning**: Yellow alert (persistent)
- **Info**: Blue alert (auto-dismiss 5s)

### 11.4 Alert Triggers
- Form submission success
- API call failure
- Authentication required
- Permission denied
- Data deleted/updated
- Required field missing

### 11.5 Notification Badge
- Shows unread notification count in navbar
- Updates in real-time
- Clicking opens notifications page

---

## 12. Theme & Styling (Detailed)

### 12.1 Design System
- **Platform**: Material-UI (MUI)
- **Typography**: Roboto font
- **Spacing**: 8px base unit
- **Breakpoints**: xs(0), sm(600), md(960), lg(1280), xl(1920)

### 12.2 Color Palette
- **Primary**: #5B63FF (Blue)
- **Secondary**: #FF6B9D (Pink)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Info**: #3B82F6 (Light Blue)

### 12.3 Theme Files
- **theme.ts**: Global theme configuration
- **tokens.ts**: Design tokens (colors, spacing, shadows)
- **variables.css**: CSS custom properties
- **design-system.css**: Design system styles
- **globals.css**: Global styles
- **innov8mate.css**: Custom styles

### 12.4 Responsive Breakpoints
- **Mobile first**: Design for mobile, enhance for desktop
- **Tablet**: 600px+
- **Desktop**: 960px+
- **Large desktop**: 1280px+

### 12.5 Dark/Light Mode (if available)
- Theme toggle in settings/navbar
- Persists to localStorage
- All components respond to theme

---

## 13. Glossary & Terms

| Term | Definition |
|------|-----------|
| **Invitation** | Request from post author to user to join project team |
| **Connection** | Accepted invitation, active team membership |
| **Post** | Project or opportunity listing |
| **Application** | User expressing interest in post |
| **Team Member** | User connected to project through invitation/application |
| **Chatroom** | Real-time messaging space for team |
| **Forum** | Asynchronous discussion space |
| **Auto-Disconnect** | Automatic removal of team connections when project closes |
| **JWT** | JSON Web Token for authentication |
| **Pagination** | Breaking large datasets into pages (page, limit, total) |
| **Status** | Current state (PENDING, ACCEPTED, REJECTED, etc.) |
| **Role** | User type (STUDENT, FACULTY, ADMIN) |
| **Department** | Academic unit or organization |

---

## 14. Configuration & Setup

### 14.1 Frontend Configuration
- **Environment Variables**:
  - VITE_API_BASE_URL: Backend API URL
  - VITE_JWT_SECRET: Frontend JWT handling (if applicable)

### 14.2 Backend Configuration
- **Environment Variables**:
  - DATABASE_URL: PostgreSQL connection string
  - JWT_SECRET: Secret key for token signing
  - JWT_EXPIRY: Token expiration time (e.g., 24h)
  - PORT: Server port (default 5000)
  - NODE_ENV: Environment (development/production)
  - CORS_ORIGIN: Allowed frontend URLs

### 14.3 Database Setup
- Create PostgreSQL database
- Run Prisma migrations: `prisma migrate dev`
- Seed database with sample data (optional)

### 14.4 Deployment
- Frontend: Build with `npm run build`, deploy to Vercel/Netlify
- Backend: Deploy to Heroku/Railway/AWS, set environment variables

---

## 15. Testing & Quality Assurance

### 15.1 Frontend Testing
- Unit tests for components
- Integration tests for user flows
- E2E tests with Cypress/Playwright
- Test coverage: 80%+

### 15.2 Backend Testing
- Unit tests for services
- Integration tests for API endpoints
- Load testing for scalability
- Test coverage: 80%+

### 15.3 Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] API calls return expected responses
- [ ] Error handling works
- [ ] Responsive design works on mobile/tablet
- [ ] Invitations system complete flow
- [ ] Authentication login/logout works
- [ ] Theme toggle works (if available)
- [ ] Permissions enforced correctly
- [ ] Real-time updates work (chat, notifications)

---

## 16. Future Enhancements & Roadmap

### 16.1 Planned Features
- Video call integration for team meetings
- AI-powered recommendation engine
- Skill endorsement system
- Portfolio showcase
- Advanced analytics/reporting
- Mobile app (React Native)
- Internationalization (i18n)

### 16.2 Performance Optimizations
- Code splitting and lazy loading
- Image optimization and CDN
- Database query optimization
- Caching strategy (Redis)
- API rate limiting

### 16.3 Scalability
- Horizontal scaling for backend
- Load balancing
- Database cluster/replica
- Message queue for notifications
- WebSocket for real-time features

---

## 17. Security Considerations

### 17.1 Frontend Security
- Prevent XSS via input sanitization
- CSRF tokens for form submissions
- Secure token storage
- Content Security Policy (CSP) headers
- HTTPS only

### 17.2 Backend Security
- Input validation and sanitization
- SQL injection prevention (Prisma)
- Bcrypt for password hashing
- Rate limiting on endpoints
- API key management
- Audit logging

### 17.3 Data Privacy
- PII encryption at rest
- Secure password reset flow
- GDPR compliance (data deletion)
- Consent management

---

## 18. Support & Documentation

### 18.1 Code Documentation
- Inline comments for complex logic
- JSDoc comments for functions
- README files in each directory
- Troubleshooting guide

### 18.2 API Documentation
- Swagger/OpenAPI spec (optional)
- Postman collection for endpoints
- Example requests and responses

### 18.3 Developer Resources
- Architecture diagrams
- Database schema diagram
- Component tree diagram
- User flow diagrams

---

## 19. Conclusion
This comprehensive documentation covers every aspect of the United With Landing Page project, from frontend pages to backend services, database design to security considerations. Use this as your single source of truth for understanding, developing, and maintaining the project.

For questions or updates, refer to the project lead or keep this documentation current as the project evolves.

---

**Document Version**: 1.0  
**Last Updated**: February 9, 2026  
**Maintainer**: Development Team  
**Status**: Complete & Ready for Development
