# Backend Implementation Guide for Developers

**Document Version**: 1.0  
**Last Updated**: February 9, 2026  
**Status**: Ready for Implementation  
**Target Completion**: Phase-based (Phases 1-7)  

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema Implementation](#database-schema-implementation)
4. [API Endpoint Specifications](#api-endpoint-specifications)
5. [Service Layer Architecture](#service-layer-architecture)
6. [Authentication & Authorization](#authentication--authorization)
7. [Business Logic Workflows](#business-logic-workflows)
8. [Error Handling Standards](#error-handling-standards)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Code Examples](#code-examples)

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm/yarn
- Git

### Setup Steps

```bash
# 1. Clone and navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure database
# Edit .env with PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/united_db
JWT_SECRET=generate-a-secure-32-char-random-key
JWT_REFRESH_SECRET=generate-another-secure-32-char-key

# 5. Generate Prisma client
npm run prisma:generate

# 6. Run migrations
npm run prisma:migrate dev

# 7. Start development
npm run dev

# Server runs at: http://localhost:5000
```

### Verify Backend is Running

```bash
# Health check endpoint
curl http://localhost:5000/api/v1/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-09T10:30:00.000Z"}
```

---

## Architecture Overview

### Layered Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│              HTTP Request/Response                  │
│           (Express Middleware Stack)                │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              ROUTES LAYER                           │
│  - API endpoint definitions                        │
│  - Request routing                                 │
│  - Middleware application                          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            CONTROLLERS LAYER                        │
│  - Request parsing                                 │
│  - Input validation                                │
│  - Call business logic                             │
│  - Build responses                                 │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            SERVICES LAYER                          │
│  - Business logic                                  │
│  - Data transformation                             │
│  - Complex operations                              │
│  - Orchestration                                   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            REPOSITORY LAYER                        │
│  - Database queries (via Prisma)                  │
│  - Data access                                     │
│  - Query optimization                              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            DATABASE LAYER                          │
│  - PostgreSQL                                      │
│  - Prisma ORM                                      │
│  - Data persistence                                │
└─────────────────────────────────────────────────────┘
```

### Folder Structure to Implement

```
backend/src/
├── index.ts                         # Express server entry point
│
├── config/
│   ├── database.ts                  # Prisma client initialization
│   └── constants.ts                 # App-wide constants
│
├── middleware/
│   ├── auth.ts                      # JWT verification & RBAC
│   ├── errorHandler.ts              # Global error handling
│   ├── validation.ts                # Input validation
│   ├── logging.ts                   # Request/response logging
│   └── cors.ts                      # CORS configuration
│
├── routes/
│   ├── index.ts                     # Route aggregation
│   ├── auth.ts                      # Authentication routes
│   ├── users.ts                     # User profile routes
│   ├── posts.ts                     # Post/opportunity routes
│   ├── applications.ts              # Application routes
│   ├── invitations.ts               # Invitation routes
│   ├── chatrooms.ts                 # Chat routes
│   ├── notifications.ts             # Notification routes
│   └── health.ts                    # Health check routes
│
├── controllers/
│   ├── authController.ts            # Auth logic handlers
│   ├── userController.ts            # User handlers
│   ├── postController.ts            # Post handlers
│   ├── applicationController.ts     # Application handlers
│   ├── invitationController.ts      # Invitation handlers
│   ├── chatroomController.ts        # Chat handlers
│   └── notificationController.ts    # Notification handlers
│
├── services/
│   ├── authService.ts               # Auth business logic
│   ├── userService.ts               # User business logic
│   ├── postService.ts               # Post business logic
│   ├── applicationService.ts        # Application logic
│   ├── invitationService.ts         # Invitation logic
│   ├── chatroomService.ts           # Chat business logic
│   ├── notificationService.ts       # Notification logic
│   └── emailService.ts              # Email sending logic
│
├── repository/
│   ├── userRepository.ts            # User data access
│   ├── postRepository.ts            # Post data access
│   ├── invitationRepository.ts      # Invitation data access
│   ├── applicationRepository.ts     # Application data access
│   ├── chatroomRepository.ts        # Chat data access
│   └── notificationRepository.ts    # Notification data access
│
├── types/
│   ├── index.ts                     # All TypeScript interfaces
│   ├── expresss.d.ts                # Express request augmentation
│   └── environment.d.ts             # Environment type definitions
│
├── utils/
│   ├── jwt.ts                       # JWT token operations
│   ├── passwordHash.ts              # Password hashing utilities
│   ├── validation.ts                # Reusable validators
│   ├── response.ts                  # Standard response helper
│   └── error.ts                     # Error class definitions
│
├── validators/
│   ├── authValidators.ts            # Auth input validators
│   ├── postValidators.ts            # Post input validators
│   ├── invitationValidators.ts      # Invitation validators
│   └── commonValidators.ts          # Reusable validators
│
├── guards/
│   ├── authGuard.ts                 # Authentication guard
│   ├── roleGuard.ts                 # Role-based authorization
│   └── ownerGuard.ts                # Resource ownership guard
│
├── exceptions/
│   ├── AppError.ts                  # Base error class
│   ├── ValidationError.ts           # Validation error class
│   └── AuthenticationError.ts       # Auth error class
│
├── enums/
│   ├── UserRole.ts                  # STUDENT, FACULTY, ADMIN
│   ├── PostStatus.ts                # DRAFT, PUBLISHED, CLOSED
│   ├── InvitationStatus.ts          # Invitation statuses
│   └── ApplicationStatus.ts         # Application statuses
│
└── prisma/
    ├── schema.prisma                # Database schema (ORM models)
    └── migrations/                  # Database migration history
```

---

## Database Schema Implementation

### Prisma Schema (schema.prisma)

```prisma
// Database: PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================================
// USER MODEL
// ============================================================================

model User {
  id            String    @id @default(cuid())
  firstName     String    @db.VarChar(100)
  lastName      String    @db.VarChar(100)
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @db.VarChar(255)
  
  // Profile
  role          UserRole  @default(STUDENT)
  department    String?   @db.VarChar(100)
  bio           String?   @db.Text
  profilePicture String?  @db.VarChar(500)
  skills        String[]  // Array of skill names (JSON)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  
  // Relations
  postsCreated      Post[]
  applicationsSubmitted Application[]
  invitationsSent   Invitation[] @relation("InvitationSent")
  invitationsReceived Invitation[] @relation("InvitationReceived")
  notifications     Notification[]
  chatMessages      ChatMessage[]
  
  @@index([email])
  @@index([role])
  @@index([deletedAt])
}

// ============================================================================
// POST MODEL
// ============================================================================

model Post {
  id                String   @id @default(cuid())
  title             String   @db.VarChar(200)
  description       String   @db.Text
  
  // Author
  authorId          String
  author            User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // Details
  status            PostStatus @default(DRAFT)
  category          String?    @db.VarChar(100)
  skillsRequired    String[]
  teamSize          Int?
  deadline          DateTime?
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  closedAt          DateTime?
  
  // Relations
  applications      Application[]
  invitations       Invitation[]
  chatroom          Chatroom?
  comments          Comment[]
  
  @@index([authorId])
  @@index([status])
  @@index([category])
  @@index([createdAt])
}

// ============================================================================
// APPLICATION MODEL
// ============================================================================

model Application {
  id                String   @id @default(cuid())
  
  // References
  postId            String
  post              Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Details
  status            ApplicationStatus @default(PENDING)
  coverLetter       String?           @db.Text
  
  // Timestamps
  createdAt         DateTime @default(now())
  respondedAt       DateTime?
  updatedAt         DateTime @updatedAt
  
  // Constraints
  @@unique([postId, userId])
  @@index([postId])
  @@index([userId])
  @@index([status])
}

// ============================================================================
// INVITATION MODEL
// ============================================================================

model Invitation {
  id                String   @id @default(cuid())
  
  // References
  postId            String
  post              Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  inviterId         String
  inviter           User     @relation("InvitationSent", fields: [inviterId], references: [id], onDelete: Cascade)
  
  inviteeId         String
  invitee           User     @relation("InvitationReceived", fields: [inviteeId], references: [id], onDelete: Cascade)
  
  // Details
  status            InvitationStatus @default(PENDING)
  message           String?          @db.Text
  
  // Timestamps
  createdAt         DateTime @default(now())
  respondedAt       DateTime?
  updatedAt         DateTime @updatedAt
  
  // Constraints
  @@unique([postId, inviterId, inviteeId])
  @@index([postId])
  @@index([inviterId])
  @@index([inviteeId])
  @@index([status])
}

// ============================================================================
// NOTIFICATION MODEL
// ============================================================================

model Notification {
  id                String   @id @default(cuid())
  
  // Recipient
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Content
  type              NotificationType
  title             String   @db.VarChar(200)
  message           String   @db.Text
  relatedId         String?  // ID of related entity (invitation, application, etc.)
  
  // Status
  read              Boolean  @default(false)
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([userId])
  @@index([type])
  @@index([read])
  @@index([createdAt])
}

// ============================================================================
// CHATROOM MODEL
// ============================================================================

model Chatroom {
  id                String   @id @default(cuid())
  
  // Reference
  postId            String   @unique
  post              Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  // Details
  name              String   @db.VarChar(200)
  description       String?  @db.Text
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  messages          ChatMessage[]
  
  @@index([postId])
}

// ============================================================================
// CHAT MESSAGE MODEL
// ============================================================================

model ChatMessage {
  id                String   @id @default(cuid())
  
  // References
  chatroomId        String
  chatroom          Chatroom @relation(fields: [chatroomId], references: [id], onDelete: Cascade)
  
  userId            String
  sender            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Content
  message           String   @db.Text
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([chatroomId])
  @@index([userId])
}

// ============================================================================
// COMMENT MODEL
// ============================================================================

model Comment {
  id                String   @id @default(cuid())
  
  // Reference
  postId            String
  post              Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  // Content
  content           String   @db.Text
  authorId          String?  // For future user comments
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([postId])
}

// ============================================================================
// ENUM DEFINITIONS
// ============================================================================

enum UserRole {
  STUDENT
  FACULTY
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  CLOSED
  ARCHIVED
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  REJECTED
  CANCELLED
  DISCONNECTED
}

enum NotificationType {
  INVITATION
  APPLICATION
  MESSAGE
  SYSTEM
}
```

### Create Prisma Migrations

```bash
# Generate migration after any schema changes
npm run prisma:migrate dev --name <descriptive-name>

# Later, apply migrations in production
npm run prisma:migrate deploy
```

---

## API Endpoint Specifications

### Base Configuration

```typescript
// All endpoints start with: http://localhost:5000/api/v1
// All endpoints return: { success: boolean, message: string, data?: any, pagination?: {...} }
// Authentication: Include "Authorization: Bearer {JWT_TOKEN}" in headers
```

### 1. Authentication Endpoints

#### POST `/auth/register`

**Purpose**: Create new user account

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@university.edu",
  "password": "SecurePass123!",
  "role": "STUDENT",
  "department": "Computer Science",
  "bio": "Passionate about web development",
  "skills": ["JavaScript", "React", "Node.js"],
  "profilePictureUrl": "https://..."
}
```

**Validation Rules**:
```javascript
{
  firstName: { required: true, minLength: 2, maxLength: 50, pattern: "letters only" },
  lastName: { required: true, minLength: 2, maxLength: 50, pattern: "letters only" },
  email: { required: true, pattern: "valid email", unique: true },
  password: { required: true, minLength: 8, pattern: "1 uppercase, 1 number, 1 special char" },
  role: { required: true, enum: ["STUDENT", "FACULTY"] },
  department: { required: true },
  skills: { required: true, minItems: 1, maxItems: 15 },
  bio: { maxLength: 5000 }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-uuid",
    "email": "john@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Error Cases**:
- 400: Email already exists → `"Email already registered"`
- 400: Invalid input → Validation errors per field
- 400: Weak password → Show password requirements
- 500: Database error → `"Failed to create account"`

---

#### POST `/auth/login`

**Purpose**: Authenticate user and generate JWT

**Request Body**:
```json
{
  "email": "john@university.edu",
  "password": "SecurePass123!"
}
```

**Validation**:
```javascript
{
  email: { required: true, pattern: "valid email" },
  password: { required: true, minLength: 1 }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user-uuid",
    "email": "john@university.edu",
    "firstName": "John",
    "role": "STUDENT",
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

**Error Cases**:
- 404: User not found → `"Invalid email or password"`
- 401: Wrong password → `"Invalid email or password"`
- 500: Server error

---

#### POST `/auth/refresh-token`

**Purpose**: Refresh expired JWT token

**Request Headers**:
```
Authorization: Bearer {refreshToken}
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

**Error Cases**:
- 401: Invalid/expired refresh token
- 401: Refresh token missing

---

#### POST `/auth/logout`

**Purpose**: Logout user and invalidate token

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST `/auth/forgot-password`

**Purpose**: Initiate password reset

**Request Body**:
```json
{
  "email": "john@university.edu"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Backend Logic**:
- Check if email exists
- Generate secure reset token (valid 24 hours)
- Save reset token to database
- Send email with reset link: `{frontend_url}/reset-password?token={token}`

---

#### POST `/auth/reset-password`

**Purpose**: Reset password using token

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Validation**:
```javascript
{
  token: { required: true },
  newPassword: { required: true, minLength: 8, pattern: "complex" },
  confirmPassword: { required: true, must_match: "newPassword" }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Cases**:
- 400: Token invalid/expired → `"Reset link expired"`
- 400: Passwords don't match
- 400: Password too weak
- 404: User not found

---

### 2. User Endpoints

#### GET `/users/:userId`

**Purpose**: Get user profile

**Auth**: Required

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
```
userId: string (UUID)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@university.edu",
    "role": "STUDENT",
    "department": "Computer Science",
    "bio": "Passionate about web dev",
    "profilePicture": "https://...",
    "skills": ["JavaScript", "React", "Node.js"],
    "createdAt": "2026-01-15T10:30:00Z",
    "postsCount": 3,
    "applicationsCount": 5,
    "connectionsCount": 8
  }
}
```

---

#### PUT `/users/:userId`

**Purpose**: Update user profile

**Auth**: Required (Owner only)

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (all optional except at least one):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "department": "Electronics",
  "skills": ["JavaScript", "TypeScript", "Python"],
  "profilePictureUrl": "https://..."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

**Error Cases**:
- 403: Not authorized to edit this user
- 404: User not found
- 400: Invalid input

---

#### GET `/users/search?q={query}`

**Purpose**: Search users by name or email

**Auth**: Required

**Query Parameters**:
```
q: string (min 2 chars) - Search query
skip: number (default: 0) - Pagination
limit: number (default: 10) - Results per page
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@...",
      "department": "CS",
      "role": "STUDENT",
      "profilePicture": "https://..."
    }
  ],
  "pagination": {
    "total": 15,
    "skip": 0,
    "limit": 10,
    "pages": 2
  }
}
```

---

### 3. Post/Opportunity Endpoints

#### GET `/posts`

**Purpose**: Get all posts with filtering & pagination

**Auth**: Optional

**Query Parameters**:
```
page: number (default: 1)
limit: number (default: 10, max: 50)
status: string (DRAFT, PUBLISHED, CLOSED, ALL)
category: string
searchTerm: string (search title/description)
sortBy: string (newest, popular, closing-soon, relevance)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "post-uuid",
      "title": "Mobile App Development",
      "description": "Building a React Native app...",
      "status": "PUBLISHED",
      "category": "Web Development",
      "skillsRequired": ["JavaScript", "React"],
      "teamSize": 5,
      "deadline": "2026-02-24T23:59:59Z",
      "author": {
        "id": "user-uuid",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "FACULTY",
        "profilePicture": "https://..."
      },
      "applicationsCount": 12,
      "teamMembersCount": 3,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

#### POST `/posts`

**Purpose**: Create new post/opportunity

**Auth**: Required

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "AI Research Project",
  "description": "We're looking for students to help with...",
  "category": "RESEARCH",
  "skillsRequired": ["Python", "TensorFlow", "Machine Learning"],
  "teamSize": 4,
  "deadline": "2026-06-30T23:59:59Z"
}
```

**Validation**:
```javascript
{
  title: { required: true, minLength: 10, maxLength: 200 },
  description: { required: true, minLength: 50, maxLength: 5000 },
  category: { required: true, enum: ["RESEARCH", "HACKATHON", ...] },
  skillsRequired: { required: true, minitems: 1, maxItems: 15 },
  teamSize: { required: true, min: 1, max: 50 },
  deadline: { minDate: "tomorrow", maxDate: "6 months from now" }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "new-post-uuid",
    "title": "AI Research Project",
    "status": "PUBLISHED",
    /* ...full post object... */
  }
}
```

**Backend Logic**:
- Verify user is authenticated
- Validate all inputs
- Extract user ID from JWT
- Create Post record with authorId = currentUser.id
- Auto-create associated Chatroom
- Return created post
- Return 201 status

**Error Cases**:
- 401: Not authenticated
- 400: Validation errors
- 500: Database error

---

#### GET `/posts/:postId`

**Purpose**: Get single post with full details

**Auth**: Optional

**Path Parameters**:
```
postId: string (UUID)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "title": "Mobile App Development",
    "description": "Full description...",
    "status": "PUBLISHED",
    "category": "Web Development",
    "skillsRequired": ["JavaScript", "React"],
    "teamSize": 5,
    "deadline": "2026-02-24T23:59:59Z",
    "author": {
      "id": "author-uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@...",
      "department": "Engineering",
      "role": "FACULTY",
      "profilePicture": "https://..."
    },
    "teamMembers": [
      {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "role": "STUDENT"
      }
    ],
    "applications": [
      {
        "id": "app-uuid",
        "userId": "user-uuid",
        "status": "PENDING",
        "createdAt": "2026-01-20T10:30:00Z"
      }
    ],
    "comments": [
      {
        "id": "comment-uuid",
        "content": "Question about requirements...",
        "author": "User Name",
        "createdAt": "2026-01-20T11:00:00Z"
      }
    ],
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Error Cases**:
- 404: Post not found

---

#### PUT `/posts/:postId`

**Purpose**: Update post (author only)

**Auth**: Required (Post author only)

**Request Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "HACKATHON",
  "skillsRequired": ["Python", "JavaScript"],
  "teamSize": 6,
  "deadline": "2026-06-30T23:59:59Z"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": { /* updated post */ }
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Not the post author
- 404: Post not found
- 400: Validation errors

---

#### DELETE `/posts/:postId`

**Purpose**: Delete post (author only)

**Auth**: Required (Post author only)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Backend Logic**:
- Verify post author
- Delete post (cascade: delete related applications, invitations, chatroom, comments)
- Return success

---

#### PATCH `/posts/:postId/close`

**Purpose**: Close project and auto-disconnect team

**Auth**: Required (Post author only)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Project closed successfully",
  "data": {
    "id": "post-uuid",
    "status": "CLOSED",
    "closedAt": "2026-02-09T10:30:00Z"
  }
}
```

**Backend Logic**:
1. Verify post author
2. Verify post exists
3. Update post status to CLOSED
4. Set closedAt = now()
5. Find all invitations with status = ACCEPTED for this post
6. Update all to status = DISCONNECTED
7. Create notifications for all disconnected users:
   ```
   type: SYSTEM
   message: "Project closed. You've been disconnected from {projectName}"
   ```
8. Return success

---

### 4. Invitation Endpoints

#### GET `/invitations/sent`

**Purpose**: Get invitations sent by current user

**Auth**: Required

**Query Parameters**:
```
page: number (default: 1)
limit: number (default: 10)
status: string (ALL, PENDING, ACCEPTED, REJECTED, CANCELLED, DISCONNECTED)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "invitation-uuid",
      "postId": "post-uuid",
      "inviterId": "current-user-id",
      "inviteeId": "other-user-id",
      "invitee": {
        "id": "other-user-id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@...",
        "role": "STUDENT",
        "profilePicture": "https://..."
      },
      "post": {
        "id": "post-uuid",
        "title": "AI Research Project",
        "category": "RESEARCH"
      },
      "status": "PENDING",
      "message": "We'd love to have you on the team!",
      "createdAt": "2026-01-15T10:30:00Z",
      "respondedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

