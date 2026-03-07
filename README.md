# UnitEd

> Student and faculty collaboration platform for academic opportunities, project teamwork, forums, invitations, and real-time chat.

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

UnitEd is a full-stack academic collaboration platform built for students and faculty. It helps faculty publish opportunities, review candidates, invite students, manage teams, and communicate through chatrooms and forums. Students can build profiles, discover matching posts, apply, receive invitations, and collaborate in real time.

The project uses a React + Vite frontend and a Supabase backend for authentication, PostgreSQL data, real-time subscriptions, and storage.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
- [Database Overview](#database-overview)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Project Info](#project-info)

---

## Features

### Student Features

- Create and manage academic profiles with skills, projects, achievements, and links
- Browse research and project opportunities
- View skill-matched recommendations
- Apply to faculty posts
- Track application status
- Accept or decline invitations
- Join chatrooms with faculty and teammates
- Participate in discussion forums
- Receive in-app notifications

### Faculty Features

- Create, edit, publish, and manage opportunity posts
- Define required skills, positions, deadlines, and purpose
- Review candidate applications
- Accept or reject applicants
- View recommended candidates
- Send invitations directly to students
- Manage accepted teams and chatrooms
- Participate in academic forum discussions

### Shared Platform Features

- Secure authentication and session handling with Supabase Auth
- Real-time messaging and live updates
- Notification system for applications, invitations, and chat activity
- Responsive UI across desktop and mobile
- Theme-aware interface with modern component system
- Animated page transitions and interactive flows

---

## Tech Stack

### Frontend

- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- React Router DOM 6.30.1
- Tailwind CSS 3.4.17
- shadcn/ui with Radix UI primitives
- Framer Motion 12.34.5
- TanStack Query 5.83.0
- Lucide React 0.462.0
- Sonner for toast notifications
- Recharts for charts and analytics

### Backend and Platform

- Supabase Auth
- Supabase PostgreSQL
- Supabase Realtime
- Supabase Storage
- Row Level Security policies

### Tooling

- ESLint
- Vitest
- Testing Library
- PostCSS
- npm and bun

---

## Architecture

UnitEd uses a serverless backend architecture through Supabase.

```text
+-----------------------------+
| React + Vite Frontend       |
| TypeScript + Tailwind CSS   |
+-------------+---------------+
              |
              | Supabase JS Client
              v
+-----------------------------------------------+
| Supabase Backend                              |
| - Auth                                        |
| - PostgreSQL Database                         |
| - Realtime Subscriptions                      |
| - Storage                                     |
| - Row Level Security                          |
+-----------------------------------------------+
```

### Key Design Points

- Frontend is a single-page application with route-based screens
- Supabase handles auth, data, realtime subscriptions, and storage
- Business logic is split across page components, services, and context providers
- Reusable UI is built with shadcn/ui components and Tailwind utilities

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Installation

```bash
git clone <your-repository-url>
cd UnitEd/zip-file-explorer
npm install
```

### Run the App

```bash
npm run dev
```

The Vite development server will start locally. Production build output is generated into `dist/`.

### Supabase Setup

This project already includes a configured Supabase client in:

```text
src/integrations/supabase/client.ts
```

If you want to switch projects or move credentials into environment variables, update that file or refactor it to read from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## Project Structure

```text
zip-file-explorer/
|-- src/
|   |-- components/
|   |   |-- ui/
|   |   |-- layout/
|   |   `-- landing/
|   |-- contexts/
|   |   `-- AuthContext.tsx
|   |-- data/
|   |   `-- mockData.ts
|   |-- hooks/
|   |-- integrations/
|   |   `-- supabase/
|   |-- lib/
|   |-- pages/
|   |-- services/
|   |-- test/
|   |-- types/
|   |-- App.tsx
|   |-- main.tsx
|   `-- index.css
|-- supabase/
|   |-- config.toml
|   `-- migrations/
|-- public/
|-- index.html
|-- package.json
|-- vite.config.ts
|-- tailwind.config.ts
|-- eslint.config.js
`-- readme2.md
```

### Codebase Highlights

- `src/pages/` contains 34 route-level screens
- `src/services/` contains app-specific business logic
- `src/integrations/supabase/` contains the backend client and generated types
- `supabase/migrations/` currently contains 20 SQL migration files

---

## Endpoints

UnitEd does not use a custom Express or Spring Boot API. It uses:

- React Router routes for application pages
- Supabase Auth for authentication flows
- Supabase database tables and RPC functions for data operations
- Supabase Storage for file uploads
- Supabase Realtime channels for live updates

### Frontend Routes

#### Public Routes

| Route | Purpose |
|------|---------|
| `/` | Blank/default entry page |
| `/landing` | Public landing page |
| `/login` | User login |
| `/forgot-password` | Password reset request |
| `/reset-password` | Set new password |
| `/register` | Role selection |
| `/register/student` | Student registration |
| `/register/faculty` | Faculty registration |

#### Protected Routes

| Route | Purpose |
|------|---------|
| `/home` | Main home page |
| `/dashboard` | User dashboard |
| `/profile` | Current user profile |
| `/profile/:id` | Public profile view |
| `/create-post` | Create new opportunity |
| `/create-opportunity` | Alternate create route |
| `/post/:id` | Opportunity detail page |
| `/edit-post/:id` | Edit opportunity |
| `/post/manage/:id` | Post management |
| `/matched-posts` | Skill matched opportunities |
| `/applications` | Student applications |
| `/applied` | Alternate applications route |
| `/accepted-applications` | Faculty accepted applicants |
| `/invitations` | Invitation management |
| `/post/:postId/candidates` | Recommended candidates |
| `/candidate/:candidateId` | Candidate profile |
| `/notifications` | Notifications center |
| `/chatrooms` | Chatroom list |
| `/chatroom/:id` | Individual chatroom |
| `/forums` | Forum threads list |
| `/forum/:threadId` | Forum thread details |
| `/forum/create` | Create a forum thread |
| `/about/application` | About application page |
| `/about/developers` | About developers page |
| `/settings` | Account settings |
| `/settings/profile` | Profile settings shortcut |

### Supabase Auth Endpoints

These are accessed through the Supabase client in code rather than handwritten REST controllers.

| Operation | Usage in App |
|------|---------|
| `signInWithPassword` | Login with email and password |
| `signUp` | Register new users |
| `signOut` | Logout |
| `getSession` | Restore active session |
| `onAuthStateChange` | Listen for auth/session changes |
| `resetPasswordForEmail` | Trigger password reset email |
| `updateUser` | Update password after reset |

### Database Tables Used as API Resources

| Resource | Main Purpose |
|------|---------|
| `profiles` | Student and faculty profile records |
| `posts` | Research and project opportunities |
| `applications` | Student applications to posts |
| `invitations` | Faculty invitations and responses |
| `chatrooms` | Team communication rooms |
| `chatroom_members` | Chatroom membership records |
| `messages` | Chat messages and file metadata |
| `notifications` | In-app alerts |
| `forum_threads` | Discussion threads |
| `forum_replies` | Replies inside a forum thread |

### RPC Endpoints

| Function | Purpose |
|------|---------|
| `get_public_landing_stats` | Fetch landing page statistics |
| `get_post_member_counts` | Resolve post member totals |
| `register_forum_thread_view` | Track unique forum thread views |

### Storage Endpoints

| Bucket | Purpose |
|------|---------|
| `profile-pictures` | User avatar uploads |
| `chat-files` | Files shared inside chatrooms |

### Realtime Channels

| Channel | Purpose |
|------|---------|
| `navbar-invitations` | Invitation badge updates |
| `navbar-notifications` | Notification badge updates |
| `navbar-received-apps` | Faculty application badge updates |
| `chatrooms-list` | Chatroom list refreshes |
| `chatroom-{id}` | Live chat message updates |
| `invitations-rt` | Invitation status refreshes |
| `my-apps-rt` | Application tracking updates |
| `forum-threads-realtime` | Forum thread refreshes |
| `forum-replies-realtime` | Forum reply refreshes |
| `forum-replies-{threadId}` | Live replies in a thread |
| `notifications-rt` | Notification updates |
| `post-detail-live-{id}` | Post detail live changes |
| `skill-matched-posts-live` | Live matched post updates |

---

## Database Overview

The application is backed by Supabase PostgreSQL with security policies applied at the database level.

### Main Domain Areas

- `profiles`: student and faculty profile data
- `posts`: faculty-created opportunities
- `applications`: student submissions to posts
- `invitations`: faculty invitations to students
- `chatrooms`: team or post-based collaboration rooms
- `messages`: chat messages and shared files
- `notifications`: user-specific events and alerts
- `forums`, `threads`, `comments`: discussion system

### Backend Capabilities

- Authentication and session persistence
- Real-time updates for chat and other live flows
- File storage for profile images and uploaded assets
- Row Level Security for access control

---

## Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Builds the production bundle into `dist/`.

### Development Build

```bash
npm run build:dev
```

Builds with development mode settings.

### Preview Build

```bash
npm run preview
```

Serves the built output locally for verification.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

### Test

```bash
npm run test
npm run test:watch
```

Runs Vitest once or in watch mode.

---

## Deployment

Because the frontend is a Vite app, it can be deployed to any static hosting provider.

### Recommended Options

- Vercel
- Netlify
- GitHub Pages
- Any VPS or CDN-backed static host

### Standard Build Flow

```bash
npm install
npm run build
```

Deploy the contents of:

```text
dist/
```

### Suggested Environment Variables

If you move Supabase configuration out of source code, use:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Contributing

1. Create a new branch.
2. Make focused changes.
3. Run lint and tests where relevant.
4. Update documentation when behavior changes.
5. Open a pull request with a clear summary.

### Suggested Commit Prefixes

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation update
- `refactor:` internal cleanup
- `test:` test changes
- `chore:` tooling or maintenance

---

## Project Info

### Current Status

- Version: `0.0.0`
- Status: Active development
- Frontend: React + Vite
- Backend: Supabase

### Notes

- Authentication, chatrooms, invitations, posts, and forums are already integrated into the application flow
- The project uses a modern component-driven structure with typed Supabase integration
- Recent UI work includes animation support across invitations and chatroom flows

---

## Support

For maintenance or future updates, review:

- `src/pages/`
- `src/services/`
- `src/contexts/AuthContext.tsx`
- `src/integrations/supabase/client.ts`
- `supabase/migrations/`

---

## License

This repository should follow your project licensing decision. Update this section when the final license is confirmed.

---

**Last Updated:** March 8, 2026
