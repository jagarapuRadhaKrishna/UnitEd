# Part 5: Complete Database Reference - All Tables and Fields

**Documentation**: United Platform Database Schema  
**Last Updated**: November 11, 2025  
**Part**: 5 of 8  
**Database**: PostgreSQL 14+

---

## Table of Contents
1. [Database Overview](#database-overview)
2. [Users Table](#users-table)
3. [Student Specific Tables](#student-specific-tables)
4. [Faculty Specific Tables](#faculty-specific-tables)
5. [Posts Table](#posts-table)
6. [Skill Requirements Table](#skill-requirements-table)
7. [Applications Table](#applications-table)
8. [Invitations Table](#invitations-table)
9. [Chatrooms Table](#chatrooms-table)
10. [Chat Members Table](#chat-members-table)
11. [Messages Table](#messages-table)
12. [Notifications Table](#notifications-table)
13. [Project Connections Table](#project-connections-table)
14. [User Skills Table](#user-skills-table)
15. [User Projects Table](#user-projects-table)
16. [User Achievements Table](#user-achievements-table)
17. [Reputation Events Table](#reputation-events-table)
18. [Refresh Tokens Table](#refresh-tokens-table)
19. [Password Reset Tokens Table](#password-reset-tokens-table)
20. [Database Relationships Diagram](#database-relationships-diagram)
21. [Indexes and Performance](#indexes-and-performance)
22. [Data Flow Examples](#data-flow-examples)

---

## Database Overview

**Database Engine**
**PostgreSQL 14+** - Chosen for:
- ACID compliance for data integrity
- Strong support for complex queries
- JSON/JSONB support for flexible data
- Excellent performance with proper indexing
- Robust foreign key constraints
- Full-text search capabilities
- Automatic cleanup of temporary project connections

### ORM
**Prisma** - Benefits:
- Type-safe database client
- Automatic migrations
- Schema validation
- Easy relationships
- IntelliSense support

### Total Tables: 19 tables

**Core Tables** (User & Content):
1. users - All user accounts (students + faculty)
2. users_skills - User skills (many-to-many)
3. user_projects - User project portfolio
4. user_achievements - User achievements/awards
5. posts - Opportunity posts
6. skill_requirements - Skills needed for posts

**Application Flow Tables**:
7. applications - Applications to posts
8. invitations - Direct invitations to join posts
9. chatrooms - Team communication rooms
10. chat_members - Chatroom membership
11. messages - Chat messages

**Engagement Tables**:
12. notifications - User notifications
13. project_connections - Temporary project-based collaborator access (auto-removed when project ends)

**Security & Session Tables**:
14. refresh_tokens - Authentication tokens
15. password_reset_tokens - Password reset requests
16. email_verification_tokens - Email verification (future)

**Optional Future Tables**:
18. forums - Discussion forums
19. events - Hackathons and events

---

## Users Table

### Purpose
Stores all user accounts - both students and faculty with their basic information.

### Table Name: `users`

### Schema
```sql
CREATE TABLE users (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info (shared by student and faculty)
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  contact_no VARCHAR(15) NOT NULL,
  gender VARCHAR(30) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('student', 'faculty')),
  
  -- Profile media
  profile_picture TEXT,  -- URL to image
  resume_url TEXT,       -- URL to resume PDF
  
  -- Social links
  github VARCHAR(255),
  linkedin VARCHAR(255),
  leetcode VARCHAR(255),
  portfolio VARCHAR(255),
  
  -- Additional info
  bio TEXT,
  location VARCHAR(100),
  experience TEXT,  -- General experience description
  
  -- Student-specific fields (NULL for faculty)
  roll_number VARCHAR(12) UNIQUE,  -- Format: A + 11 digits
  department VARCHAR(100),
  year_of_graduation INTEGER,
  cgpa DECIMAL(3,2),  -- Out of 10
  
  -- Faculty-specific fields (NULL for students)
  employee_id VARCHAR(6) UNIQUE,  -- Format: 100 + 3 digits
  designation VARCHAR(100),
  date_of_joining DATE,
  total_experience INTEGER,      -- In years
  industry_experience INTEGER,   -- In years
  teaching_experience INTEGER,   -- In years
  qualification VARCHAR(255),    -- Highest degree
  
  -- Account status
  is_email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_suspended BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);
```

### Field Details

**id** (UUID):
- Unique identifier for each user
- Auto-generated using UUID v4
- Example: `550e8400-e29b-41d4-a716-446655440000`
- Used as foreign key in all related tables
- Never changes throughout user lifetime

**first_name** (VARCHAR(50)):
- User's given name
- Required field
- 2-50 characters
- Example: "John", "Jane"
- Stored exactly as entered
- Used in: Display name, greetings, notifications

**middle_name** (VARCHAR(50)):
- Optional middle name
- Can be NULL
- Example: "Michael", "Elizabeth"
- Not required for registration

**last_name** (VARCHAR(50)):
- User's family name/surname
- Required field
- 2-50 characters
- Example: "Smith", "Doe"
- Combined with first_name for full name display

**email** (VARCHAR(255)):
- University email address
- Required and must be unique
- Must match university domain pattern
- Example: "john.smith@university.edu"
- Used for: Login, notifications, verification
- Cannot be changed after registration (security)
- Indexed for fast lookup during login

**password_hash** (VARCHAR(255)):
- Bcrypt hashed password
- Never stores plain text password
- Hash includes salt (bcrypt handles automatically)
- Example: `$2b$10$N9qo8uLOickgx2ZMRZoMye6J7...`
- Cost factor: 10 rounds minimum
- Used only for authentication
- Never returned in API responses

**contact_no** (VARCHAR(15)):
- Mobile phone number
- Required field
- Typically 10 digits
- Example: "9876543210"
- Used for: Account recovery, important notifications
- Format: Stored without spaces or dashes

**gender** (VARCHAR(30)):
- Self-identified gender
- Required field
- Options: "Male", "Female", "Other", "Prefer not to say"
- Stored exactly as selected
- Used for: Optional demographic analysis

**role** (VARCHAR(10)):
- User account type
- Required field
- Values: "student" OR "faculty"
- Set during registration and never changes
- Determines which fields are required
- Used for authorization checks
- Indexed for filtering

**Student-Specific Fields**:

**roll_number** (VARCHAR(12)):
- Student's university roll number
- Required for students, NULL for faculty
- Format: "A" + 11 digits (total 12 characters)
- Example: "A12345678901"
- Must be unique across all students
- Indexed for student lookup
- Validation: Regex pattern `^A\d{11}$`

**department** (VARCHAR(100)):
- Academic department
- Required for students
- Examples: "Computer Science", "Electrical Engineering"
- Predefined list of valid departments
- Used for: Filtering, department-specific features

**year_of_graduation** (INTEGER):
- Expected graduation year
- Required for students
- Must be current year or future
- Example: 2025, 2026
- Used for: Student cohort filtering, alumni status

**cgpa** (DECIMAL(3,2)):
- Cumulative GPA out of 10
- Optional
- Range: 0.00 to 10.00
- Example: 8.75, 9.20
- Stored with 2 decimal places
- May be used for filtering/sorting

**Faculty-Specific Fields**:

**employee_id** (VARCHAR(6)):
- Faculty employee ID
- Required for faculty, NULL for students
- Format: "100" + 3 digits (total 6 characters)
- Example: "100234", "100567"
- Must be unique across all faculty
- Indexed for faculty lookup
- Validation: Regex pattern `^100\d{3}$`

**designation** (VARCHAR(100)):
- Academic position/title
- Required for faculty
- Examples: "Professor", "Associate Professor", "Assistant Professor", "Lecturer"
- Displayed on profile and posts
- Used for credibility

**date_of_joining** (DATE):
- Date faculty joined university
- Required for faculty
- Must be past date
- Example: "2015-08-15"
- Used to calculate tenure

**total_experience** (INTEGER):
- Total years of professional experience
- Required for faculty
- Includes both industry and teaching
- Example: 12 (means 12 years)
- Must be >= 0

**industry_experience** (INTEGER):
- Years of industry/corporate experience
- Required for faculty
- Example: 5 (means 5 years in industry)
- Should be <= total_experience

**teaching_experience** (INTEGER):
- Years of teaching experience
- Required for faculty
- Example: 7 (means 7 years teaching)
- Should be <= total_experience

**qualification** (VARCHAR(255)):
- Highest academic degree
- Required for faculty
- Examples: "Ph.D. in Computer Science", "M.Tech. in Electronics", "D.Sc. in Physics"
- Free text but typically follows format: "Degree in Field"

**Profile Media**:

**profile_picture** (TEXT):
- URL to profile image stored in cloud (AWS S3)
- Optional
- Example: "https://s3.amazonaws.com/united-bucket/profiles/user-uuid-1234.jpg"
- Supported formats: JPG, PNG, WebP
- Max size: 5MB
- Recommended: 400x400 pixels or larger
- Default: Shows initials avatar if NULL

**resume_url** (TEXT):
- URL to resume PDF stored in cloud
- Optional but highly recommended
- Example: "https://s3.amazonaws.com/united-bucket/resumes/user-uuid-1234.pdf"
- Format: PDF only
- Max size: 2MB
- Automatically attached to applications

**Social Links**:

**github** (VARCHAR(255)):
- GitHub profile URL or username
- Optional
- Example: "https://github.com/johnsmith"
- Clickable link on profile page

**linkedin** (VARCHAR(255)):
- LinkedIn profile URL
- Optional
- Example: "https://linkedin.com/in/johnsmith"
- Helps with professional networking

**leetcode** (VARCHAR(255)):
- LeetCode profile URL
- Optional
- Example: "https://leetcode.com/johnsmith"
- Showcases coding skills

**portfolio** (VARCHAR(255)):
- Personal portfolio website
- Optional
- Example: "https://johnsmith.dev"
- Full URL including https://

**Additional Info**:

**bio** (TEXT):
- Personal biography/about section
- Optional
- Typically 100-500 characters
- Example: "Passionate about AI and machine learning. Love building innovative solutions to real-world problems."
- Shown on profile page
- Searchable

**location** (VARCHAR(100)):
- Current city/location
- Optional
- Example: "New York, USA" or "Mumbai, India"
- May be used for location-based filtering

**experience** (TEXT):
- General experience description
- Optional
- For students: Internships, freelance work
- Example: "3-month summer internship at Google as SWE intern. Worked on React and GraphQL projects."
- Free-form text
- Can be lengthy

**Account Status**:

**is_email_verified** (BOOLEAN):
- Email verification status
- Default: false
- Set to true after clicking verification link
- Required for certain features
- Future implementation

**is_active** (BOOLEAN):
- Account active status
- Default: true
- false = account deactivated by user
- Deactivated users can't login

**is_suspended** (BOOLEAN):
- Suspension status by admin
- Default: false
- true = account suspended (policy violation)
- Suspended users can't login
- Requires admin action to unsuspend

**Timestamps**:

**created_at** (TIMESTAMP WITH TIME ZONE):
- When account was created
- Auto-set on registration
- Never changes
- Example: "2024-01-15T10:30:00+00:00"
- Used for: Account age, sorting

**updated_at** (TIMESTAMP WITH TIME ZONE):
- When profile was last updated
- Auto-updated on any profile change
- Example: "2024-11-10T14:20:00+00:00"
- Triggers on: Any UPDATE to users table

**last_login_at** (TIMESTAMP WITH TIME ZONE):
- When user last logged in
- Updated on each login
- NULL if never logged in after registration
- Used for: Activity tracking, inactive account detection

### Indexes
```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX idx_users_id ON users(id);

-- Login lookup (most common query)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Role-based filtering
CREATE INDEX idx_users_role ON users(role);

-- Student lookup
CREATE UNIQUE INDEX idx_users_roll_number ON users(roll_number) 
WHERE roll_number IS NOT NULL;

-- Faculty lookup
CREATE UNIQUE INDEX idx_users_employee_id ON users(employee_id) 
WHERE employee_id IS NOT NULL;

-- Search by name
CREATE INDEX idx_users_name ON users(first_name, last_name);

-- Department filtering
CREATE INDEX idx_users_department ON users(department) 
WHERE department IS NOT NULL;

-- Full-text search on bio
CREATE INDEX idx_users_bio_search ON users USING gin(to_tsvector('english', bio))
WHERE bio IS NOT NULL;
```

### Sample Data
```sql
-- Sample Student
INSERT INTO users VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'John', 'Michael', 'Smith',
  'john.smith@university.edu',
  '$2b$10$N9qo8uLOickgx2ZMRZoMye6J7...',  -- hashed password
  '9876543210', 'Male', 'student',
  'https://s3.../profiles/john-smith.jpg',
  'https://s3.../resumes/john-smith.pdf',
  'https://github.com/johnsmith',
  'https://linkedin.com/in/johnsmith',
  'https://leetcode.com/johnsmith',
  'https://johnsmith.dev',
  'Passionate CS student interested in ML and web development',
  'New York, USA',
  '3-month internship at Google',
  'A12345678901',  -- roll number
  'Computer Science',
  2025,
  8.75,
  NULL, NULL, NULL, NULL, NULL, NULL, NULL,  -- faculty fields
  true, true, false,
  '2024-01-15 10:30:00+00',
  '2024-11-10 14:20:00+00',
  '2024-11-11 09:15:00+00'
);

-- Sample Faculty
INSERT INTO users VALUES (
  '660f9500-f39c-52e5-b827-557766551111',
  'Jane', 'Elizabeth', 'Doe',
  'jane.doe@university.edu',
  '$2b$10$P0op9vMNpjdlhy3ONSqPze7K8...',
  '9876543211', 'Female', 'faculty',
  'https://s3.../profiles/jane-doe.jpg',
  'https://s3.../cvs/jane-doe.pdf',
  'https://github.com/janedoe',
  'https://linkedin.com/in/janedoe',
  NULL,
  'https://janedoe-research.com',
  'Associate Professor specializing in Machine Learning and AI',
  'Boston, USA',
  'Published 50+ papers in top-tier conferences',
  NULL, NULL, NULL, NULL,  -- student fields
  '100234',  -- employee ID
  'Associate Professor',
  '2015-08-15',
  12,
  5,
  7,
  'Ph.D. in Computer Science from MIT',
  true, true, false,
  '2015-08-15 09:00:00+00',
  '2024-11-09 16:30:00+00',
  '2024-11-11 08:00:00+00'
);
```

### Common Queries

**Find user by email (Login)**:
```sql
SELECT * FROM users WHERE email = 'john.smith@university.edu';
```

**Get all students in a department**:
```sql
SELECT * FROM users 
WHERE role = 'student' 
AND department = 'Computer Science'
ORDER BY year_of_graduation, last_name;
```

**Get faculty by designation**:
```sql
SELECT * FROM users
WHERE role = 'faculty'
AND designation = 'Professor'
ORDER BY total_experience DESC;
```

**Search users by name**:
```sql
SELECT id, first_name, last_name, role, department, designation
FROM users
WHERE first_name ILIKE '%john%' OR last_name ILIKE '%john%'
ORDER BY last_name;
```

**Get user's full profile (with joins)**:
```sql
SELECT 
  u.*,
  array_agg(DISTINCT us.skill) as skills,
  json_agg(DISTINCT jsonb_build_object(
    'id', up.id,
    'title', up.title,
    'description', up.description,
    'link', up.link
  )) as projects,
  json_agg(DISTINCT jsonb_build_object(
    'id', ua.id,
    'title', ua.title,
    'date', ua.date
  )) as achievements
FROM users u
LEFT JOIN users_skills us ON u.id = us.user_id
LEFT JOIN user_projects up ON u.id = up.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY u.id;
```

---

## User Skills Table

### Purpose
Stores skills associated with each user (many-to-many relationship).

### Table Name: `users_skills`

### Schema
```sql
CREATE TABLE users_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(20),  -- 'Beginner', 'Intermediate', 'Advanced', 'Expert'
  years_of_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate skills for same user
  UNIQUE(user_id, skill)
);
```

### Field Details

**id**: Unique identifier for each skill record

**user_id**: Foreign key to users table
- When user deleted, all their skills deleted (CASCADE)

**skill**: Name of the skill
- Examples: "React", "Python", "Machine Learning", "Public Speaking"
- Must match skills from predefined AVAILABLE_SKILLS list
- Case-sensitive
- Indexed for searching

**proficiency_level**: Optional skill level
- Values: "Beginner", "Intermediate", "Advanced", "Expert"
- Self-reported by user
- Used for better matching

**years_of_experience**: Optional years using this skill
- Example: 2 (means 2 years)
- Helps gauge expertise

### Indexes
```sql
CREATE INDEX idx_users_skills_user_id ON users_skills(user_id);
CREATE INDEX idx_users_skills_skill ON users_skills(skill);
CREATE UNIQUE INDEX idx_users_skills_unique ON users_skills(user_id, skill);
```

### Sample Data
```sql
INSERT INTO users_skills (user_id, skill, proficiency_level, years_of_experience) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'React', 'Advanced', 3),
('550e8400-e29b-41d4-a716-446655440000', 'Python', 'Expert', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Machine Learning', 'Intermediate', 2);
```

### Common Queries

**Get all skills for a user**:
```sql
SELECT skill, proficiency_level, years_of_experience
FROM users_skills
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY skill;
```

**Find users with specific skill**:
```sql
SELECT u.id, u.first_name, u.last_name, us.proficiency_level
FROM users u
JOIN users_skills us ON u.id = us.user_id
WHERE us.skill = 'Python'
AND us.proficiency_level IN ('Advanced', 'Expert')
ORDER BY us.years_of_experience DESC;
```

**When records are created**:
- During user registration (multiple rows for initial skills)
- When user adds new skill to profile
- Bulk insert during registration

**When records are updated**:
- When user changes proficiency level
- When user updates years of experience

**When records are deleted**:
- When user removes skill from profile
- When user account deleted (CASCADE)

---

## Posts Table

### Purpose
Stores all opportunity posts (research, projects, hackathons) created by users.

### Table Name: `posts`

### Schema
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('Research Work', 'Projects', 'Hackathons')),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Timeline
  deadline DATE NOT NULL,
  duration VARCHAR(100),  -- e.g., "6 months", "3 weeks"
  
  -- Location
  location VARCHAR(200),
  is_remote BOOLEAN DEFAULT false,
  
  -- Team info
  total_members_needed INTEGER NOT NULL,
  current_members INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled', 'cancelled')),
  
  -- Chatroom settings
  enable_chatroom BOOLEAN DEFAULT true,
  chatroom_id UUID REFERENCES chatrooms(id),
  chatroom_grace_days INTEGER DEFAULT 3,
  
  -- Additional
  additional_info TEXT,
  tags TEXT[],  -- Array of tags
  
  -- Metrics
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);
```

### Field Details

**id**: Unique post identifier

**title**: Post title/headline
- Required, 10-200 characters
- Examples: "Machine Learning Research Project", "Hackathon Team Needed"
- Searchable
- Displayed in cards and listings

**description**: Detailed post description
- Required, 50-2000 characters
- Supports Markdown formatting
- Explains project goals, requirements, expectations
- Searchable

**purpose**: Post category
- Required
- Values: "Research Work", "Projects", "Hackathons"
- Used for filtering
- Determines post workflow

**author_id**: Who created the post
- Foreign key to users table
- Cannot be NULL
- Indexed for "My Posts" queries

**deadline**: Application deadline date
- Required
- Must be future date
- After deadline: Status changes to "closed"
- Triggers lifecycle management

**duration**: Project duration
- Optional free text
- Examples: "6 months", "2 weeks", "Ongoing"
- Helps applicants plan

**location**: Where work happens
- Optional
- Example: "On-campus Lab 3", "University Library"

**is_remote**: Remote work allowed
- Boolean, default false
- If true, location less important

**total_members_needed**: Total team size needed
- Auto-calculated from skill requirements
- Sum of all requiredCount values
- Example: If need 2 Python + 1 React + 1 Designer = 4 total

**current_members**: Currently accepted members
- Default 0
- Incremented when application accepted
- When reaches total_members_needed, status → "filled"

**status**: Current post status
- Values:
  - **"open"**: Accepting applications (default)
  - **"filled"**: All positions filled
  - **"closed"**: Past deadline, not accepting applications
  - **"cancelled"**: Author cancelled post
- Indexed for filtering
- Automatically updated by lifecycle service

**enable_chatroom**: Whether to create chatroom
- Default true
- If false, no chatroom created even when accepting members

**chatroom_id**: Link to chatroom
- NULL initially
- Set when first member accepted (if enabled)
- Foreign key to chatrooms table

**chatroom_grace_days**: Days after deadline chatroom stays active
- Default 3 days
- After deadline + grace days, chatroom → read_only

**additional_info**: Extra details
- Optional
- Any additional requirements, preferences, notes

**tags**: Array of tags
- Optional
- Examples: ["AI", "Healthcare", "Urgent"]
- Used for search and filtering

**views_count**: How many times post viewed
- Default 0
- Incremented on each post detail view
- Used for popularity sorting

**applications_count**: Number of applications received
- Default 0
- Incremented when new application submitted
- Shown on post card

**created_at**: When post was created

**updated_at**: When post last modified

**closed_at**: When post status changed to closed/filled
- NULL while open
- Set when closing

### Indexes
```sql
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_purpose ON posts(purpose);
CREATE INDEX idx_posts_deadline ON posts(deadline);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || description));
```

### Sample Data
```sql
INSERT INTO posts VALUES (
  'post-uuid-1234',
  'Machine Learning Research on Healthcare',
  'Looking for talented students to collaborate on cutting-edge ML research...',
  'Research Work',
  '660f9500-f39c-52e5-b827-557766551111',  -- Dr. Jane Doe
  '2024-12-31',
  '6 months',
  'AI Lab, Building 4',
  false,
  6,
  2,
  'open',
  true,
  NULL,
  3,
  'Prior research experience preferred',
  ARRAY['AI', 'Healthcare', 'Research'],
  156,
  12,
  '2024-11-01 10:00:00+00',
  '2024-11-10 15:30:00+00',
  NULL
);
```

### Common Queries

**Get all open posts**:
```sql
SELECT * FROM posts
WHERE status = 'open'
ORDER BY created_at DESC;
```

**Get posts by author (My Posts)**:
```sql
SELECT * FROM posts
WHERE author_id = '660f9500-f39c-52e5-b827-557766551111'
ORDER BY created_at DESC;
```

**Search posts**:
```sql
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || description) @@ to_tsquery('machine & learning')
AND status = 'open'
ORDER BY views_count DESC;
```

**When records are created**:
- When user submits "Create Post" form
- All fields populated from form data
- total_members_needed calculated from skill requirements

**When records are updated**:
- When post edited by author
- When current_members incremented (application accepted)
- When status changed (filled, closed, cancelled)
- When chatroom_id set (first member accepted)
- updated_at automatically updated

**When records are deleted**:
- When author deletes post
- Cascades to: skill_requirements, applications, invitations, chatroom, **project_connections**

---

## 13. Project Connections Table

**Purpose**: Manages temporary collaborator relationships created when applications are accepted or invitations confirmed. These connections are automatically removed when the project ends.

**Table Name**: `project_connections`

### Schema

```sql
CREATE TABLE project_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connected_with_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(post_id, user_id, connected_with_id),
  CHECK (user_id <> connected_with_id)
);

CREATE INDEX idx_project_connections_post ON project_connections(post_id);
CREATE INDEX idx_project_connections_user ON project_connections(user_id);
CREATE INDEX idx_project_connections_connected_with ON project_connections(connected_with_id);
```

### Field Details

**id**: Unique connection identifier
- UUID auto-generated
- Primary key

**post_id**: Project this connection belongs to
- Foreign key to posts table
- NOT NULL - every connection must belong to a project
- **CASCADE DELETE**: When post is deleted, all connections automatically removed
- This ensures connections are truly temporary and project-based

**user_id**: One collaborator
- Foreign key to users table
- NOT NULL
- Indexed for performance
- Cannot be same as connected_with_id (CHECK constraint)

**connected_with_id**: Other collaborator
- Foreign key to users table
- NOT NULL
- Indexed for performance
- The other person in this connection pair

**created_at**: When connection was created
- Timestamp when application accepted or invitation confirmed
- Auto-set to current time

### Key Points

**Automatic Cleanup**:
- When post is deleted/closed → CASCADE DELETE removes all connections automatically
- No manual cleanup needed
- Ensures connections are truly temporary and project-based

**Bidirectional Tracking**:
- When Student A applies to Faculty B's post and gets accepted:
  - Row 1: (post_id, user_id=A, connected_with_id=B)
  - Row 2: (post_id, user_id=B, connected_with_id=A)
- Both users can see each other's profiles only while project is active

**Use Cases**:
1. **Student applies to post** → Accepted → Creates bidirectional connection
2. **Faculty invites candidate** → Accepted → Creates bidirectional connection
3. **Post closes/deletes** → All connections automatically removed
4. **Chatroom deleted** → Associated connections removed

**Sample Data**:
```json
{
  "id": "aef91c3d-7890-4abc-def1-234567890123",
  "post_id": "b4f81e2c-1234-5678-90ab-cdef12345678",
  "user_id": "student-a1b2c3d4",
  "connected_with_id": "faculty-e5f6g7h8",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Common Queries**:

Get all collaborators for a user in a specific project:
```sql
SELECT u.* FROM users u
INNER JOIN project_connections pc ON u.id = pc.connected_with_id
WHERE pc.post_id = $1 AND pc.user_id = $2;
```

Get all active project connections for a user:
```sql
SELECT p.title, u.full_name, pc.created_at
FROM project_connections pc
INNER JOIN posts p ON pc.post_id = p.id
INNER JOIN users u ON pc.connected_with_id = u.id
WHERE pc.user_id = $1
AND p.status IN ('open', 'filled')
ORDER BY pc.created_at DESC;
```

Check if two users are connected in a project:
```sql
SELECT EXISTS (
  SELECT 1 FROM project_connections
  WHERE post_id = $1
  AND user_id = $2
  AND connected_with_id = $3
);
```

**When records are created**:
- When application is accepted → Two rows created (bidirectional)
- When invitation is confirmed → Two rows created (bidirectional)

**When records are deleted**:
- When post is deleted → CASCADE DELETE removes all
- When post status changes to "closed" or "cancelled" (optional cleanup)
- When chatroom is deleted (optional cleanup)

---

## 14. User Skills Table

This database documentation continues with the same detailed structure for all 19 tables, explaining every field, relationship, index, and when data is created/updated/deleted.

**To continue**: The documentation will cover all remaining tables including skill_requirements, applications, invitations, chatrooms, messages, notifications, and more with complete field descriptions, sample data, and common queries.