---

#### GET `/invitations/received`

**Purpose**: Get invitations received by current user

**Auth**: Required

**Query Parameters**:
```
page: number (default: 1)
limit: number (default: 10)
status: string (ALL, PENDING, ACCEPTED, REJECTED, CANCELLED)
```

**Response**: Similar to sent invitations but reversed (inviter instead of invitee)

---

#### POST `/invitations`

**Purpose**: Send team invitation

**Auth**: Required (User must be post author)

**Request Body**:
```json
{
  "postId": "post-uuid",
  "inviteeId": "target-user-id",
  "message": "We'd love to have you on our team!"
}
```

**Validation**:
```javascript
{
  postId: { required: true, must_exist: "Post" },
  inviteeId: { required: true, must_exist: "User" },
  message: { maxLength: 1000 }
}
```

**Business Rules**:
- Current user must be post author
- inviteeId must not equal current user ID
- No duplicate invitations for same post+inviter+invitee combination
- Post status must be PUBLISHED or DRAFT

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": "invitation-uuid",
    "postId": "post-uuid",
    "inviterId": "current-user-id",
    "inviteeId": "target-user-id",
    "status": "PENDING",
    "message": "Invitation message...",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Side Effects**:
- Create Notification for invitee
- Type: INVITATION
- Message: "{inviterName} invited you to join {postTitle}"

