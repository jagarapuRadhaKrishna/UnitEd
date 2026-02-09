# Database Design, Workflows & Frontend SRS

## Table of Contents
1. Database Design & Schema
2. Database Workflows & Processes
3. Frontend Architecture & Components
4. Page-by-Page Feature Specifications
5. Component Specifications
6. Data Flows & Integration

---

## 1. Database Design & Schema

### 1.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │    User      │
                    │──────────────│
                    │ id (PK)      │
                    │ firstName    │
                    │ lastName     │
                    │ email        │
                    │ passwordHash │
                    │ role         │
                    │ department   │
                    │ profilePic   │
                    │ bio          │
                    │ skills[]     │
                    │ createdAt    │
                    │ updatedAt    │
                    │ deletedAt    │
                    └────────┬─────┘
                             │
                    ╔════════╩════════╗
                    ║                 ║
                    ║ 1:N             ║ 1:N
                    ║                 ║
        ┌───────────▼─────────┐      ┌──────────────┐
        │      Post           │      │  Invitation  │
        │─────────────────────│      │──────────────│
        │ id (PK)             │◄─────│ id (PK)      │
        │ title               │      │ postId (FK)  │
        │ description         │      │ inviterId    │
        │ authorId (FK)──┐    │      │ inviteeId    │
        │ status          │    │      │ status       │
        │ skillsRequired  │    │      │ message      │
        │ teamSize        │    └──────│ createdAt    │
        │ deadline        │           │ respondedAt  │
        │ category        │           │ updatedAt    │
        │ createdAt       │           └──────┬───────┘
        │ updatedAt       │                  │
        │ closedAt        │                  │ (inviter/invitee)
        └────────┬────────┘                  │
                 │ 1:N (applications)        │
                 │                           │
        ┌────────▼────────┐     ┌────────────▼────────┐
        │  Application    │     │   (Foreign Key)     │
        │────────────────│     │   User.id           │
        │ id (PK)        │     │                     │
        │ postId (FK)    │     └─────────────────────┘
        │ userId (FK)    │
        │ status         │
        │ coverLetter    │
        │ createdAt      │
        │ respondedAt    │
        │ updatedAt      │
        └────────────────┘

        ┌──────────────────┐      ┌──────────────────┐
        │  Notification    │      │   Chatroom       │
        │──────────────────│      │──────────────────│
        │ id (PK)          │      │ id (PK)          │
        │ userId (FK)      │      │ postId (FK)      │
        │ type             │      │ name             │
        │ title            │      │ description      │
        │ message          │      │ createdAt        │
        │ relatedId        │      │ updatedAt        │
        │ read             │      └────────┬─────────┘
        │ createdAt        │               │ 1:N
        └──────────────────┘               │
                                 ┌────────▼─────────┐
                                 │  ChatMessage     │
                                 │──────────────────│
                                 │ id (PK)          │
                                 │ chatroomId (FK)  │
                                 │ userId (FK)      │
                                 │ message          │
                                 │ createdAt        │
                                 │ updatedAt        │
                                 └──────────────────┘
```

### 1.2 Detailed Table Specifications

#### 1.2.1 User Table
```
Table: User
Purpose: Store all user information

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ firstName: VARCHAR(100) (NOT NULL)
│  └─ User's first name, max 100 chars
├─ lastName: VARCHAR(100) (NOT NULL)
│  └─ User's last name, max 100 chars
├─ email: VARCHAR(255) (UNIQUE, NOT NULL, INDEXED)
│  └─ Email address, must be unique, max 255 chars
├─ passwordHash: VARCHAR(255) (NOT NULL)
│  └─ Bcrypted password hash
├─ role: ENUM (NOT NULL, DEFAULT: STUDENT)
│  └─ Values: STUDENT | FACULTY | ADMIN
├─ department: VARCHAR(100) (NULLABLE)
│  └─ Academic department or major
├─ profilePicture: VARCHAR(500) (NULLABLE)
│  └─ URL to profile avatar image
├─ bio: TEXT (NULLABLE)
│  └─ User bio/description, max 5000 chars
├─ skills: TEXT[] (NULLABLE)
│  └─ Array of skill names (serialized JSON)
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
│  └─ Account creation timestamp
├─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
│  └─ Last profile update timestamp
└─ deletedAt: TIMESTAMP (NULLABLE)
   └─ Soft delete timestamp (NULL if active)

Indexes:
├─ PRIMARY KEY (id)
├─ UNIQUE (email)
└─ INDEX (role)

Relationships:
├─ 1:N → Post (as author, authorId)
├─ 1:N → Invitation (as inviter, inviterId)
├─ 1:N → Invitation (as invitee, inviteeId)
├─ 1:N → Application (as applicant, userId)
└─ 1:N → Notification (userId)
```

#### 1.2.2 Post Table
```
Table: Post
Purpose: Store project/opportunity listings

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ title: VARCHAR(200) (NOT NULL, INDEXED)
│  └─ Project title, 10-200 chars
├─ description: TEXT (NOT NULL)
│  └─ Full project description, 50-5000 chars
├─ authorId: UUID (NOT NULL, FOREIGN KEY → User.id)
│  └─ Reference to post creator
├─ status: ENUM (NOT NULL, DEFAULT: DRAFT, INDEXED)
│  └─ Values: DRAFT | PUBLISHED | CLOSED | ARCHIVED
├─ skillsRequired: TEXT[] (NULLABLE)
│  └─ Array of required skill names (JSON)
├─ teamSize: INTEGER (NULLABLE)
│  └─ Desired team size, positive integer
├─ deadline: TIMESTAMP (NULLABLE)
│  └─ Application deadline
├─ category: VARCHAR(100) (NULLABLE, INDEXED)
│  └─ Project category (web, mobile, data, etc.)
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW(), INDEXED)
│  └─ Post creation date
├─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
│  └─ Last modification date
└─ closedAt: TIMESTAMP (NULLABLE)
   └─ When project was closed

Indexes:
├─ PRIMARY KEY (id)
├─ INDEX (authorId)
├─ INDEX (status)
├─ INDEX (category)
└─ INDEX (createdAt)

Relationships:
├─ N:1 ← User (authorId)
├─ 1:N → Invitation (postId)
├─ 1:N → Application (postId)
└─ 1:N → Chatroom (postId)
```

#### 1.2.3 Invitation Table
```
Table: Invitation
Purpose: LinkedIn-style team invitations

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ postId: UUID (NOT NULL, FOREIGN KEY → Post.id, INDEXED)
│  └─ Reference to project/post
├─ inviterId: UUID (NOT NULL, FOREIGN KEY → User.id, INDEXED)
│  └─ User sending the invitation
├─ inviteeId: UUID (NOT NULL, FOREIGN KEY → User.id, INDEXED)
│  └─ User receiving the invitation
├─ status: ENUM (NOT NULL, DEFAULT: PENDING, INDEXED)
│  └─ Values: PENDING | ACCEPTED | REJECTED | CANCELLED | DISCONNECTED
├─ message: TEXT (NULLABLE)
│  └─ Custom invitation message, max 1000 chars
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW(), INDEXED)
│  └─ When invitation was sent
├─ respondedAt: TIMESTAMP (NULLABLE)
│  └─ When invitation was responded to
└─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
   └─ Last update timestamp

Constraints:
├─ UNIQUE (postId, inviterId, inviteeId)
│  └─ Prevent duplicate invitations
└─ CHECK (inviterId != inviteeId)
   └─ Prevent self-invitations

Indexes:
├─ PRIMARY KEY (id)
├─ INDEX (postId)
├─ INDEX (inviterId)
├─ INDEX (inviteeId)
├─ INDEX (status)
└─ COMPOSITE INDEX (inviteeId, status)

Relationships:
├─ N:1 ← Post (postId)
├─ N:1 ← User (inviterId)
└─ N:1 ← User (inviteeId)
```

#### 1.2.4 Application Table
```
Table: Application
Purpose: Store user applications to projects

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ postId: UUID (NOT NULL, FOREIGN KEY → Post.id, INDEXED)
│  └─ Reference to project
├─ userId: UUID (NOT NULL, FOREIGN KEY → User.id, INDEXED)
│  └─ Applicant user
├─ status: ENUM (NOT NULL, DEFAULT: PENDING, INDEXED)
│  └─ Values: PENDING | ACCEPTED | REJECTED | WITHDRAWN
├─ coverLetter: TEXT (NULLABLE)
│  └─ Application message, max 2000 chars
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW(), INDEXED)
│  └─ Application submission date
├─ respondedAt: TIMESTAMP (NULLABLE)
│  └─ When author responded
└─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
   └─ Last update timestamp

Constraints:
├─ UNIQUE (postId, userId)
│  └─ One application per user per post
└─ CHECK (userId != postAuthorId)
   └─ User cannot apply to own posts

Indexes:
├─ PRIMARY KEY (id)
├─ INDEX (postId)
├─ INDEX (userId)
├─ INDEX (status)
└─ COMPOSITE INDEX (postId, status)

