import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect, lazy, Suspense } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import { initializePostLifecycle } from "./services/postLifecycleService";
import { storageSecurityMonitor } from "./services/storageSecurityMonitor";
import PrivateRoute from "./components/layout/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import BlankPage from "./pages/BlankPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RoleSelection from "./pages/RoleSelection";
import StudentRegister from "./pages/StudentRegister";
import FacultyRegister from "./pages/FacultyRegister";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import EditPostPage from "./pages/EditPostPage";
import AppliedOpportunitiesPage from "./pages/AppliedOpportunitiesPage";
import AcceptedApplicationsPage from "./pages/AcceptedApplicationsPage";
import InvitationsPage from "./pages/InvitationsPage";
import SkillMatchedPostsPage from "./pages/SkillMatchedPostsPage";
import PostManagePage from "./pages/PostManagePage";
import RecommendedCandidatesPage from "./pages/RecommendedCandidatesPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
const ChatroomsPage = lazy(() => import("./pages/ChatroomsPage"));
const ChatroomPage = lazy(() => import("./pages/ChatroomPage"));
import ForumsPage from "./pages/ForumsPage";
import ForumThreadPage from "./pages/ForumThreadPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfilePage from "./pages/UserProfilePage";
import AboutPage from "./pages/AboutPage";
const AboutApplicationPage = lazy(() => import("./pages/AboutApplicationPage"));
const AboutDevelopersPage = lazy(() => import("./pages/AboutDevelopersPage"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const cleanup = initializePostLifecycle();
    storageSecurityMonitor.getSecurityStatus();
    return cleanup;
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<BlankPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/register" element={<RoleSelection />} />
              <Route path="/register/student" element={<StudentRegister />} />
              <Route path="/register/faculty" element={<FacultyRegister />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/create-opportunity" element={<CreatePostPage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/edit-post/:id" element={<EditPostPage />} />
                <Route path="/matched-posts" element={<SkillMatchedPostsPage />} />
                <Route path="/applications" element={<AppliedOpportunitiesPage />} />
                <Route path="/applied" element={<AppliedOpportunitiesPage />} />
                <Route path="/accepted-applications" element={<AcceptedApplicationsPage />} />
                <Route path="/invitations" element={<InvitationsPage />} />
                <Route path="/post/:postId/candidates" element={<RecommendedCandidatesPage />} />
                <Route path="/candidate/:candidateId" element={<CandidateProfilePage />} />
                <Route path="/post/manage/:id" element={<PostManagePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/chatrooms" element={<ChatroomsPage />} />
                <Route path="/chatroom/:id" element={<ChatroomPage />} />
                <Route path="/forums" element={<ForumsPage />} />
                <Route path="/forum/:threadId" element={<ForumThreadPage />} />
                <Route path="/forum/create" element={<CreateThreadPage />} />
              <Route path="/about" element={<AboutPage />}>
                <Route index element={<Navigate to="application" replace />} />
                <Route path="application" element={<AboutApplicationPage />} />
                <Route path="developers" element={<AboutDevelopersPage />} />
                <Route path="developer" element={<Navigate to="/about/developers" replace />} />
              </Route>
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/profile" element={<ProfilePage />} />
                <Route path="/profile/:id" element={<UserProfilePage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
