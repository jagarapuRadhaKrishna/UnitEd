

# Plan: Rebuild UnitEd (Pro_Gram) Frontend in Lovable

## Summary
Recreate all 35+ pages and 50+ components of the UnitEd academic collaboration platform. The original uses MUI/Emotion/Framer Motion -- these will be translated to Tailwind CSS and shadcn/ui while keeping the exact same visual design, layout, colors, routing, and business logic.

## Scope
- 7 Landing page components (PublicNavbar, HeroSection, AboutSection, FeaturesSection, WorkflowSection, TestimonialsSection, Footer)
- 6 public pages (Landing, Login, ForgotPassword, RoleSelection, StudentRegister, FacultyRegister)
- 27 protected pages (Home, Dashboard, Profile, CreatePost, PostDetail, Applications, Invitations, Chatrooms, Forums, Settings, etc.)
- Auth system (localStorage-based, same as original)
- All services, types, mock data ported as-is
- Authenticated navbar with profile menu, notifications, invitations

## Phases

### Phase 1 -- Foundation
- Update `tailwind.config.ts` with UnitEd colors (Primary #2563EB, Accent #6C47FF, Orange #F97316, etc.)
- Copy types from `Pro_Gram-main/src/types/index.ts` into `src/types/united.ts`
- Copy mock data into `src/data/mockData.ts` (replace `file:///` paths with placeholder URLs)
- Create services: `localStorageAuthService.ts`, `secureStorageService.ts`, `invitationService.ts`, `notificationService.ts`, `applicationService.ts`, `chatroomService.ts`, `postLifecycleService.ts`
- Create `AuthContext.tsx` with login/register/logout/updateProfile

### Phase 2 -- Public Pages
Rebuild each component translating MUI to Tailwind:
- `PublicNavbar` -- fixed top navbar with logo and Login/Register buttons
- `HeroSection` -- full-screen hero with background image, gradient text tagline, stats, CTA buttons
- `AboutSection`, `FeaturesSection` (12 feature cards in 4-column grid), `WorkflowSection`, `TestimonialsSection`, `Footer`
- `LoginNew` -- blue gradient background, centered card with email/password form
- `RoleSelection` -- two role cards (Student/Faculty) with feature lists
- `StudentRegister` and `FacultyRegister` -- multi-field forms with skills autocomplete
- `ForgotPassword`

### Phase 3 -- Layout and Navigation
- `PrivateRoute` component (redirect to /login if not authenticated)
- `MainLayout` with `AuthenticatedNavbar` -- top bar with nav links (Home, Dashboard, Create Post, Forums, Applications, Invitations, Chat Room, About), notification bell with badge, profile avatar with dropdown menu
- Wire up all routes in `App.tsx` matching the original routing structure

### Phase 4 -- Core Pages
- `Home` -- search bar, tab filters (All Posts / Skill-Based / My Posts), skill chips filter, post cards grid with apply button
- `Dashboard` -- stat cards, skills progress bars, recent activity, performance chart
- `Profile` -- profile showcase with edit mode, skills, projects, achievements
- `CreatePostMultiStep` -- 3-step form (Purpose > Skills > Details)
- `PostDetailPage` -- full post view with apply functionality

### Phase 5 -- Collaboration Pages
- `Applications`, `AppliedOpportunities`, `AcceptedApplications`
- `Invitations` (sent/received tabs)
- `MyPosts`, `SkillMatchedPosts`
- `PostManagePage`, `RecommendedCandidatesPage`, `CandidateProfilePage`

### Phase 6 -- Communication and Settings
- `ChatroomsNew` (list), `ChatroomPage` (messages)
- `Forums`, `ForumThread`, `CreateThread`
- `Notifications`
- `Settings`, `ProfileSettingsNew`
- `UserProfile`, `AboutNew`, `NotFoundPage`

## Technical Details

### MUI to Tailwind Translation Examples
| MUI | Tailwind Equivalent |
|---|---|
| `<Box sx={{ p: 4, mb: 3 }}>` | `<div className="p-8 mb-6">` |
| `<Typography variant="h4" sx={{ fontWeight: 700 }}>` | `<h4 className="text-2xl font-bold">` |
| `<Container maxWidth="lg">` | `<div className="max-w-6xl mx-auto px-4">` |
| `<Paper sx={{ borderRadius: 2 }}>` | `<Card>` (shadcn) |
| `<TextField>` | `<Input>` (shadcn) |
| `<Button variant="contained">` | `<Button>` (shadcn) |
| `<Tabs>` / `<Tab>` | `<Tabs>` (shadcn) |
| `<Chip>` | `<Badge>` (shadcn) or custom chip |
| `framer-motion` animations | Tailwind `animate-fade-in`, CSS transitions |

### Colors Added to Tailwind Config
```text
united-blue: #2563EB
united-purple: #6C47FF
united-orange: #F97316
united-green: #10B981
united-red: #EF4444
united-amber: #F59E0B
united-dark: #0f172a
```

### Files Created (estimated)
- ~15 service/utility files
- ~7 Landing components
- ~4 Layout components
- ~30 page files
- 1 context file (AuthContext)
- 1 types file

### What Stays the Same
- All business logic (filtering, auth flow, post matching, invitation logic)
- All mock data and type definitions
- Routing structure (exact same paths)
- localStorage-based auth with secure storage encryption
- User flows (register > login > home > create post > apply > chat)

### What Changes
- MUI components replaced with shadcn/ui + Tailwind
- Emotion styled components replaced with Tailwind classes
- Framer Motion animations replaced with CSS animations
- React 19 patterns adapted to React 18
- Local file paths in mock data replaced with placeholder URLs