Relationships:
├─ N:1 ← Post (postId)
└─ N:1 ← User (userId)
```

#### 1.2.5 Notification Table
```
Table: Notification
Purpose: Store user notifications

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ userId: UUID (NOT NULL, FOREIGN KEY → User.id, INDEXED)
│  └─ Notification recipient
├─ type: ENUM (NOT NULL, INDEXED)
│  └─ Values: INVITATION | APPLICATION | MESSAGE | SYSTEM
├─ title: VARCHAR(200) (NOT NULL)
│  └─ Notification title
├─ message: TEXT (NOT NULL)
│  └─ Notification content
├─ relatedId: UUID (NULLABLE)
│  └─ ID of related entity (invitation, application, etc.)
├─ read: BOOLEAN (NOT NULL, DEFAULT: false)
│  └─ Whether user has read it
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW(), INDEXED)
│  └─ Creation timestamp
└─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
   └─ Last update timestamp

Indexes:
├─ PRIMARY KEY (id)
├─ INDEX (userId)
├─ INDEX (type)
├─ INDEX (read)
└─ COMPOSITE INDEX (userId, read, createdAt)

Relationships:
└─ N:1 ← User (userId)
```

#### 1.2.6 Chatroom Table
```
Table: Chatroom
Purpose: Store team chatroom information

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ postId: UUID (NOT NULL, FOREIGN KEY → Post.id, UNIQUE)
│  └─ Associated project
├─ name: VARCHAR(200) (NOT NULL)
│  └─ Chatroom name/title
├─ description: TEXT (NULLABLE)
│  └─ Chatroom description
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
│  └─ Creation timestamp
└─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
   └─ Last update timestamp

Indexes:
├─ PRIMARY KEY (id)
├─ UNIQUE (postId)
└─ INDEX (createdAt)

Relationships:
├─ N:1 ← Post (postId)
└─ 1:N → ChatMessage (chatroomId)
```

#### 1.2.7 ChatMessage Table
```
Table: ChatMessage
Purpose: Store messages in chatrooms

Columns:
├─ id: UUID (PRIMARY KEY)
│  └─ Auto-generated, unique identifier
├─ chatroomId: UUID (NOT NULL, FOREIGN KEY → Chatroom.id, INDEXED)
│  └─ Reference to chatroom
├─ userId: UUID (NOT NULL, FOREIGN KEY → User.id, INDEXED)
│  └─ Message sender
├─ message: TEXT (NOT NULL)
│  └─ Message content
├─ createdAt: TIMESTAMP (NOT NULL, DEFAULT: NOW(), INDEXED)
│  └─ Message timestamp
└─ updatedAt: TIMESTAMP (NOT NULL, DEFAULT: NOW())
   └─ Last edit timestamp

Indexes:
├─ PRIMARY KEY (id)
├─ INDEX (chatroomId)
├─ INDEX (userId)
└─ COMPOSITE INDEX (chatroomId, createdAt)

Relationships:
├─ N:1 ← Chatroom (chatroomId)
└─ N:1 ← User (userId)
```

### 1.3 Relationship Diagrams

#### 1.3.1 User to Invitations & Posts
```
User (Student/Faculty)
│
├─ Creates Posts (1:N)
│  ├─ Post 1
│  ├─ Post 2
│  └─ Post 3
│
├─ Sends Invitations (1:N)
│  ├─ Invitation to User X
│  ├─ Invitation to User Y
│  └─ Invitation to User Z
│
├─ Receives Invitations (1:N)
│  ├─ From User A
│  ├─ From User B
│  └─ From User C
│
├─ Submits Applications (1:N)
│  ├─ To Post A
│  ├─ To Post B
│  └─ To Post C
│
├─ Creates Notifications (1:N)
│  ├─ On invitation sent
│  ├─ On application received
│  └─ On message received
│
└─ Sends Messages (1:N)
   ├─ In Chatroom 1
   ├─ In Chatroom 2
   └─ In Chatroom 3
```

#### 1.3.2 Post to Related Entities
```
Post (Project)
│
├─ Has Author (N:1 User)
│
├─ Has Invitations (1:N)
│  ├─ PENDING (users not yet responded)
│  ├─ ACCEPTED (team members)
│  ├─ REJECTED (declined)
│  ├─ CANCELLED (author cancelled)
│  └─ DISCONNECTED (after project closes)
│
├─ Has Applications (1:N)
│  ├─ PENDING (awaiting review)
│  ├─ ACCEPTED (join team)
│  └─ REJECTED (not selected)
│
├─ Has Chatroom (1:1)
│  └─ With Messages (1:N)
│
└─ Has Lifecycle
   ├─ DRAFT → Not visible
   ├─ PUBLISHED → Visible to all
   └─ CLOSED → Auto-disconnect all
```

---

## 2. Database Workflows & Processes

### 2.1 User Registration Workflow

```
Start
  │
  ├─ User clicks "Sign Up"
  │
  ├─ Select Role (Student/Faculty)
  │
  ├─ Form Step 1: Basic Info
  │  ├─ Input: firstName, lastName, email, password
  │  ├─ Validation:
  │  │  ├─ firstName & lastName: 2-50 chars, non-empty
  │  │  ├─ email: valid format, unique check
  │  │  └─ password: 8+ chars, mixed case, number, special
  │  └─ Save temp data
  │
  ├─ Form Step 2: Profile
  │  ├─ Input: bio, avatar upload, skills
  │  ├─ Validation: bio ≤ 5000 chars
  │  └─ Save temp data
  │
  ├─ Form Step 3: Preferences
  │  ├─ Input: department, interests
  │  └─ Save temp data
  │
  ├─ Form Step 4: Review
  │  ├─ Display all entered data
  │  ├─ User confirms
  │  └─ If reject, go back to edit
  │
  ├─ Submit to Backend
  │  ├─ Validate all fields again
  │  ├─ Check email unique
  │  ├─ Hash password with bcrypt
  │  ├─ Generate UUID for user
  │  ├─ INSERT into User table
  │  └─ Return success
  │
  ├─ Frontend: Show success message
  │
  └─ Redirect to login page
  
End
```

### 2.2 Login & Authentication Workflow

```
Start
  │
  ├─ User enters email & password
  │
  ├─ Validate input:
  │  ├─ Email not empty
  │  ├─ Password not empty
  │  └─ Email in valid format
  │
  ├─ Query User table
  │  ├─ SELECT * FROM User WHERE email = input_email
  │  ├─ If not found: Return "User not found"
  │  └─ If found: Continue
  │
  ├─ Compare password with passwordHash
  │  ├─ bcrypt.compare(input_password, user.passwordHash)
  │  ├─ If match: Continue
  │  └─ If no match: Return "Invalid password"
  │
  ├─ Generate JWT Token
  │  ├─ Payload: { userId, email, role, iat, exp }
  │  ├─ Sign with JWT_SECRET
  │  └─ Expiry: 24 hours
  │
  ├─ Send response:
  │  ├─ JWT token
  │  ├─ User object
  │  └─ Success message
  │
  ├─ Frontend: Store JWT
  │  ├─ localStorage.setItem('token', jwt)
  │  └─ Set Authorization header
  │
  ├─ Redirect to /dashboard
  │
  └─ User authenticated
  
End
```

### 2.3 Create Post Workflow

```
Start
  │
  ├─ User authenticated? Check JWT
  │
  ├─ User clicks "Create Post"
  │
  ├─ Multi-step form:
  │  
  │  Step 1: Basic Details
  │  ├─ Input: title (10-200 chars), description (50-5000 chars)
  │  ├─ Validation: All required
  │  └─ Save to state
  │
  │  Step 2: Requirements
  │  ├─ Input: skillsRequired[], teamSize, category
  │  ├─ Validation: Skills from predefined list
  │  └─ Save to state
  │
  │  Step 3: Timeline
  │  ├─ Input: deadline (future date)
  │  ├─ Validation: Deadline > now
  │  └─ Save to state
  │
  │  Step 4: Review
  │  ├─ Display all info
  │  ├─ User confirms
  │  └─ If OK, continue; else edit
  │
  ├─ Submit to Backend
  │  ├─ POST /api/posts
  │  ├─ Body: { title, description, skillsRequired, teamSize, deadline, category }
  │  ├─ Headers: Authorization: Bearer {token}
  │
  ├─ Backend Processing
  │  ├─ Verify JWT, extract userId
  │  ├─ Validate all fields
  │  ├─ authorId = userId
  │  ├─ status = PUBLISHED (or DRAFT)
  │  ├─ Generate UUID
  │  ├─ INSERT into Post table
  │  ├─ INSERT into Chatroom table (auto-create)
  │  └─ Return published post
  │
  ├─ Frontend: Show success
  │
  └─ Redirect to /posts/{postId}
  
