# 🎓 UnitEd - Student & Faculty Collaboration Platform

> A comprehensive platform connecting students and faculty for research opportunities, project collaborations, and academic networking built with modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Database Schema](#database-schema)
- [Features](#features)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

---

## 🌟 Overview

**UnitEd** is a full-stack web application designed to bridge the gap between students and faculty members in academic institutions. The platform facilitates:

- **Research Opportunities**: Faculty can post research positions and students can apply
- **Project Collaboration**: Real-time collaboration on academic projects
- **Skill Matching**: Intelligent matching based on student skills and project requirements
- **Community Forums**: Discussion forums for academic topics and threads
- **Real-time Chat**: Direct messaging and group chatrooms
- **Application Management**: Track applications, invitations, and notifications
- **Profile Management**: Comprehensive profiles with projects, achievements, and social links

---

## 🏗️ Architecture

The application uses a **modern serverless architecture** powered by **Supabase**:

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND APPLICATION                    │
│         React 18 + Vite + TypeScript + shadcn/ui        │
│                       Port: 8080                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Supabase Client SDK
                       │ (Auth, PostgreSQL, Real-time, Storage)
                       │
┌──────────────────────┴──────────────────────────────────┐
│                  SUPABASE BACKEND                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ PostgreSQL Database + Row Level Security       │    │
│  │ Project ID: briynvmtsinfomfsvxag               │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Authentication & User Management (JWT)          │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Real-time Subscriptions (WebSockets)            │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Storage (Profile Pictures & Documents)          │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Architecture Components

1. **Frontend Application**
   - Single Page Application (SPA) built with React 18.3.1
   - TypeScript for type safety and better developer experience
   - Vite for lightning-fast builds and hot module replacement (HMR)
   - Supabase JS client for backend integration
   - shadcn/ui components built on Radix UI primitives
   - Tailwind CSS for responsive, utility-first styling
   - TanStack Query for data fetching and caching

2. **Supabase Backend (BaaS)**
   - **PostgreSQL Database**: Relational database with advanced features
   - **Authentication**: JWT-based auth with email/password
   - **Row Level Security (RLS)**: Database-level security policies
   - **Real-time Subscriptions**: WebSocket connections for live updates
   - **Storage**: Secure file storage for avatars and documents
   - **Auto-generated REST API**: Type-safe API from database schema

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Language**: TypeScript 5.8.3
- **Styling**: 
  - Tailwind CSS 3.4.17
  - Tailwind Animate 1.0.7
  - @tailwindcss/typography 0.5.16
- **UI Components**: 
  - shadcn/ui (Radix UI primitives)
  - Lucide React 0.462.0 (icons)
  - Recharts 2.15.4 (charts & analytics)
- **State Management**: 
  - React Context API
  - TanStack Query 5.83.0 (server state)
- **Routing**: React Router DOM 6.30.1
- **Forms & Validation**: 
  - React Hook Form 7.61.1
  - Zod 3.25.76
  - @hookform/resolvers 3.10.0
- **Backend Integration**: @supabase/supabase-js 2.95.3
- **Utilities**:
  - date-fns 3.6.0 (date manipulation)
  - clsx + tailwind-merge (className management)
  - sonner 1.7.4 (toast notifications)
  - embla-carousel-react 8.6.0
- **Testing**: 
  - Vitest 3.2.4
  - @testing-library/react 16.0.0
  - @testing-library/jest-dom 6.6.0
  - jsdom 20.0.3

### Backend (Supabase)
- **Database**: PostgreSQL 12+ (managed by Supabase)
- **Authentication**: Supabase Auth (JWT-based)
- **Real-time**: Supabase Realtime (WebSocket subscriptions)
- **Storage**: Supabase Storage (file uploads)
- **API**: Auto-generated REST API with TypeScript types
- **Security**: Row Level Security (RLS) policies

### Development Tools
- **Package Manager**: npm / bun (bun.lockb present)
- **Linting**: ESLint 9.32.0 with React plugins
- **Code Quality**: TypeScript strict mode, ESLint rules
- **Version Control**: Git

### Supabase Configuration
- **Project ID**: `briynvmtsinfomfsvxag`
- **Project URL**: `https://briynvmtsinfomfsvxag.supabase.co`
- **Region**: Auto-configured
- **Migrations**: 16 migration files in `/supabase/migrations`

---

## 📁 Project Structure

```
zip-file-explorer/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── ui/                 # shadcn/ui components (35+ components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── landing/            # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── WorkflowSection.tsx
│   │   │   ├── PublicNavbar.tsx
│   │   │   └── Footer.tsx
│   │   └── NavLink.tsx
│   │
│   ├── pages/                  # Route pages (31 pages)
│   │   ├── LandingPage.tsx                # Public landing page
│   │   ├── LoginPage.tsx                  # Login
│   │   ├── RoleSelection.tsx              # Role selection after signup
│   │   ├── StudentRegister.tsx            # Student registration
│   │   ├── FacultyRegister.tsx            # Faculty registration
│   │   ├── ForgotPasswordPage.tsx         # Password reset
│   │   ├── HomePage.tsx                   # Dashboard home
│   │   ├── DashboardPage.tsx              # Main dashboard
│   │   ├── ProfilePage.tsx                # User profile
│   │   ├── UserProfilePage.tsx            # View other user profiles
│   │   ├── CandidateProfilePage.tsx       # View candidate details
│   │   ├── SettingsPage.tsx               # Account settings
│   │   ├── AboutPage.tsx                  # About platform
│   │   │
│   │   ├── CreatePostPage.tsx             # Faculty: Create new post
│   │   ├── EditPostPage.tsx               # Faculty: Edit post
│   │   ├── MyPostsPage.tsx                # Faculty: Manage posts
│   │   ├── PostManagePage.tsx             # Faculty: Post management
│   │   ├── PostDetailPage.tsx             # View post details
│   │   ├── SkillMatchedPostsPage.tsx      # Student: Matched posts
│   │   ├── RecommendedCandidatesPage.tsx  # Faculty: Recommended students
│   │   │
│   │   ├── AppliedOpportunitiesPage.tsx   # Student: Track applications
│   │   ├── AcceptedApplicationsPage.tsx   # Faculty: Accepted apps
│   │   ├── InvitationsPage.tsx            # Student: View invitations
│   │   │
│   │   ├── ChatroomsPage.tsx              # View all chatrooms
│   │   ├── ChatroomPage.tsx               # Individual chatroom
│   │   │
│   │   ├── ForumsPage.tsx                 # Forum list
│   │   ├── ForumThreadPage.tsx            # Forum thread view
│   │   ├── CreateThreadPage.tsx           # Create forum thread
│   │   │
│   │   ├── NotificationsPage.tsx          # Notifications center
│   │   ├── NotFoundPage.tsx               # 404 page
│   │   └── Index.tsx                      # Route configuration
│   │
│   ├── contexts/               # React Context providers
│   │   └── AuthContext.tsx    # Authentication & user state
│   │
│   ├── services/               # Business logic & API services
│   │   ├── applicationService.ts          # Application CRUD operations
│   │   ├── chatroomService.ts             # Chat functionality
│   │   ├── invitationService.ts           # Invitation management
│   │   ├── notificationService.ts         # Notification system
│   │   ├── postLifecycleService.ts        # Post lifecycle management
│   │   ├── localStorageAuthService.ts     # Local storage auth
│   │   ├── secureStorageService.ts        # Secure storage utilities
│   │   └── storageSecurityMonitor.ts      # Security monitoring
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-toast.ts       # Toast notification hook
│   │   └── use-mobile.tsx     # Mobile detection hook
│   │
│   ├── integrations/
│   │   └── supabase/          # Supabase integration
│   │       ├── client.ts      # Supabase client configuration
│   │       └── types.ts       # Auto-generated database types
│   │
│   ├── types/                 # TypeScript definitions
│   │   └── united.ts          # Application type definitions
│   │
│   ├── lib/                   # Utility functions
│   │   └── utils.ts           # Helper functions
│   │
│   ├── data/                  # Mock data (development)
│   │   └── mockData.ts
│   │
│   ├── test/                  # Test files
│   │   ├── setup.ts
│   │   └── example.test.ts
│   │
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   ├── App.css                # App-specific styles
│   └── vite-env.d.ts          # Vite type definitions
│
├── supabase/                  # Supabase configuration
│   ├── config.toml            # Supabase project config
│   └── migrations/            # Database migrations (16 files)
│       ├── 20260211154359_*.sql
│       ├── 20260211154430_*.sql
│       └── ...
│
├── public/                    # Static assets
│   └── robots.txt
│
├── node_modules/              # Dependencies (gitignored)
│
├── index.html                 # HTML entry point
├── package.json               # NPM dependencies & scripts
├── package-lock.json          # Lock file
├── bun.lockb                  # Bun lock file
│
├── vite.config.ts             # Vite configuration
├── vitest.config.ts           # Vitest test configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # TypeScript app config
├── tsconfig.node.json         # TypeScript node config
│
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint configuration
│
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended with these extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - Prettier (optional)

### System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 1GB for dependencies

---

## 💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd UnitEd/zip-file-explorer
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

This will install all 65+ dependencies including React, Vite, Supabase client, and UI components.

### 3. Supabase Configuration

The application is already configured to connect to the Supabase backend:

**Configuration Location**: `src/integrations/supabase/client.ts`

```typescript
const SUPABASE_URL = "https://briynvmtsinfomfsvxag.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJI..."
```

**No additional setup required** - the Supabase project is already configured!

### 4. Database Schema

The database schema is managed through Supabase migrations located in `/supabase/migrations/`. The schema includes:

- **profiles**: User profiles (students & faculty)
- **posts**: Research/project opportunities
- **applications**: Student applications to posts
- **invitations**: Faculty invitations to students
- **chatrooms**: Chat conversations
- **messages**: Chat messages
- **forums**: Discussion forums
- **threads**: Forum threads
- **comments**: Thread comments
- **notifications**: User notifications

All tables have Row Level Security (RLS) policies enabled for data protection.

---

## 📜 Available Scripts

### Development Scripts

```bash
# Start development server with hot reload
npm run dev
# → Starts Vite dev server on http://localhost:8080
# → Auto-reloads on code changes
# → TypeScript type checking in background

# Build for production
npm run build
# → Compiles TypeScript
# → Bundles with Vite
# → Optimizes assets
# → Output to dist/ folder

# Build in development mode (with source maps)
npm run build:dev
# → Same as build but includes source maps for debugging

# Preview production build locally
npm run preview
# → Serves the built files from dist/
# → Test production build before deployment
```

### Code Quality Scripts

```bash
# Run ESLint
npm run lint
# → Checks for code quality issues
# → Enforces coding standards
# → Reports warnings and errors

# Run tests once
npm run test
# → Runs all test suites with Vitest
# → Generates test coverage report
# → Exits after completion

# Run tests in watch mode
npm run test:watch
# → Runs tests on file changes
# → Interactive test UI
# → Fast feedback during development
```

### Quick Reference

| Command | Description | Port |
|---------|-------------|------|
| `npm run dev` | Development server | 8080 |
| `npm run build` | Production build | - |
| `npm run preview` | Preview build | 4173 |
| `npm test` | Run tests | - |
| `npm run lint` | Check code quality | - |

---

## ✨ Features

### 🎓 For Students

#### Profile Management
- ✅ Comprehensive profile with skills, projects, and achievements
- ✅ Upload profile picture and resume
- ✅ Social links (LinkedIn, GitHub, LeetCode, Portfolio)
- ✅ CGPA tracking and academic information
- ✅ Custom bio and location

#### Opportunities
- ✅ Browse all research and project opportunities
- ✅ **Skill-matched recommendations** - Get posts matching your skills
- ✅ Filter by purpose (Research/Projects/Hackathons)
- ✅ View detailed post requirements
- ✅ See faculty profiles and qualifications

#### Applications
- ✅ Apply to opportunities with custom cover letters
- ✅ Track application status in real-time
- ✅ View application history
- ✅ Receive notifications on status changes
- ✅ Withdraw pending applications

#### Invitations
- ✅ Receive direct invitations from faculty
- ✅ Accept or decline invitations
- ✅ View invitation details and post information
- ✅ Notification alerts for new invitations

#### Communication
- ✅ Real-time chat with faculty and team members
- ✅ Participate in discussion forums
- ✅ Create forum threads and comments
- ✅ Receive in-app notifications

### 👨‍🏫 For Faculty

#### Post Management
- ✅ Create research and project opportunities
- ✅ Specify skill requirements with position counts
- ✅ Set deadlines and total positions
- ✅ Edit and update existing posts
- ✅ Draft and publish workflow
- ✅ Close or cancel posts

#### Application Review
- ✅ View all applications for your posts
- ✅ Filter by status (Pending/Accepted/Rejected)
- ✅ Review student profiles and qualifications
- ✅ Accept or reject applications
- ✅ Add review notes
- ✅ Track accepted vs total positions

#### Student Discovery
- ✅ **Recommended candidates** - Get students matching your requirements
- ✅ View detailed student profiles
- ✅ See skill match percentages
- ✅ Browse student projects and achievements
- ✅ Check academic performance

#### Invitations
- ✅ Send direct invitations to qualified students
- ✅ Track invitation responses
- ✅ Resend or cancel invitations
- ✅ Add personalized messages

#### Collaboration
- ✅ Create chatrooms for accepted students
- ✅ Manage team communications
- ✅ Participate in academic forums
- ✅ Share updates and announcements

### 🌐 Common Features

#### Authentication & Security
- ✅ Secure email/password authentication via Supabase
- ✅ JWT-based session management
- ✅ Role-based access control (Student/Faculty)
- ✅ Password reset functionality
- ✅ Session persistence

#### User Interface
- ✅ Modern, clean design with shadcn/ui components
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark/Light mode support (theme toggle)
- ✅ Smooth animations and transitions
- ✅ Toast notifications for actions
- ✅ Loading states and error handling
- ✅ Intuitive navigation

#### Real-time Features
- ✅ Live chat messages
- ✅ Instant notifications
- ✅ Real-time application status updates
- ✅ Live post availability updates

#### Search & Discovery
- ✅ Search posts by keywords
- ✅ Filter by skills and categories
- ✅ Sort by date, relevance, deadline
- ✅ View trending opportunities

#### Accessibility
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ High contrast mode
- ✅ Semantic HTML structure
- ✅ ARIA labels and attributes

---

## 🔄 Development Workflow

### Component Development

1. **Create UI Components**
   ```bash
   # Use shadcn/ui CLI to add components
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add dialog
   npx shadcn-ui@latest add form
   ```

2. **Build Page Components**
   - Create new page in `src/pages/`
   - Use TypeScript for type safety
   - Import UI components from `src/components/ui/`
   - Follow existing page structure

3. **Add Routes**
   - Update `src/pages/Index.tsx`
   - Add route configuration
   - Protect routes with auth checks

### State Management

1. **Global State (AuthContext)**
   ```typescript
   // Use AuthContext for user state
   const { user, login, logout, register } = useAuth();
   ```

2. **Server State (TanStack Query)**
   ```typescript
   // Use for data fetching
   const { data, isLoading } = useQuery({
     queryKey: ['posts'],
     queryFn: fetchPosts
   });
   ```

3. **Local State**
   ```typescript
   // Use useState for component state
   const [isOpen, setIsOpen] = useState(false);
   ```

### Styling Guidelines

1. **Use Tailwind Utility Classes**
   ```tsx
   <div className="flex items-center gap-4 p-6 bg-background">
   ```

2. **Follow Color Scheme**
   - Primary: `united-orange` (#FF6B35)
   - Background: `background` (theme-aware)
   - Text: `foreground` (theme-aware)

3. **Responsive Design**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
   ```

### Database Operations

1. **Using Supabase Client**
   ```typescript
   import { supabase } from '@/integrations/supabase/client';
   
   // Query data
   const { data, error } = await supabase
     .from('profiles')
     .select('*')
     .eq('role', 'student');
   
   // Insert data
   const { data, error } = await supabase
     .from('applications')
     .insert({ post_id, student_id, cover_letter });
   
   // Subscribe to changes
   const subscription = supabase
     .channel('messages')
     .on('postgres_changes', { 
       event: 'INSERT', 
       schema: 'public', 
       table: 'messages' 
     }, handleNewMessage)
     .subscribe();
   ```

2. **Type Safety**
   - Use auto-generated types from `src/integrations/supabase/types.ts`
   - Define custom types in `src/types/united.ts`

### Testing

1. **Write Unit Tests**
   ```typescript
   // src/test/example.test.ts
   import { describe, it, expect } from 'vitest';
   
   describe('Feature', () => {
     it('should work correctly', () => {
       expect(true).toBe(true);
     });
   });
   ```

2. **Run Tests**
   ```bash
   npm run test         # Run once
   npm run test:watch   # Watch mode
   ```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add your feature description"

# 3. Push to remote
git push origin feature/your-feature-name

# 4. Create pull request on GitHub
```

### Commit Message Convention

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/dependency updates

### User Roles & Validation

**Faculty Credentials:**
- **Employee ID**: Format `100XXX` (e.g., `100001`, `100123`)
- **Email**: Format `firstname.dept@anits.edu.in`
- **Valid Departments**: `csd`, `cse`, `ece`, `eee`, `mech`, `civil`, `it`, `chem`, `bio`
- **Required**: designation, qualification, experience details

**Student Credentials:**
- **Roll Number**: Format `22XXXXX` (7 digits, year + 5 digits)
- **Email**: Format `rollnumber@anits.edu.in` (e.g., `2211234@anits.edu.in`)
- **Required**: department, year of graduation, CGPA

---

## 🚀 Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Output will be in dist/ folder
# Ready to deploy to any static hosting service
```

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Netlify**
   ```bash
   # Build command: npm run build
   # Publish directory: dist
   ```

3. **GitHub Pages**
   ```bash
   # Build and deploy
   npm run build
   # Push dist/ folder to gh-pages branch
   ```

### Environment Variables for Production

```env
VITE_SUPABASE_URL=https://briynvmtsinfomfsvxag.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m 'feat: Add some AmazingFeature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with ❤️ by the UnitEd Platform Development Team

### Project Info

- **Version**: 0.0.0 (Active Development)
- **Status**: Beta
- **Last Updated**: February 17, 2026

---

## 📞 Support & Contact

### Getting Help

- **Issues**: Create an issue in the repository for bugs or feature requests
- **Documentation**: Review this README and inline code comments

### Quick Links

- 🌐 **Live Demo**: [Coming Soon]
- 📚 **Documentation**: This README
- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Issues

---

## 📖 Additional Resources

### Technologies Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)

---

**⭐ If you find this project helpful, please consider giving it a star!**

**Last Updated**: February 17, 2026 | **Version**: 0.0.0