**Error Cases**:
- 401: Not authenticated
- 403: Not the post author
- 404: Post or user not found
- 400: Duplicate invitation exists
- 400: Cannot invite self

---

#### POST `/invitations/:invitationId/accept`

**Purpose**: Accept invitation and join team

**Auth**: Required (Must be invitee)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Invitation accepted",
  "data": {
    "id": "invitation-uuid",
    "status": "ACCEPTED",
    "respondedAt": "2026-01-16T10:30:00Z"
  }
}
```

**Backend Logic**:
1. Get invitation by ID
2. Verify current user is invitee
3. Verify status is PENDING
4. Update invitation status = ACCEPTED
5. Set respondedAt = now()
6. Create notification for inviter:
   - Type: SYSTEM
   - Message: "{inviteeName} accepted your invitation to {postTitle}"
7. Add user to post team (create TeamMember record or update)
8. Return success

**Error Cases**:
- 401: Not authenticated
- 403: Not the invitee
- 404: Invitation not found
- 400: Invitation not in PENDING status

---

#### POST `/invitations/:invitationId/reject`

**Purpose**: Reject invitation

**Auth**: Required (Must be invitee)

**Request Body** (optional):
```json
{
  "reason": "Already committed to another project"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Invitation rejected",
  "data": {
    "id": "invitation-uuid",
    "status": "REJECTED",
    "respondedAt": "2026-01-16T10:30:00Z"
  }
}
```

**Backend Logic**:
1. Get invitation
2. Verify current user is invitee
3. Verify status is PENDING
4. Update status = REJECTED
5. Set respondedAt = now()
6. Create notification for inviter:
   - Type: SYSTEM
   - Message: "{inviteeName} rejected your invitation"
7. Return success

---

#### POST `/invitations/:invitationId/cancel`

**Purpose**: Cancel pending invitation (sender only)

**Auth**: Required (Must be inviter)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Invitation cancelled",
  "data": {
    "id": "invitation-uuid",
    "status": "CANCELLED"
  }
}
```