End
```

### 2.4 Send Invitation Workflow

```
Start
  │
  ├─ User authenticated & is post author
  │
  ├─ User clicks "Invite Member"
  │
  ├─ Modal/Form appears:
  │  ├─ Search/select user to invite
  │  ├─ Optional: Custom message (≤1000 chars)
  │  └─ Click "Send Invitation"
  │
  ├─ Frontend Validation:
  │  ├─ Invitee selected
  │  ├─ Invitee != author (current user)
  │  └─ Call API
  │
  ├─ Backend: POST /api/invitations
  │  ├─ Body: { postId, inviteeId, message }
  │  ├─ Headers: Authorization: Bearer {token}
  │
  ├─ Backend Processing:
  │  ├─ Extract userId from JWT (inviterId)
  │  ├─ Verify post exists
  │  ├─ Verify userId is post author
  │  ├─ Verify inviteeId exists
  │  ├─ Check no duplicate:
  │  │  └─ SELECT * WHERE postId AND inviterId AND inviteeId
  │  ├─ Verify inviterId != inviteeId
  │  ├─ INSERT into Invitation table
  │  │  ├─ postId: {postId}
  │  │  ├─ inviterId: {userId}
  │  │  ├─ inviteeId: {inviteeId}
  │  │  ├─ status: PENDING
  │  │  ├─ createdAt: NOW()
  │  │  └─ Generate UUID
  │  │
  │  ├─ CREATE Notification
  │  │  ├─ userId: inviteeId
  │  │  ├─ type: INVITATION
  │  │  ├─ message: "You've been invited to {post.title}"
  │  │  └─ relatedId: invitationId
  │  │
  │  └─ Return success
  │
  ├─ Frontend: Show success message
  │
  ├─ Update Sent Invitations list
  │
  └─ Invitee gets notification
  
End
```

### 2.5 Accept Invitation Workflow

```
Start
  │
  ├─ Invitee navigates to /invitations
  │
  ├─ Sees "They Invited Me" tab
  │
  ├─ Finds invitation with status = PENDING
  │
  ├─ Clicks "Accept" button
  │
  ├─ Show confirmation
  │
  ├─ User confirms
  │
  ├─ Frontend: POST /api/invitations/{id}/accept
  │  ├─ Headers: Authorization: Bearer {token}
  │
  ├─ Backend Processing:
  │  ├─ Extract userId from JWT
  │  ├─ SELECT * FROM Invitation WHERE id = {id}
  │  ├─ Verify userId = invitation.inviteeId
  │  ├─ Verify invitation.status = PENDING
  │  ├─ UPDATE Invitation SET
  │  │  ├─ status: ACCEPTED
  │  │  ├─ respondedAt: NOW()
  │  │  └─ updatedAt: NOW()
  │  ├─ Add user to team (could be separate TeamMember table)
  │  │
  │  ├─ CREATE Notification for inviter
  │  │  ├─ userId: invitation.inviterId
  │  │  ├─ type: INVITATION
  │  │  ├─ message: "{user.name} accepted your invitation"
  │  │  └─ relatedId: invitationId
  │  │
  │  └─ Return success
  │
  ├─ Frontend: Show success
  │
  ├─ Update invitation status in UI
  │
  ├─ Refresh lists
  │
  └─ User now part of project team
  
End
```

### 2.6 Close Project & Auto-Disconnect Workflow

```
Start
  │
  ├─ Project author navigates to /posts/{postId}/manage
  │
  ├─ Clicks "Close Project" button
  │
  ├─ Show confirmation dialog:
  │  ├─ "This will disconnect all team members"
  │  ├─ "This action cannot be undone"
  │  └─ Confirm/Cancel
  │
  ├─ User confirms
  │
  ├─ Frontend: POST /api/posts/{postId}/close
  │  ├─ Headers: Authorization: Bearer {token}
  │
  ├─ Backend Processing:
  │  ├─ Extract userId from JWT
  │  ├─ SELECT * FROM Post WHERE id = {postId}
  │  ├─ Verify userId = post.authorId
  │  ├─ UPDATE Post SET
  │  │  ├─ status: CLOSED
  │  │  ├─ closedAt: NOW()
  │  │  └─ updatedAt: NOW()
  │  │
  │  ├─ AUTO-DISCONNECT all invitations:
  │  │  ├─ SELECT * FROM Invitation
  │  │  │  WHERE postId = {postId}
  │  │  │  AND status = ACCEPTED
  │  │  │
  │  │  ├─ FOR each invitation:
  │  │  │  ├─ UPDATE Invitation SET
  │  │  │  │  ├─ status: DISCONNECTED
  │  │  │  │  └─ updatedAt: NOW()
  │  │  │  │
  │  │  │  └─ CREATE Notification:
  │  │  │     ├─ userId: invitation.inviteeId
  │  │  │     ├─ type: SYSTEM
  │  │  │     ├─ message: "Project closed. You've been disconnected."
  │  │  │     └─ relatedId: postId
  │  │  │
  │  ├─ CREATE Notification for author:
  │  │  ├─ message: "Project successfully closed"
  │  │
  │  └─ Return success
  │
  ├─ Frontend: Show success
  │
  ├─ All team members notified
  │
  ├─ Team member access to post resources revoked
  │
  └─ Project archived
  
End
```

### 2.7 Notification Creation Workflow

```
Trigger Event
  │
  ├─ Action occurs:
  │  ├─ Invitation sent
  │  ├─ Invitation accepted/rejected
  │  ├─ Application received
  │  ├─ Message sent
  │  └─ Project closed
  │
  ├─ Determine notification type:
  │  ├─ type: INVITATION | APPLICATION | MESSAGE | SYSTEM
  │
  ├─ Create notification:
  │  ├─ userId: recipient user
  │  ├─ type: [determined above]
  │  ├─ title: Short summary
  │  ├─ message: Full message
  │  ├─ relatedId: Related record ID
  │  ├─ read: false
  │  └─ INSERT into Notification table
  │
  ├─ Real-time update (if WebSocket):
  │  ├─ Emit notification to user's socket
  │
  ├─ Update unread count
  │
  └─ User receives notification badge
  