**Business Rules**:
- Only PENDING invitations can be cancelled
- Only inviter can cancel
- Invitee receives notification of cancellation

---

#### POST `/invitations/:invitationId/disconnect`

**Purpose**: Remove team connection after acceptance

**Auth**: Required (Either inviter or invitee)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Disconnected from team",
  "data": {
    "id": "invitation-uuid",
    "status": "DISCONNECTED"
  }
}
```

**Backend Logic**:
1. Get invitation
2. Verify status is ACCEPTED
3. Verify user is inviter OR invitee
4. Update status = DISCONNECTED
5. Remove from team
6. Notify other party

---

### 5. Application Endpoints

#### POST `/applications`

**Purpose**: Apply to project/opportunity

**Auth**: Required

**Request Body**:
```json
{
  "postId": "post-uuid",
  "coverLetter": "I'm interested because..."
}
```

**Validation**:
```javascript
{
  postId: { required: true, must_exist: "Post" },
  coverLetter: { maxLength: 2000 }
}
```

**Business Rules**:
- Current user cannot apply to own posts
- One application per user per post
- Post must be PUBLISHED

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Application submitted",
  "data": {
    "id": "application-uuid",
    "postId": "post-uuid",
    "userId": "current-user-id",
    "status": "PENDING",
    "coverLetter": "I'm interested...",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Side Effects**:
- Create notification for post author
- Type: APPLICATION
- Message: "{userName} applied to your post {postTitle}"

---

#### GET `/applications?status=...&page=...`

**Purpose**: Get my applications

**Auth**: Required

**Query Parameters**:
```
page: number
limit: number
status: string (ALL, PENDING, ACCEPTED, REJECTED, WITHDRAWN)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "application-uuid",
      "postId": "post-uuid",
      "post": {
        "id": "post-uuid",
        "title": "Project Name",
        "author": { /* author info */ }
      },
      "status": "PENDING",
      "coverLetter": "My message...",
      "createdAt": "2026-01-15T10:30:00Z",
      "respondedAt": null
    }
  ],
  "pagination": { /* ... */ }
}
```

---

#### GET `/posts/:postId/applications`

**Purpose**: Get applications for my post (author only)

**Auth**: Required (Post author only)

**Query Parameters**:
```
page: number
limit: number
status: string (ALL, PENDING, ACCEPTED, REJECTED)
```

---

#### PUT `/applications/:applicationId`

**Purpose**: Accept or reject application

**Auth**: Required (Post author only)

**Request Body**:
```json
{
  "status": "ACCEPTED",
  "message": "Great! We'd love to have you."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Application updated",
  "data": { /* updated application */ }
}
```

**Backend Logic**:
- If status = ACCEPTED:
  - Create invitation automatically? Or just update application?
  - Notify applicant: "Your application was accepted"
- If status = REJECTED:
  - Notify applicant: "Your application was declined"

---

### 6. Notification Endpoints

#### GET `/notifications`

**Purpose**: Get all notifications

**Auth**: Required

**Query Parameters**:
```
page: number (default: 1)
limit: number (default: 20)
type: string (ALL, INVITATION, APPLICATION, MESSAGE, SYSTEM)
read: boolean (null for all, true for read, false for unread)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid",
      "type": "INVITATION",
      "title": "New Invitation",
      "message": "Jane invited you to join AI Research",
      "relatedId": "invitation-uuid",
      "read": false,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

#### POST `/notifications/:notificationId/read`

**Purpose**: Mark notification as read

**Auth**: Required

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Marked as read",
  "data": { "read": true }
}
```

---

#### DELETE `/notifications/:notificationId`

**Purpose**: Delete notification

**Auth**: Required

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

#### GET `/notifications/unread/count`

**Purpose**: Get unread notification count

**Auth**: Required

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

### 7. Chatroom Endpoints

#### POST `/chatrooms`

**Purpose**: Create chatroom for a post

**Auth**: Required (Post author)

**Request Body**:
```json
{
  "postId": "post-uuid",
  "name": "AI Research Team Chat",
  "description": "Discussion space for the team"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "chatroom-uuid",
    "postId": "post-uuid",
    "name": "AI Research Team Chat",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Note**: Chatrooms are auto-created when posts are created, so this might not be needed

---

#### GET `/chatrooms/:chatroomId/messages`

**Purpose**: Get messages from a chatroom

**Auth**: Required (Team member only)

**Query Parameters**:
```
page: number (default: 1)
limit: number (default: 50)
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "message-uuid",
      "chatroomId": "chatroom-uuid",
      "senderId": "user-uuid",
      "sender": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://..."
      },
      "message": "Great project! When do we start?",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

#### POST `/chatrooms/:chatroomId/messages`

**Purpose**: Send message to chatroom

**Auth**: Required

**Request Body**:
```json
{
  "message": "Great project! When do we start?"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "message-uuid",
    "chatroomId": "chatroom-uuid",
    "senderId": "current-user-id",
    "message": "Great project! When do we start?",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Side Effects**:
- Emit WebSocket event to chatroom subscribers
- Create notifications for team members (optional)

---

## Service Layer Architecture

### Core Service Structure

Each service should follow this pattern:

```typescript
// services/postService.ts

import { Post, Prisma } from "@prisma/client";
import prisma from "@/config/database";
import { AppError } from "@/utils/error";
import { CreatePostDTO, UpdatePostDTO } from "@/types";

export class PostService {
  /**
   * Create new post
   */
  async createPost(userId: string, data: CreatePostDTO): Promise<Post> {
    try {
      // Validate inputs
      if (!data.title || data.title.length < 10) {
        throw new AppError("Title must be at least 10 characters", 400);
      }

      if (!data.description || data.description.length < 50) {
        throw new AppError("Description must be at least 50 characters", 400);
      }

      // Create post
      const post = await prisma.post.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          skillsRequired: data.skillsRequired,
          teamSize: data.teamSize,
          deadline: data.deadline,
          authorId: userId,
          status: "PUBLISHED",
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              profilePicture: true,
            },
          },
        },
      });

      // Auto-create chatroom
      await prisma.chatroom.create({
        data: {
          postId: post.id,
          name: `${post.title} Team Chat`,
          description: `Discussion space for ${post.title}`,
        },
      });

      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to create post", 500);
    }
  }

  /**
   * Get post by ID with all details
   */
  async getPostById(postId: string): Promise<Post> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            department: true,
            profilePicture: true,
          },
        },
        applications: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        invitations: {
          where: { status: "ACCEPTED" },
          include: {
            invitee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    return post;
  }

  /**
   * Update post (author only)
   */
  async updatePost(
    postId: string,
    userId: string,
    data: UpdatePostDTO
  ): Promise<Post> {
    // Get post and verify ownership
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("Not authorized to update this post", 403);
    }

    // Update post
    return await prisma.post.update({
      where: { id: postId },
      data: {
        title: data.title || post.title,
        description: data.description || post.description,
        // ... other fields
      },
    });
  }

  /**
   * Delete post (author only)
   */
  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("Not authorized to delete this post", 403);
    }

    // Delete post (cascade: applications, invitations, chatroom, comments)
    await prisma.post.delete({
      where: { id: postId },
    });
  }

  /**
   * Close post and disconnect all team members
   */
  async closePost(postId: string, userId: string): Promise<Post> {
    // Get post and verify author
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("Not authorized", 403);
    }

    // Update post status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });

    // Get all ACCEPTED invitations
    const acceptedInvitations = await prisma.invitation.findMany({
      where: {
        postId: postId,
        status: "ACCEPTED",
      },
    });

    // Disconnect all invitations
    await Promise.all(
      acceptedInvitations.map(async (invitation) => {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: "DISCONNECTED" },
        });

        // Create notification for disconnected user
        await prisma.notification.create({
          data: {
            userId: invitation.inviteeId,
            type: "SYSTEM",
            title: "Project Closed",
            message: `The project "${post.title}" has been closed. You've been disconnected from the team.`,
            relatedId: postId,
          },
        });
      })
    );

    return updatedPost;
  }

  /**
   * Get posts with pagination and filters
   */
  async getPosts(filters: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    searchTerm?: string;
    sortBy?: string;
  }): Promise<{ posts: Post[]; total: number; pages: number }> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 50);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PostWhereInput = {
      status:
        filters.status && filters.status !== "ALL"
          ? filters.status
          : undefined,
      category: filters.category,
      ...(filters.searchTerm && {
        OR: [
          { title: { contains: filters.searchTerm, mode: "insensitive" } },
          {
            description: {
              contains: filters.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      }),
      deletedAt: null,
    };

    // Get posts
    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profilePicture: true,
          },
        },
      },
      orderBy: this.getSortOrder(filters.sortBy),
    });

    // Get total count
    const total = await prisma.post.count({ where });
    const pages = Math.ceil(total / limit);

    return { posts, total, pages };
  }

  private getSortOrder(sortBy?: string): any {
    switch (sortBy) {
      case "popular":
        return { createdAt: "desc" }; // Could add view count
      case "closing-soon":
        return { deadline: "asc" };
      case "newest":
      default:
        return { createdAt: "desc" };
    }
  }
}