End
```

---

## 3. Frontend Architecture & Components

### 3.1 Frontend Component Hierarchy

```
App.tsx (Root)
│
├─ Routes (React Router)
│  │
│  ├─ Public Routes:
│  │  ├─ / (Landing Page)
│  │  ├─ /login (Login)
│  │  ├─ /register/student (Student Register)
│  │  ├─ /register/faculty (Faculty Register)
│  │  ├─ /role-selection (Role Selection)
│  │  ├─ /forgot-password (Forgot Password)
│  │  └─ /* (Not Found)
│  │
│  └─ Protected Routes (require AuthContext):
│     ├─ /dashboard (Dashboard)
│     ├─ /home (Home/Feed)
│     ├─ /feed (Personalized Feed)
│     ├─ /profile (Own Profile)
│     ├─ /profile/:userId (User Profile)
│     ├─ /posts/create (Create Post)
│     ├─ /posts (Posts List)
│     ├─ /posts/:postId (Post Detail)
│     ├─ /posts/:postId/manage (Manage Post)
│     ├─ /posts/manage (My Posts)
│     ├─ /applications (My Applications)
│     ├─ /applications/manage (Manage Applications)
│     ├─ /invitations (Invitations Dashboard) ← MAIN FEATURE
│     ├─ /recommended-candidates (Recommendations)
│     ├─ /chatrooms (Chatrooms List)
│     ├─ /chatrooms/:id (Chatroom)
│     ├─ /forums (Forums)
│     ├─ /notifications (Notifications)
│     ├─ /settings (Settings)
│     ├─ /profile/settings (Profile Settings)
│     └─ /about (About)
│
├─ Contexts (Global State):
│  ├─ AuthContext (User auth, login/logout)
│  ├─ NotificationContext (Toast notifications)
│  ├─ ThemeContext (Light/dark mode)
│  └─ UIContext (UI state, modals, etc.)
│
└─ Providers:
   ├─ Theme Provider (MUI)
   ├─ Router Provider
   ├─ Context Providers (Auth, Notification)
   └─ MUI Theme
```

### 3.2 Component Structure by Feature

```
Frontend Components Organization:

src/components/
│
├─ Layout/
│  ├─ Navbar.tsx → Top navigation bar
│  ├─ Sidebar.tsx → Left sidebar with menu
│  ├─ Footer.tsx → Footer
│  └─ Container.tsx → Page wrapper
│
├─ Invitations/ ← PRIMARY FEATURE
│  ├─ index.ts → Barrel export
│  ├─ InvitationDashboard.tsx → Main container with tabs
│  ├─ SentInvitationsList.tsx → List of sent invitations
│  ├─ ReceivedInvitationsList.tsx → List of received invitations
│  └─ InvitationCard.tsx → Individual invitation card
│
├─ Posts/
│  ├─ PostCard.tsx → Post preview card
│  ├─ PostForm.tsx → Create/edit post form
│  ├─ PostList.tsx → List of posts
│  └─ PostDetail.tsx → Full post details
│
├─ Applications/
│  ├─ ApplicationForm.tsx → Apply to post
│  ├─ ApplicationCard.tsx → Display application
│  └─ ApplicationList.tsx → List applications
│
├─ Chat/
│  ├─ ChatroomList.tsx → List of chatrooms
│  ├─ ChatWindow.tsx → Message display
│  ├─ MessageInput.tsx → Message input field
│  └─ MessageBubble.tsx → Individual message
│
├─ Profile/
│  ├─ ProfileCard.tsx → User profile summary
│  ├─ ProfileForm.tsx → Edit profile
│  ├─ SkillsList.tsx → Display skills
│  └─ AvatarUpload.tsx → Avatar uploader
│
├─ Common/
│  ├─ Button.tsx → Custom button
│  ├─ Input.tsx → Custom input
│  ├─ Modal.tsx → Modal dialog
│  ├─ Dropdown.tsx → Dropdown menu
│  ├─ Alert.tsx → Alert messages
│  ├─ Spinner.tsx → Loading spinner
│  ├─ Badge.tsx → Status badges
│  ├─ Chip.tsx → Tag component
│  ├─ Card.tsx → Card container
│  ├─ Pagination.tsx → Pagination
│  └─ Empty.tsx → Empty state
│
├─ Design/
│  ├─ DesignSystem.tsx → Theme & tokens
│  └─ Icons.tsx → Icon library
│
└─ Debug/
   └─ DebugPanel.tsx → Dev tools
```

---

## 4. Page-by-Page Feature Specifications

### 4.1 Landing Page (/)`
```
Component: LandingPageNew.tsx

Purpose: Public homepage for unauthenticated users

Sections:
├─ Navbar
│  ├─ Logo (clickable → /)
│  ├─ Menu links (Home, About, Features)
│  ├─ Login button → /login
│  ├─ Sign Up button → /role-selection
│  └─ Responsive hamburger menu (mobile)
│
├─ Hero Section
│  ├─ Large headline (project title/tagline)
│  ├─ Subheading (description)
│  ├─ CTA button: "Get Started" → /role-selection
│  ├─ Background image/gradient
│  └─ Animation on scroll
│
├─ Features Section
│  ├─ Feature cards (3-5 features)
│  │  ├─ Icon
│  │  ├─ Title
│  │  └─ Description
│  └─ Responsive grid (1 col mobile, 2-3 col desktop)
│
├─ How It Works Section
│  ├─ Step-by-step visual process
│  │  ├─ Step 1: Register/Login
│  │  ├─ Step 2: Create/Browse Projects
│  │  ├─ Step 3: Send/Receive Invitations
│  │  └─ Step 4: Collaborate
│  └─ Animated numbers/indicators
│
├─ Testimonials Section
│  ├─ User testimonial cards
│  │  ├─ User avatar
│  │  ├─ Quote
│  │  ├─ Name
│  │  └─ Role
│  └─ Carousel/slider (if multiple)
│
├─ Call-to-Action Section
│  ├─ "Ready to get started?"
│  ├─ Button: "Sign Up Now" → /role-selection
│  └─ Button: "Learn More" → /about
│
└─ Footer
   ├─ Links (About, Privacy, Terms)
   ├─ Social links
   ├─ Copyright
   └─ Contact info

Features:
├─ Fully responsive (mobile, tablet, desktop)
├─ Dark/light theme support
├─ Smooth scrolling
├─ Framer Motion animations
├─ SEO-optimized
└─ Fast loading
```

### 4.2 Login Page (/login)
```
Component: LoginNew.tsx

Purpose: Authenticate existing users

Layout:
├─ Left side (Desktop): Image/illustration
└─ Right side (Form container)

Form Content:
├─ Header: "Welcome Back"
├─ Subheader: "Login to your account"
│
├─ Form Fields:
│  ├─ Email input
│  │  ├─ Label: "Email Address"
│  │  ├─ Type: email
│  │  ├─ Placeholder: "you@example.com"
│  │  ├─ Error message (if invalid)
│  │  └─ Error styling (red border)
│  │
│  └─ Password input
│     ├─ Label: "Password"
│     ├─ Type: password (hide/show toggle icon)
│     ├─ Placeholder: "••••••••"
│     ├─ Error message (if invalid)
│     └─ Error styling (red border)
│
├─ Checkbox: "Remember me"
│  └─ Saves email locally
│
├─ Link: "Forgot password?" → /forgot-password
│  └─ Right-aligned, blue text
│
├─ Submit Button:
│  ├─ Label: "Login"
│  ├─ Full width
│  ├─ Disabled while loading
│  ├─ Shows spinner on loading
│  ├─ Changes to success state on success
│  └─ Changes to error state on error
│
├─ Divider: "OR"
│
├─ Social Login (optional):
│  ├─ Google button
│  ├─ GitHub button
│  └─ Microsoft button
│
└─ Sign Up Link:
   ├─ "Don't have an account? Sign up here"
   └─ → /role-selection

Validation:
├─ Email: Valid format (email regex)
├─ Password: Non-empty
└─ Error messages below each field

Functionality:
├─ POST /api/auth/login
├─ Response: JWT token + user object
├─ Store JWT in secure storage
├─ Set Authorization header
├─ Success: Redirect to /dashboard
├─ Error: Show error message, don't redirect
└─ Loading state: Show spinner, disable input
```

### 4.3 Student Register Page (/register/student)
```
Component: StudentRegister.tsx

Purpose: Register new student users (multi-step form)

Overall:
├─ Header: "Create Your Student Account"
├─ Progress bar: Shows current step (1/4, 2/4, etc.)
└─ Steps: 1. Basic, 2. Profile, 3. Preferences, 4. Review

Step 1: Basic Information
├─ Form fields:
│  ├─ First Name
│  │  ├─ Label: "First Name"
│  │  ├─ Placeholder: "John"
│  │  ├─ Validation: 2-50 chars
│  │  └─ Error message
│  │
│  ├─ Last Name
│  │  ├─ Label: "Last Name"
│  │  ├─ Placeholder: "Doe"
│  │  ├─ Validation: 2-50 chars
│  │  └─ Error message
│  │
│  ├─ Email
│  │  ├─ Label: "Email Address"
│  │  ├─ Type: email
│  │  ├─ Validation: Valid email, unique check
│  │  └─ Error message (show if exists)
│  │
│  ├─ Password
│  │  ├─ Label: "Password"
│  │  ├─ Type: password (hide/show toggle)
│  │  ├─ Password strength meter
│  │  ├─ Validation: 8+ chars, mixed case, number, special
│  │  └─ Requirements list (visual checklist)
│  │
│  └─ Confirm Password
│     ├─ Label: "Confirm Password"
│     ├─ Type: password (hide/show toggle)
│     ├─ Validation: Match with password field
│     └─ Error message (if no match)
│
├─ Buttons:
│  ├─ Next: Proceed to Step 2 (disabled if form invalid)
│  └─ Back: Go to role selection (optional)

Step 2: Profile Information
├─ Form fields:
│  ├─ Avatar Upload
│  │  ├─ Label: "Profile Picture"
│  │  ├─ Preview image
│  │  ├─ Upload button
│  │  ├─ Accepted formats: JPG, PNG
│  │  ├─ Max size: 5MB
│  │  ├─ Initials fallback if not uploaded
│  │  └─ Error message
│  │
│  ├─ Bio
│  │  ├─ Label: "Bio"
│  │  ├─ Type: textarea
│  │  ├─ Placeholder: "Tell us about yourself..."
│  │  ├─ Char counter: 0-500 chars
│  │  ├─ Validation: ≤500 chars
│  │  └─ Error message
│  │
│  └─ Skills
│     ├─ Label: "Skills"
│     ├─ Type: Multi-select dropdown
│     ├─ Options: Predefined skill list
│     ├─ Searchable
│     ├─ Show selected as chips/tags
│     ├─ Max 10 skills
│     ├─ Validation: At least 1 skill
│     └─ Error message
│
├─ Buttons:
│  ├─ Next: → Step 3
│  └─ Back: → Step 1

Step 3: Preferences
├─ Form fields:
│  ├─ Department/Major
│  │  ├─ Label: "Department"
│  │  ├─ Type: Dropdown
│  │  ├─ Options: [Computer Science, Engineering, etc.]
│  │  ├─ Validation: Required
│  │  └─ Error message
│  │
│  ├─ Availability
│  │  ├─ Label: "Availability"
│  │  ├─ Type: Radio buttons
│  │  ├─ Options: Full-time, Part-time, Flexible
│  │  └─ Validation: Required
│  │
│  ├─ Interests
│  │  ├─ Label: "Project Interests"
│  │  ├─ Type: Checkboxes
│  │  ├─ Options: [Web Dev, Mobile, Data Science, etc.]
│  │  └─ Allow multiple selections
│  │
│  └─ Terms & Conditions
│     ├─ Checkbox: "I agree to Terms of Service"
│     ├─ Link to /terms
│     ├─ Checkbox: "I agree to Privacy Policy"
│     ├─ Link to /privacy
│     ├─ Both required
│     └─ Error message if unchecked
│
├─ Buttons:
│  ├─ Next: → Step 4 (if all validated)
│  └─ Back: → Step 2

Step 4: Review & Confirm
├─ Display all entered data:
│  ├─ Name: {firstName} {lastName}
│  ├─ Email: {email}
│  ├─ Department: {department}
│  ├─ Skills: {skills}
│  ├─ Avatar: {preview}
│  └─ Etc.
│
├─ Edit buttons next to each section:
│  ├─ "Edit" → Go back to specific step
│
├─ Warning: "Review carefully, changes limited after signup"
│
├─ Buttons:
│  ├─ Create Account: Submit registration
│  │  ├─ POST /api/auth/register
│  │  ├─ Show spinner while loading
│  │  ├─ On success: Show success message
│  │  ├─ On error: Show error message, allow retry
│  │  └─ Disable button during request
│  │
│  └─ Back: → Step 3

Overall Navigation:
├─ Progress indicators clickable (with warning if unsaved changes)
├─ Save form state to localStorage (auto-save)
├─ Recover lost form data on reload
└─ Show validation errors in real-time

Success Flow:
├─ Show: "Account created successfully!"
├─ Show: "Redirecting to login in 3 seconds..."
├─ Redirect to: /login
└─ Pre-fill email on login form
```

### 4.4 Invitations Dashboard (/invitations) - PRIMARY FEATURE
```
Component: Invitations.tsx → InvitationDashboard.tsx

Purpose: Manage LinkedIn-style invitations & team connections

Main Layout:
├─ Header with emoji: "👥 Invitations"
├─ Subheader: "Manage your team invitations, send invites and view received invitations. When the project ends, all connections will automatically disconnect."
│
└─ Two-Tab Interface:

═══════════════════════════════════════════════════════════════════

TAB 1: "📤 I Invited" (SentInvitationsList.tsx)
Purpose: Show invitations sent by user

Components & Features:
├─ Tab Header:
│  ├─ Icon: Paper plane / send icon
│  ├─ Title: "I Invited"
│  ├─ Unread/pending count badge (if any)
│  └─ Active tab indicator
│
├─ Subheader:
│  └─ "Invitations I've Sent"
│  └─ "View all the team invitations you've sent other users."
│
├─ Filter Section:
│  ├─ Filter Label: "Filter by Status"
│  ├─ Dropdown menu:
│  │  ├─ ALL (Shows all invitations regardless of status)
│  │  ├─ PENDING (Awaiting response)
│  │  ├─ ACCEPTED (User accepted, joined team)
│  │  ├─ REJECTED (User declined)
│  │  ├─ CANCELLED (You cancelled before they responded)
│  │  └─ DISCONNECTED (Auto-removed after project closed)
│  │
│  └─ Statistics chips display:
│     ├─ Pending count (if > 0)
│     ├─ Accepted count (if > 0)
│     ├─ Rejected count (if > 0)
│     └─ Total count
│
├─ Invitation List:
│  ├─ Each invitation as InvitationCard component
│  │  ├─ User avatar (with initials if no image)
│  │  ├─ Invitee name
│  │  ├─ Project title
│  │  ├─ Invitation message (if provided)
│  │  ├─ Status badge (color-coded):
│  │  │  ├─ PENDING: Amber/yellow
│  │  │  ├─ ACCEPTED: Green
│  │  │  ├─ REJECTED: Red
│  │  │  ├─ CANCELLED: Gray
│  │  │  └─ DISCONNECTED: Muted
│  │  │
│  │  ├─ Timestamps:
│  │  │  ├─ Sent date: "Sent on Jan 15, 2026"
│  │  │  └─ Responded date (if applicable): "Accepted on Jan 16, 2026"
│  │  │
│  │  ├─ Action buttons (conditional):
│  │  │  ├─ If PENDING:
│  │  │  │  └─ "Cancel" button (red outline)
│  │  │  │     ├─ Click shows confirmation dialog
│  │  │  │     ├─ Dialog: "Cancel this invitation?"
│  │  │  │     ├─ Confirm: DELETE record
│  │  │  │     └─ Backend: POST /api/invitations/{id}/cancel
│  │  │  │
│  │  │  ├─ If ACCEPTED:
│  │  │  │  ├─ View team member profile link
│  │  │  │  └─ Disconnect button (if author has permission)
│  │  │  │
│  │  │  └─ If other status: No action buttons
│  │  │
│  │  └─ Animation: Slide in from left (Framer Motion)
│
│  ├─ Loading state:
│  │  ├─ Show circular spinner
│  │  ├─ Message: "Loading invitations..."
│  │  └─ Initial load shows skeleton cards
│
│  ├─ Empty state:
│  │  ├─ Icon: Empty envelope
│  │  ├─ Message: "No sent invitations yet"
│  │  ├─ Subtext: "Send your first invitation to start building your team"
│  │  └─ Button: "Browse projects" (if applicable)
│
│  ├─ Error state:
│  │  ├─ Alert box: Red background
│  │  ├─ Icon: Error symbol
│  │  ├─ Message: "Failed to load invitations"
│  │  └─ Retry button
│
├─ Pagination:
│  ├─ Items per page: 10
│  ├─ Pagination controls below list
│  ├─ Shows: "Page 1 of 5" or similar
│  ├─ Previous/Next buttons
│  └─ Page number inputs/selectors
│
└─ Alert Messages:
   ├─ Success: "Invitation cancelled" (green alert, auto-dismiss)
   ├─ Error: "Failed to cancel invitation" (red alert, persistent)
   └─ Info: Alert about auto-disconnect when project closes

═══════════════════════════════════════════════════════════════════

TAB 2: "📥 They Invited Me" (ReceivedInvitationsList.tsx)
Purpose: Show invitations received by user, manage responses

Components & Features:
├─ Tab Header:
│  ├─ Icon: Inbox / mail icon
│  ├─ Title: "They Invited Me"
│  ├─ "Action Needed" badge (if PENDING count > 0)
│  └─ Active tab indicator
│
├─ Subheader:
│  └─ "Invitations I've Received"
│  └─ "View all the team invitations you've received from others. Accept to join a team or decline to skip."
│
├─ Filter Section:
│  ├─ Filter Label: "Filter by Status"
│  ├─ Dropdown menu:
│  │  ├─ ALL (All invitations)
│  │  ├─ "Pending - Action Needed" (PENDING status - highlighted)
│  │  ├─ ACCEPTED
│  │  ├─ REJECTED
│  │  └─ CANCELLED
│  │
│  ├─ Special Chip Badge:
│  │  ├─ If PENDING count > 0:
│  │  │  ├─ Show chip: "{count} Pending - Action Needed"
│  │  │  ├─ Background: Warning color (amber/yellow)
│  │  │  └─ Bold font for emphasis
│  │  │
│  │  └─ Statistics:
│  │     ├─ Accepted count (if > 0)
│  │     └─ Declined count (if > 0)
│
├─ Invitation List:
│  ├─ Each invitation as InvitationCard component
│  │  ├─ User avatar (inviter)
│  │  ├─ Inviter name
│  │  ├─ Project title (clickable → /posts/{postId})
│  │  ├─ Invitation message (if provided)
│  │  ├─ Status badge (color-coded)
│  │  ├─ Timestamps:
│  │  │  ├─ Sent date
│  │  │  └─ Your response date (if applicable)
│  │  │
│  │  └─ Action buttons (conditional):
│  │     ├─ If PENDING:
│  │     │  ├─ "Accept" button (green, prominent)
│  │     │  │  ├─ On click: Show confirmation
│  │     │  │  ├─ Confirmation: "Accept this invitation to join {project.title}?"
│  │     │  │  ├─ Confirm: POST /api/invitations/{id}/accept
│  │     │  │  ├─ Success: Show "Joined team!" message
│  │     │  │  ├─ User joins team immediately
│  │     │  │  └─ Notification sent to inviter
│  │     │  │
│  │     │  └─ "Decline" button (red outline)
│  │     │     ├─ On click: Show confirmation
│  │     │     ├─ Confirmation: "Decline this invitation?"
│  │     │     ├─ Confirm: POST /api/invitations/{id}/reject
│  │     │     ├─ Success: Show "Declined" message
│  │     │     └─ Notification sent to inviter
│  │     │
│  │     ├─ If ACCEPTED:
│  │     │  ├─ View project link
│  │     │  ├─ View team members list (button)
│  │     │  └─ Disconnect button (if allowed)
│  │     │
│  │     └─ If REJECTED/CANCELLED: No action buttons
│
│  ├─ Loading state:
│  │  ├─ Show circular spinner
│  │  ├─ Message: "Loading invitations..."
│  │  └─ Skeleton cards during load
│
│  ├─ Empty state:
│  │  ├─ Icon: Empty inbox
│  │  ├─ Message: "No received invitations yet"
│  │  ├─ Subtext: "When someone invites you, they'll appear here"
│  │  └─ Browse projects button (optional)
│
│  ├─ Error state:
│  │  ├─ Alert box: Red background
│  │  ├─ Message: "Failed to load invitations"
│  │  └─ Retry button
│
├─ Pagination:
│  ├─ Items per page: 10
│  ├─ Pagination controls below list
│  ├─ Shows page info and navigation
│  └─ Page number selector
│
└─ Alert Messages:
   ├─ Success: "Invitation accepted! You've joined the team." (green, auto-dismiss)
   ├─ Error: "Failed to accept invitation" (red, persistent)
   ├─ Decline: "Invitation declined" (info, auto-dismiss)
   └─ Error: "Failed to decline invitation" (red, persistent)

═══════════════════════════════════════════════════════════════════

Info Box (Below Tabs):
├─ Header: "✨ How It Works"
├─ Content:
│  ├─ "• I Invited: Shows all team invitations you've sent..."
│  ├─ "• They Invited Me: Shows invitations you've received..."
│  ├─ "• Auto-Disconnect: When a project is closed..."
│  ├─ "• Team Management: Accept invitations to become part..."
│  └─ Styled as informational section
│
└─ Styling: Blue background, blue left border

Overall Functionality:
├─ Two-tab layout with smooth transitions
├─ Real-time data loading on mount
├─ Refresh on interval (optional)
├─ Loading, error, and empty states for each list
├─ Form validation and error handling
├─ Success/error toast notifications
├─ Responsive design (mobile, tablet, desktop)
├─ Animations with Framer Motion
├─ Keyboard accessibility
└─ Loading states on buttons during API calls

API Integration:
├─ GET /api/invitations/sent (with pagination, filters)
├─ GET /api/invitations/received (with pagination, filters)
├─ POST /api/invitations/{id}/accept
├─ POST /api/invitations/{id}/reject
├─ POST /api/invitations/{id}/cancel
├─ DELETE /api/invitations/{id} (cancel)
└─ All include Authorization header with JWT token
```

### 4.5 Dashboard Page (/dashboard)
```
Component: Dashboard.tsx

Purpose: User home page after login, overview of activities

Layout - Left Column (70%):
├─ Welcome Header:
│  ├─ Greeting: "Welcome back, {firstName}!"
│  ├─ Current time: "Tuesday, January 15, 2026"
│  └─ Motivational quote (optional)
│
├─ Quick Stats Cards (4 cards in grid):
│  ├─ Card 1: Posts Created
│  │  ├─ Icon: Document/Post icon
│  │  ├─ Number: {count}
│  │  ├─ Label: "Posts Created"
│  │  └─ Link: "View all" → /posts/manage
│  │
│  ├─ Card 2: Pending Invitations
│  │  ├─ Icon: Envelope icon
│  │  ├─ Number: {count}
│  │  ├─ Label: "Pending Invitations"
│  │  └─ Link: "View all" → /invitations
│  │
│  ├─ Card 3: Applications
│  │  ├─ Icon: Application form icon
│  │  ├─ Number: {count}
│  │  ├─ Label: "Applications"
│  │  └─ Link: "View all" → /applications
│  │
│  └─ Card 4: Team Members
│     ├─ Icon: People icon
│     ├─ Number: {count}
│     ├─ Label: "Team Members"
│     └─ Link: "Manage" → /posts/manage
│
├─ Recent Activity Feed:
│  ├─ Header: "Recent Activity"
│  ├─ Activity items (timeline format):
│  │  ├─ Activity: "User X accepted your invitation to Project Y"
│  │  │  ├─ Timestamp: "2 hours ago"
│  │  │  ├─ Icon: Checkmark
│  │  │  ├─ Link to detail
│  │  │  └─ Clickable
│  │  │
│  │  ├─ Activity: "New application from User X"
│  │  │  ├─ Timestamp: "5 hours ago"
│  │  │  ├─ Icon: Form
│  │  │  ├─ Link to application
│  │  │  └─ "View" button
│  │  │
│  │  ├─ Activity: "User X joined your project"
│  │  │  ├─ Timestamp: "1 day ago"
│  │  │  ├─ Icon: Person
│  │  │  └─ Link to project
│  │  │
│  │  └─ More items...
│  │
│  ├─ Pagination: "Load more" button at bottom
│  └─ Empty state: "No recent activity"

Layout - Right Column (30%):
├─ Quick Actions Box:
│  ├─ Header: "Quick Actions"
│  ├─ Button: "Create New Post" → /posts/create
│  │  └─ Full width, primary color
│  │
│  ├─ Button: "Browse Projects" → /home
│  │  └─ Full width, secondary color
│  │
│  └─ Button: "View Invitations" → /invitations
│     └─ Full width, with badge count
│
├─ Upcoming Events/Deadlines:
│  ├─ Header: "Upcoming Deadlines"
│  ├─ List of deadlines:
│  │  ├─ "Project A - Apply by Jan 20"
│  │  │  └─ Progress bar showing time left
│  │  │
│  │  ├─ "Project B - Team meeting Jan 18"
│  │  │  └─ Icon: Calendar
│  │  │
│  │  └─ "Project C - Due date: Jan 25"
│  │
│  └─ Link: "View all" → /calendar
│
└─ Profile Quick Access:
   ├─ Header: "Profile"
   ├─ User avatar (large)
   ├─ Name: "{firstName} {lastName}"
   ├─ Role: "(Student / Faculty)"
   ├─ Department: "{department}"
   ├─ Stats:
   │  ├─ Connections: {count}
   │  ├─ Posts: {count}
   │  └─ Rating: {stars}
   │
   └─ Buttons:
      ├─ "Edit Profile" → /profile/settings
      └─ "View Full Profile" → /profile

Overall Features:
├─ Responsive grid layout
├─ Loading states for each section
├─ Auto-refresh (optional, configurable)
├─ Animations on data load
├─ Real-time notification count updates
└─ Quick navigation to main features
```

### 4.6 Create Post Page (/posts/create)
```
Component: CreatePostMultiStep.tsx

Purpose: Multi-step form to create new projects

Overall:
├─ Header: "Create New Project"
├─ Progress bar: 1/4, 2/4, 3/4, 4/4
└─ Form wrapper with styled container

Step 1: Basic Details
├─ Title field:
│  ├─ Label: "Project Title"
│  ├─ Type: text input
│  ├─ Placeholder: "e.g., Mobile App Development"
│  ├─ Validation: 10-200 characters
│  ├─ Char counter: "45 / 200"
│  └─ Error message: "Title must be 10-200 characters"
│
├─ Description field:
│  ├─ Label: "Project Description"
│  ├─ Type: textarea
│  ├─ Placeholder: "Describe your project in detail..."
│  ├─ Validation: 50-5000 characters
│  ├─ Char counter: "250 / 5000"
│  └─ Error message: "Description must be 50-5000 characters"
│
├─ Category field:
│  ├─ Label: "Project Category"
│  ├─ Type: dropdown/select
│  ├─ Options: [Web Development, Mobile App, Data Science, AI/ML, etc.]
│  ├─ Validation: Required
│  └─ Error message: "Please select a category"
│
└─ Buttons:
   ├─ Next: Proceed to Step 2 (validate form)
   └─ Back: Discard changes, go to previous page (with confirmation)

Step 2: Requirements & Skills
├─ Required Skills field:
│  ├─ Label: "Required Skills"
│  ├─ Type: Multi-select with search
│  ├─ Options: Predefined skill list
│  ├─ Searchable: Filter skills as you type
│  ├─ Selected skills show as chips/tags
│  ├─ Remove individual skills with X button
│  ├─ Validation: At least 1 skill required
│  ├─ Max skills: 10
│  └─ Error message: "Please select at least 1 skill"
│
├─ Team Size field:
│  ├─ Label: "Desired Team Size"
│  ├─ Type: number input
│  ├─ Min: 1, Max: 50
│  ├─ Placeholder: "e.g., 5"
│  ├─ Validation: Positive integer
│  └─ Error message: "Enter a valid team size (1-50)"
│
├─ Additional Requirements (optional):
│  ├─ Label: "Additional Requirements"
│  ├─ Type: textarea
│  ├─ Placeholder: "Any other specific requirements..."
│  ├─ Validation: ≤1000 characters
│  └─ Char counter: "100 / 1000"
│
└─ Buttons:
   ├─ Next: → Step 3
   └─ Back: → Step 1

Step 3: Timeline & Details
├─ Deadline field:
│  ├─ Label: "Application Deadline"
│  ├─ Type: date picker
│  ├─ Min date: Today + 1 day
│  ├─ Placeholder: "Select a date"
│  ├─ Validation: Must be future date
│  └─ Error message: "Deadline must be in the future"
│
├─ Project Duration field:
│  ├─ Label: "Project Duration"
│  ├─ Type: Date range picker or text
│  ├─ Validation: End date > Start date
│  └─ Error message: "Invalid date range"
│
├─ Budget (optional):
│  ├─ Label: "Budget (if applicable)"
│  ├─ Type: number input with currency
│  ├─ Placeholder: "e.g., $5000"
│  ├─ Prefix: $ symbol
│  └─ Validation: Positive number or empty
│
└─ Buttons:
   ├─ Next: → Step 4 Review
   └─ Back: → Step 2

Step 4: Review & Publish
├─ Summary display (non-editable, read-only):
│  ├─ Section: "Project Details"
│  │  ├─ Title: {title}
│  │  ├─ Description: {description}
│  │  ├─ Category: {category}
│  │  └─ "Edit" button → Go back to Step 1
│  │
│  ├─ Section: "Requirements"
│  │  ├─ Skills: {skills joined with comma}
│  │  ├─ Team Size: {teamSize}
│  │  ├─ Additional Requirements: {requirements}
│  │  └─ "Edit" button → Go back to Step 2
│  │
│  ├─ Section: "Timeline"
│  │  ├─ Deadline: {deadline formatted}
│  │  ├─ Duration: {startDate} to {endDate}
│  │  ├─ Budget: {budget}
│  │  └─ "Edit" button → Go back to Step 3
│
├─ Checkboxes:
│  ├─ ☐ "I agree all information is correct"
│  ├─ ☐ "I have reviewed the requirements"
│  └─ Both required before submit
│
├─ Buttons:
│  ├─ Publish Project: Submit form
│  │  ├─ Validate all required checkboxes
│  │  ├─ POST /api/posts
│  │  ├─ Show spinner while loading
│  │  ├─ On success: "Project published! Redirecting..."
│  │  ├─ Redirect to /posts/{newPostId}
│  │  ├─ On error: Show error message, allow retry
│  │  └─ Disable button during request
│  │
│  ├─ Save as Draft (optional):
│  │  ├─ Save with status: DRAFT
│  │  ├─ Message: "Saved as draft. You can edit later."
│  │  └─ Redirect to /posts/manage
│  │
│  └─ Back: → Step 3

Form Management:
├─ Auto-save form state to localStorage
├─ Show warning if user tries to leave with unsaved changes
├─ Recover form state on page reload
├─ Show already saved data when returning
└─ Clear saved state after successful submission
```

### 4.7 Profile Settings Page (/profile/settings)
```
Component: ProfileSettingsNew.tsx

Purpose: Allow users to edit their profile

Layout:
├─ Header: "Profile Settings"
├─ Subheader: "Manage your profile information"
│
└─ Form sections:

Basic Information Section:
├─ First Name
│  ├─ Label: "First Name"
│  ├─ Current value displayed
│  ├─ Editable text input
│  ├─ Validation: 2-50 chars
│  └─ Error message
│
├─ Last Name
│  ├─ Label: "Last Name"
│  ├─ Current value displayed
│  ├─ Editable text input
│  ├─ Validation: 2-50 chars
│  └─ Error message
│
├─ Email (read-only)
│  ├─ Label: "Email"
│  ├─ Display only, non-editable
│  └─ Button: "Change Email" → Separate workflow
│
└─ Role (read-only)
   ├─ Label: "Role"
   └─ Display current role (cannot change)

Profile Section:
├─ Avatar Upload
│  ├─ Label: "Profile Picture"
│  ├─ Current avatar displayed
│  ├─ Upload button: "Change Photo"
│  ├─ Accepted: JPG, PNG
│  ├─ Max size: 5MB
│  ├─ Preview after selection
│  ├─ Remove button: "Remove Photo"
│  └─ Error message for invalid files
│
├─ Bio
│  ├─ Label: "Bio"
│  ├─ Textarea with current text
│  ├─ Char counter: "150 / 500"
│  ├─ Validation: ≤500 chars
│  └─ Placeholder: "Tell us about yourself..."
│
├─ Department
│  ├─ Label: "Department"
│  ├─ Dropdown with current selection
│  ├─ Options: Predefined departments
│  └─ Validation: Required
│
└─ Website URL (optional)
   ├─ Label: "Website"
   ├─ Text input with protocol dropdown
   ├─ Validation: Valid URL format
   └─ Placeholder: "https://yourwebsite.com"

Skills Section:
├─ Header: "Skills"
├─ Label: "Add Your Skills"
├─ Type: Multi-select searchable
├─ Options: Predefined skill list
├─ Selected skills as chips/tags
├─ Remove individual skills
├─ Validation: Max 20 skills
├─ Max displayed: 20 skills
└─ Search to find skills quickly

Social Links Section:
├─ GitHub URL
│  ├─ Label: "GitHub Profile"
│  ├─ Text input with icon
│  ├─ Validation: Valid GitHub URL or empty
│  └─ Placeholder: "https://github.com/username"
│
├─ LinkedIn URL
│  ├─ Label: "LinkedIn Profile"
│  ├─ Text input with icon
│  ├─ Validation: Valid LinkedIn URL or empty
│  └─ Placeholder: "https://linkedin.com/in/username"
│
└─ Portfolio URL
   ├─ Label: "Portfolio"
   ├─ Text input with icon
   ├─ Validation: Valid URL or empty
   └─ Placeholder: "https://yourportfolio.com"

Security Section:
├─ Password
│  ├─ Button: "Change Password"
│  │  ├─ Opens dialog/modal
│  │  ├─ Current password input
│  │  ├─ New password input (with strength meter)
│  │  ├─ Confirm password input
│  │  ├─ Validation: 8+ chars, complex
│  │  └─ Save button
│  │
│  └─ Last changed: "3 months ago"
│
├─ Two-Factor Authentication
│  ├─ Status: "Not enabled"
│  ├─ Button: "Enable 2FA"
│  │  └─ Opens setup wizard (QR code, backup codes)
│  │
│  └─ Or if enabled:
│     ├─ Status: "Enabled"
│     └─ Button: "Disable 2FA"

Privacy Section:
├─ Profile Visibility
│  ├─ Radio buttons:
│  │  ├─ ○ Public (everyone can see)
│  │  ├─ ○ Friends Only
│  │  └─ ○ Private (only me)
│  └─ Current selection shown
│
├─ Email Visibility
│  ├─ Checkbox: "Show email on profile"
│  ├─ Current state shown
│  └─ Toggle on/off
│
└─ Search Engine Indexing
   ├─ Checkbox: "Allow search engines to index my profile"
   ├─ Current state shown
   └─ Toggle on/off

Preferences Section:
├─ Email Notifications
│  ├─ Checkbox: "Receive email on new invitation"
│  ├─ Checkbox: "Receive email on new application"
│  ├─ Checkbox: "Receive email on new message"
│  └─ Checkbox: "Receive weekly digest"
│
├─ Theme
│  ├─ Radio buttons:
│  │  ├─ ○ Light theme
│  │  ├─ ○ Dark theme
│  │  └─ ○ System (follow OS setting)
│  └─ Preview: Show theme sample
│
└─ Language
   ├─ Dropdown: Select language
   ├─ Options: [English, Spanish, French, etc.]
   └─ Page reloads when changed

Action Buttons:
├─ Save Changes
│  ├─ Button color: Primary/blue
│  ├─ Full width or regular width
│  ├─ PUT /api/users/{userId}
│  ├─ Show spinner while saving
│  ├─ On success: "Profile updated successfully!" (green alert)
│  ├─ Auto-dismiss success message after 3s
│  ├─ On error: Show error message (red alert)
│  └─ Allow retry
│
└─ Cancel
   ├─ Discard unsaved changes
   ├─ Ask for confirmation if changes made
   └─ Go back to /profile

Form Management:
├─ Auto-save draft to localStorage
├─ Show unsaved changes indicator (*)
├─ Warn before leaving page with unsaved changes
├─ Show "All changes saved" confirmation
└─ Display field-level error messages
```

### 4.8 Other Important Pages (Summary)

**Post Detail Page (/posts/:postId)**
- Full project details
- Author information with profile link
- Skills required
- Team members section
- Applications section (if author)
- Discussion/comments thread
- Send invitation button (if author)
- Apply button (if not author)

**Chatroom Page (/chatrooms/:id)**
- Message list (scrollable, pagination)
- Message input with file upload
- Real-time message updates
- User typing indicator
- Online status of members
- Message reactions (emoji)
- Pin important messages

**Forums Page (/forums)**
- List of discussion threads
- Create new thread button
- Filter by category
- Search threads
- Thread preview with author, date, replies

**Notifications Page (/notifications)**
- All notifications list
- Filter by type (invitation, application, message, system)
- Mark as read/unread
- Delete notification
- Real-time updates
- Notification detail view

**Settings Page (/settings)**
- Account settings
- Privacy settings
- Notification preferences
- Theme selection
- Language selection

---

## 5. Component Specifications

### 5.1 InvitationCard Component (Core Component)

```
Component: InvitationCard.tsx

Props:
├─ invitation: Invitation (required)
│  ├─ id: string (UUID)
│  ├─ postId: string
│  ├─ inviterId: string
│  ├─ inviteeId: string
│  ├─ inviterName: string
│  ├─ inviteeName: string
│  ├─ message: string (optional)
│  ├─ status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "DISCONNECTED"
│  ├─ createdAt: Date
│  ├─ respondedAt: Date (optional)
│  └─ post.title: string
│
├─ type: "sent" | "received" (required)
│  └─ Determines which user is displayed and what actions available
│
├─ isLoading: boolean (optional, default: false)
│  └─ Shows spinner during API call
│
├─ onAccept: () => void (optional)
│  └─ Callback when accept button clicked
│
├─ onReject: () => void (optional)
│  └─ Callback when reject button clicked
│
└─ onCancel: () => void (optional)
   └─ Callback when cancel button clicked

Internal State:
├─ showConfirmDialog: boolean
│  └─ Show confirmation dialog for actions
│
├─ confirmAction: "accept" | "reject" | "cancel" | null
│  └─ Which action pending confirmation
│
└─ dialogOpen: boolean
   └─ Whether confirmation dialog is visible

Rendering:
├─ Card container (MUI Paper/Card)
│  ├─ Border left: 4-5px (color based on status)
│  │  ├─ PENDING: Amber (#F59E0B)
│  │  ├─ ACCEPTED: Green (#10B981)
│  │  ├─ REJECTED: Red (#EF4444)
│  │  ├─ CANCELLED: Gray (#9CA3AF)
│  │  └─ DISCONNECTED: Muted (#D1D5DB)
│  │
│  ├─ Padding: 16px (default MUI spacing)
│  ├─ Margin bottom: 12px (spacing between cards)
│  └─ Hover effect: Slight shadow increase or scale
│
├─ Avatar Section:
│  ├─ Avatar component
│  │  ├─ Display: inviter/invitee image or initials
│  │  ├─ Size: 48px (medium)
│  │  ├─ Background gradient if no image
│  │  └─ Initials fallback: First letter of first + last name
│  │
│  ├─ Name: "{First} {Last}" (clickable to profile)
│  ├─ Project title: "{Post.title}" (clickable to post)
│  └─ Message box (if provided):
│     ├─ Background: Light gray
│     ├─ Border radius: 8px
│     ├─ Padding: 12px
│     ├─ Content: {invitation.message}
│     └─ Italic, smaller font size
│
├─ Metadata Section:
│  ├─ Created date: "Sent on {date formatted}"
│  │  └─ Format: "Jan 15, 2026 at 2:30 PM"
│  │
│  ├─ Responded date (if applicable): "Accepted on {date}"
│  │  └─ Only show if status != PENDING
│  │
│  └─ Status badge:
│     ├─ Chip component with status text
│     ├─ Color: Based on status
│     ├─ Uppercase text: "PENDING" | "ACCEPTED" etc.
│     └─ Icon: Checkmark for ACCEPTED, X for REJECTED, etc.
│
└─ Actions Section:
   ├─ If type="sent":
   │  └─ If status="PENDING":
   │     ├─ Cancel button (red outline, medium)
   │     │  ├─ On click: Show confirmation dialog
   │     │  ├─ Dialog title: "Cancel Invitation?"
   │     │  ├─ Dialog content: "This cannot be undone"
   │     │  ├─ Confirm: Call onCancel()
   │     │  ├─ Loading: Show spinner on button
   │     │  └─ Error: Show error in dialog
   │     │
   │     └─ Or if other status: No action buttons
   │
   └─ If type="received":
      ├─ If status="PENDING":
      │  ├─ Accept button (green, filled, medium)
      │  │  ├─ On click: Show confirmation
      │  │  ├─ Confirmation: "Join {project.title}?"
      │  │  ├─ Confirm: Call onAccept()
      │  │  ├─ Success: Update UI immediately
      │  │  ├─ Loading: Show spinner
      │  │  └─ Error: Show error message
      │  │
      │  ├─ Reject button (red, outlined, medium)
      │  │  ├─ On click: Show confirmation
      │  │  ├─ Confirmation: "Decline this invitation?"
      │  │  ├─ Confirm: Call onReject()
      │  │  ├─ Loading: Show spinner
      │  │  └─ Error: Show error message
      │  │
      │  ├─ Buttons layout: Horizontal, space-between
      │  └─ And/or buttons side by side
      │
      └─ If status="ACCEPTED":
         ├─ View project link (button or link)
         └─ View profile link (link to inviter)

Animations:
├─ Entry animation:
│  ├─ Initial: opacity: 0, y: 20px
│  ├─ Animate: opacity: 1, y: 0px
│  ├─ Duration: 0.3s
│  └─ Used with Framer Motion motion.div
│
├─ Hover effect: Slight scale up (1.02x)
├─ Button hover: Change color shade
└─ Loading animation: Spinner rotation

Accessibility:
├─ ARIA labels on buttons
├─ Keyboard navigation (Tab, Enter)
├─ Focus states visible
├─ Color contrast meets WCAG standards
└─ Status conveyed not by color alone

Error Handling:
├─ Show error message if action fails
├─ Allow retry without re-entering form
├─ Display server error message to user
└─ Log errors to console (dev mode)

Edge Cases:
├─ Very long names: Truncate or wrap
├─ Very long project titles: Truncate with ellipsis
├─ Very long messages: Show "Read more" / expand
├─ Missing user data: Show "Unknown User"
└─ Network errors: Retry button, offline indicator
```

---

## 6. Data Flows & Integration

### 6.1 Frontend to Backend Data Flow

```
Frontend Component
│
├─ User Action: Click button, submit form, etc.
│
├─ Call API Service Method
│  └─ Example: invitationApiService.sendInvitation({...})
│
├─ API Service:
│  ├─ Validate input locally
│  ├─ Add JWT token to headers
│  ├─ Make HTTP request (Axios)
│  │  ├─ Method: POST/GET/PUT/DELETE
│  │  ├─ URL: Full API endpoint
│  │  ├─ Headers: { Authorization: "Bearer {token}", Content-Type: "application/json" }
│  │  └─ Body: Serialized request data (JSON)
│  │
│  └─ Return response to component
│
├─ Component receives response:
│  ├─ Check response.success boolean
│  │  ├─ If true: Update local state, show success message
│  │  ├─ If false: Show error message from response.message
│  │  └─ Get data from response.data
│  │
│  ├─ Update component state:
│  │  ├─ Loading state: false
│  │  ├─ Data state: response.data
│  │  ├─ Error state: null (if success)
│  │  └─ Refresh list if needed
│  │
│  └─ Re-render component with new data
│
└─ UI Updated: User sees new state

Error Flow:
├─ Catch error in API service or component
├─ Check error type:
│  ├─ Network error: "Connection failed"
│  ├─ 401 Unauthorized: Redirect to login
│  ├─ 403 Forbidden: "Permission denied"
│  ├─ 404 Not Found: "Resource not found"
│  ├─ 5xx Server error: "Server error, please retry"
│  └─ Validation error: Show specific validation message
│
├─ Update component error state
├─ Show error alert/toast to user
├─ Allow retry action
└─ Log error for debugging
```

### 6.2 Invitation Process Data Flow

```
Sender Flow (User A → User B):
1. User A on post detail page
2. Click "Invite Member"
3. Search and select User B
4. Enter optional custom message
5. Click "Send Invitation"
   │
   ├─ Frontend validation: Non-empty invitee
   ├─ POST /api/invitations
   │  └─ Body: { postId, inviteeId, message }
   │
   ├─ Backend processing:
   │  ├─ Verify JWT, extract userId (User A)
   │  ├─ Verify User A is post author
   │  ├─ Verify User B exists
   │  ├─ Check no duplicate invitation
   │  ├─ INSERT Invitation: { postId, inviterId: A, inviteeId: B, status: PENDING }
   │  ├─ INSERT Notification for User B
   │  └─ Return invitation object
   │
   ├─ Frontend updates:
   │  ├─ Show "Invitation sent!" message
   │  ├─ Close modal
   │  ├─ Refresh sent invitations list
   │  └─ Clear form
   │
   └─ User A sees invitation in "I Invited" tab with PENDING status

Receiver Flow (User B sees invitation):
1. User B logs in
2. Sees notification badge: "1 new invitation"
3. Navigate to /invitations
4. Click "They Invited Me" tab
5. See invitation from User A with PENDING status
6. Click "Accept" button
   │
   ├─ Show confirmation: "Join {project.title}?"
   ├─ User B confirms
   ├─ Frontend: POST /api/invitations/{id}/accept
   │
   ├─ Backend processing:
   │  ├─ Verify JWT, extract userId (User B)
   │  ├─ Verify User B is invitation.inviteeId
   │  ├─ Verify invitation status = PENDING
   │  ├─ UPDATE Invitation: { status: ACCEPTED, respondedAt: NOW() }
   │  ├─ Add User B to team
   │  ├─ INSERT Notification for User A: "User B accepted your invitation"
   │  └─ Return updated invitation
   │
   ├─ Frontend updates:
   │  ├─ Show "Joined team!" message
   │  ├─ Update invitation card status to green ACCEPTED
   │  ├─ Refresh lists
   │  └─ Update stats
   │
   ├─ User B can now:
   │  ├─ Access chatroom
   │  ├─ View team members
   │  ├─ Participate in project
   │  └─ See in "They Invited Me" as ACCEPTED
   │
   └─ User A sees:
      ├─ Notification: "User B accepted"
      └─ Invitation updated to ACCEPTED in "I Invited" tab

Alternative: User B Rejects:
6. Click "Reject" button
   │
   ├─ Show confirmation
   ├─ User B confirms
   ├─ Frontend: POST /api/invitations/{id}/reject
   │
   ├─ Backend: UPDATE Invitation: { status: REJECTED, respondedAt: NOW() }
   │
   └─ Frontend: Show "Declined" message, update invitation to REJECTED status
```

---

## 7. Summary & Key Takeaways

### Database Design:
- 7 main tables: User, Post, Invitation, Application, Notification, Chatroom, ChatMessage
- LinkedIn-style relationships
- Efficient indexing for fast queries
- Soft deletes for data retention

### Frontend Pages:
- 20+ pages covering all user flows
- Authentication (login, register)
- Content creation (posts, applications)
- Primary feature: Invitations dashboard with two-tab layout
- Profile management, settings, chat, forums

### Key Workflows:
- Registration: 4-step multi-step form
- Invitation sending: Author → Invitee
- Invitation acceptance: Create connection, join team
- Project closure: Auto-disconnect all members
- Real-time notifications on key actions

### Component Architecture:
- Reusable, composable components
- Clean separation of concerns
- Service layer for API integration
- Context for global state
- Responsive, animated UI with MUI + Framer Motion

This comprehensive documentation provides developers with complete specifications for building the entire system.
```