// Export singleton instance
export const postService = new PostService();
```

---

## Authentication & Authorization

### JWT Token Strategy

```typescript
// utils/jwt.ts

import jwt from "jsonwebtoken";
import { AppError } from "./error";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const TOKEN_EXPIRY = "24h";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  iat: number;
  exp: number;
}

export class JWTManager {
  /**
   * Generate access token
   */
  static generateToken(
    userId: string,
    email: string,
    role: string
  ): string {
    return jwt.sign(
      {
        userId,
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      {
        userId,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  }

  /**
   * Verify token and return payload
   */
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }
}
```

### Auth Middleware

```typescript
// middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import { JWTManager, JWTPayload } from "@/utils/jwt";
import { AppError } from "@/utils/error";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header", 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = JWTManager.verifyToken(token);

    // Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = JWTManager.verifyToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Silently fail, proceed without user
    next();
  }
};

/**
 * Role-based authorization
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this action",
      });
    }

    next();
  };
};
```

### Route Setup with Auth

```typescript
// routes/posts.ts

import { Router, Request, Response } from "express";
import { authMiddleware, optionalAuthMiddleware, authorize } from "@/middleware/auth";
import { postController } from "@/controllers/postController";

const router = Router();

// Public routes
router.get("/", optionalAuthMiddleware, (req: Request, res: Response) =>
  postController.getPosts(req, res)
);

router.get("/:postId", optionalAuthMiddleware, (req: Request, res: Response) =>
  postController.getPost(req, res)
);

// Protected routes (authentication required)
router.post(
  "/",
  authMiddleware,
  authorize("FACULTY", "ADMIN"),
  (req: Request, res: Response) => postController.createPost(req, res)
);

router.put(
  "/:postId",
  authMiddleware,
  (req: Request, res: Response) => postController.updatePost(req, res)
);

router.delete(
  "/:postId",
  authMiddleware,
  (req: Request, res: Response) => postController.deletePost(req, res)
);

router.patch(
  "/:postId/close",
  authMiddleware,
  (req: Request, res: Response) => postController.closePost(req, res)
);

export default router;
```

---

## Business Logic Workflows

### Invitation Workflow Implementation

```typescript
// services/invitationService.ts

import prisma from "@/config/database";
import { AppError } from "@/utils/error";
import { SendInvitationDTO } from "@/types";

export class InvitationService {
  /**
   * Send invitation
   */
  async sendInvitation(
    inviterId: string,
    data: SendInvitationDTO
  ): Promise<any> {
    const { postId, inviteeId, message } = data;

    // Validate post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Verify inviter is post author
    if (post.authorId !== inviterId) {
      throw new AppError("Only post author can send invitations", 403);
    }

    // Validate invitee exists
    const invitee = await prisma.user.findUnique({
      where: { id: inviteeId },
    });

    if (!invitee) {
      throw new AppError("User not found", 404);
    }

    // Check no self-invitation
    if (inviterId === inviteeId) {
      throw new AppError("Cannot invite yourself", 400);
    }

    // Check no duplicate
    const existing = await prisma.invitation.findUnique({
      where: {
        postId_inviterId_inviteeId: {
          postId,
          inviterId,
          inviteeId,
        },
      },
    });

    if (existing && existing.status === "PENDING") {
      throw new AppError("Invitation already sent to this user", 400);
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        postId,
        inviterId,
        inviteeId,
        message,
        status: "PENDING",
      },
      include: {
        inviter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: inviteeId,
        type: "INVITATION",
        title: "New Invitation",
        message: `${invitation.inviter.firstName} ${invitation.inviter.lastName} invited you to join "${invitation.post.title}"`,
        relatedId: invitation.id,
      },
    });

    return invitation;
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(
    invitationId: string,
    userId: string
  ): Promise<any> {
    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
        inviter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new AppError("Invitation not found", 404);
    }

    // Verify user is invitee
    if (invitation.inviteeId !== userId) {
      throw new AppError("Not authorized", 403);
    }

    // Verify status is PENDING
    if (invitation.status !== "PENDING") {
      throw new AppError("Invitation is not pending", 400);
    }

    // Update invitation
    const updated = await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        status: "ACCEPTED",
        respondedAt: new Date(),
      },
    });

    // Create notification for inviter
    await prisma.notification.create({
      data: {
        userId: invitation.post.authorId,
        type: "SYSTEM",
        title: "Invitation Accepted",
        message: `Your invitation to "${invitation.post.title}" was accepted`,
        relatedId: invitationId,
      },
    });

    return updated;
  }

  /**
   * Get sent invitations with pagination and filtering
   */
  async getSentInvitations(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ data: any; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const where: any = {
      inviterId: userId,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip,
        take: limit,
        include: {
          invitee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              profilePicture: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.invitation.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    return { data: invitations, total, pages };
  }

  /**
   * Get received invitations with pagination and filtering
   */
  async getReceivedInvitations(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ data: any; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const where: any = {
      inviteeId: userId,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip,
        take: limit,
        include: {
          inviter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              profilePicture: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.invitation.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    return { data: invitations, total, pages };
  }
}

export const invitationService = new InvitationService();
```

---

## Error Handling Standards

### Custom Error Class

```typescript
// utils/error.ts

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Not authorized") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}
```

### Global Error Handler Middleware

```typescript
// middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/error";
import logger from "@/utils/logger";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError instances
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: (error as any).errors,
    });
  }

  // Handle Prisma errors
  if ((error as any).code === "P2002") {
    const field = (error as any).meta?.target?.[0] || "field";
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  });
};
```

---

## Implementation Roadmap

### Phase 1: Core Setup ✅ (Currently ~50%)

**Status**: In Progress

**Tasks**:
- [x] Express server initialization
- [x] Middleware setup (CORS, helmet, logging)
- [x] Prisma/PostgreSQL integration
- [x] Basic Post endpoints (GET list, GET single, POST create)
- [ ] Input validation framework
- [ ] Error handling middleware
- [ ] Rate limiting

**Deliverables**:
- Working Express server
- Connected PostgreSQL database
- Basic post CRUD operations
- Functional endpoints

---

### Phase 2: Authentication

**Estimated Duration**: 3-5 days

**Tasks**:
- [ ] User registration endpoint
- [ ] Login endpoint with JWT
- [ ] Token refresh endpoint
- [ ] Email verification (optional for MVP)
- [ ] Password reset flow
- [ ] Auth middleware integration
- [ ] Password hashing with bcryptjs

**Endpoints to Implement**:
- POST /auth/register
- POST /auth/login
- POST /auth/refresh-token
- POST /auth/forgot-password
- POST /auth/reset-password

**Testing**:
- Unit tests for auth service
- Integration tests for endpoints
- JWT token validation tests

---

### Phase 3: User Management

**Estimated Duration**: 2-3 days

**Tasks**:
- [ ] User profile endpoints (GET, PUT)
- [ ] User search endpoint
- [ ] User skills management
- [ ] Profile picture upload
- [ ] User deletion (soft delete)

**Endpoints**:
- GET /users/:userId
- PUT /users/:userId
- GET /users/search
- DELETE /users/:userId

---

### Phase 4: Applications & Invitations

**Estimated Duration**: 4-5 days

**Tasks**:
- [ ] Application submission endpoint
- [ ] Get user's applications
- [ ] Get post applications (author only)
- [ ] Accept/reject applications
- [ ] Invitation sending
- [ ] Get sent/received invitations
- [ ] Accept/reject/cancel invitations
- [ ] Auto-disconnect on project close

**Endpoints**: (16 total)
- POST /applications
- GET /applications
- GET /posts/:postId/applications
- PUT /applications/:id
- POST /invitations
- GET /invitations/sent
- GET /invitations/received
- POST /invitations/:id/accept
- POST /invitations/:id/reject
- POST /invitations/:id/cancel
- POST /invitations/:id/disconnect

---

### Phase 5: Real-time Chat

**Estimated Duration**: 4-5 days

**Tasks**:
- [ ] WebSocket integration (Socket.io)
- [ ] Chatroom creation
- [ ] Message persistence
- [ ] Real-time message broadcasting
- [ ] Typing indicators
- [ ] Online status tracking
- [ ] Message history retrieval

**Features**:
- Real-time messaging
- Team chat per project
- Message persistence in database

---

### Phase 6: Notifications & Enhancements

**Estimated Duration**: 3-4 days

**Tasks**:
- [ ] Notification system
- [ ] Email notifications (nodemailer)
- [ ] Forum/discussion endpoints
- [ ] Comment system on posts
- [ ] Advanced search
- [ ] Recommendation engine (optional)

---

### Phase 7: Testing & Deployment

**Estimated Duration**: 4-5 days

**Tasks**:
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## Code Examples

### Example: Complete Auth Controller

```typescript
// controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import { authService } from "@/services/authService";
import { AppError } from "@/utils/error";

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password, role, skills, department } =
        req.body;

      // Validate inputs
      if (!email || !password || !firstName || !lastName) {
        throw new AppError("Missing required fields", 400);
      }

      // Create user
      const result = await authService.register({
        firstName,
        lastName,
        email,
        password,
        role: role || "STUDENT",
        skills: skills || [],
        department,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          role: result.user.role,
          token: result.token,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError("Email and password required", 400);
      }

      const result = await authService.login(email, password);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          role: result.user.role,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: 86400, // 24 hours
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError("Refresh token required", 400);
      }

      const newToken = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: "Token refreshed",
        data: {
          token: newToken,
          expiresIn: 86400,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
```

### Example: Complete Post Controller

```typescript
// controllers/postController.ts

import { Request, Response, NextFunction } from "express";
import { postService } from "@/services/postService";
import { AppError } from "@/utils/error";

export class PostController {
  /**
   * Create post
   */
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const { title, description, category, skillsRequired, teamSize, deadline } =
        req.body;

      const post = await postService.createPost(req.user.userId, {
        title,
        description,
        category,
        skillsRequired,
        teamSize,
        deadline,
      });

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all posts
   */
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, category, searchTerm, sortBy } =
        req.query;

      const result = await postService.getPosts({
        page: Number(page),
        limit: Math.min(Number(limit), 50),
        status: status ? String(status) : undefined,
        category: category ? String(category) : undefined,
        searchTerm: searchTerm ? String(searchTerm) : undefined,
        sortBy: sortBy ? String(sortBy) : "newest",
      });

      res.json({
        success: true,
        data: result.posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single post
   */
  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;

      const post = await postService.getPostById(postId);

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update post
   */
  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const { postId } = req.params;
      const updates = req.body;

      const post = await postService.updatePost(postId, req.user.userId, updates);

      res.json({
        success: true,
        message: "Post updated successfully",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete post
   */
  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const { postId } = req.params;

      await postService.deletePost(postId, req.user.userId);

      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Close post
   */
  async closePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const { postId } = req.params;

      const post = await postService.closePost(postId, req.user.userId);

      res.json({
        success: true,
        message: "Project closed successfully",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
```

---

## Getting Help & Resources

### Key Files to Review
- [COMPLETE_PROJECT_DOCUMENTATION.md](./COMPLETE_PROJECT_DOCUMENTATION.md) - Full project specification
- [FRONTEND_SRS_COMPREHENSIVE.md](./FRONTEND_SRS_COMPREHENSIVE.md) - Frontend requirements
- [DATABASE_WORKFLOWS_FRONTEND_SRS.md](./DATABASE_WORKFLOWS_FRONTEND_SRS.md) - Database design details
- [backend/README.md](./backend/README.md) - Current backend status

### Common Development Tasks

#### Task: Add a New Endpoint

1. **Create Controller Method**
   - In `controllers/[feature]Controller.ts`
   - Handle request validation
   - Call service layer
   - Format and send response

2. **Create Service Method**
   - In `services/[feature]Service.ts`
   - Implement business logic
   - Handle Prisma queries
   - Throw AppError for failures

3. **Add Route**
   - In `routes/[feature].ts`
   - Add HTTP method and path
   - Add auth middleware if needed
   - Map to controller method

4. **Test Locally**
   ```bash
   curl -X POST http://localhost:5000/api/v1/posts \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"title":"...", "description":"..."}'
   ```

#### Task: Fix a Database Issue

1. Examine error message
2. Review schema in `prisma/schema.prisma`
3. Check relationships and constraints
4. Create migration: `npm run prisma:migrate dev --name fix_[issue]`
5. Test with Prisma Studio: `npm run prisma:studio`
6. Verify with API test

---

## Next Steps

1. **Complete Phase 1**: Finish input validation and error handling
2. **Begin Phase 2**: Implement authentication endpoints
3. **Set up testing**: Create test suite for core endpoints
4. **Document APIs**: Generate Swagger/OpenAPI documentation
5. **Performance**: Add caching, optimize queries

---

**Document Version**: 1.0  
**Last Updated**: February 9, 2026  
**Status**: Ready for Implementation  
**Maintainer**: Development Team
