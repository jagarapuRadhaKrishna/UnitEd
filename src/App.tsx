import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { initializePostLifecycle } from "./services/postLifecycleService";
import { storageSecurityMonitor } from "./services/storageSecurityMonitor";
import PrivateRoute from "./components/layout/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RoleSelection from "./pages/RoleSelection";
import StudentRegister from "./pages/StudentRegister";
import FacultyRegister from "./pages/FacultyRegister";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const cleanup = initializePostLifecycle();
    storageSecurityMonitor.getSecurityStatus();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
                <Route path="/post/:id" element={<div className="p-8 text-center text-2xl text-muted-foreground">Post Detail - Coming in Phase 4</div>} />
                <Route path="/my-posts" element={<div className="p-8 text-center text-2xl text-muted-foreground">My Posts - Coming in Phase 5</div>} />
                <Route path="/matched-posts" element={<div className="p-8 text-center text-2xl text-muted-foreground">Skill Matched Posts - Coming in Phase 5</div>} />
                <Route path="/applications" element={<div className="p-8 text-center text-2xl text-muted-foreground">Applications - Coming in Phase 5</div>} />
                <Route path="/applied" element={<div className="p-8 text-center text-2xl text-muted-foreground">Applied - Coming in Phase 5</div>} />
                <Route path="/accepted-applications" element={<div className="p-8 text-center text-2xl text-muted-foreground">Accepted - Coming in Phase 5</div>} />
                <Route path="/invitations" element={<div className="p-8 text-center text-2xl text-muted-foreground">Invitations - Coming in Phase 5</div>} />
                <Route path="/post/:postId/candidates" element={<div className="p-8 text-center text-2xl text-muted-foreground">Candidates - Coming in Phase 5</div>} />
                <Route path="/candidate/:candidateId" element={<div className="p-8 text-center text-2xl text-muted-foreground">Candidate Profile - Coming in Phase 5</div>} />
                <Route path="/post/manage/:id" element={<div className="p-8 text-center text-2xl text-muted-foreground">Post Manage - Coming in Phase 5</div>} />
                <Route path="/notifications" element={<div className="p-8 text-center text-2xl text-muted-foreground">Notifications - Coming in Phase 6</div>} />
                <Route path="/chatrooms" element={<div className="p-8 text-center text-2xl text-muted-foreground">Chatrooms - Coming in Phase 6</div>} />
                <Route path="/chatroom/:id" element={<div className="p-8 text-center text-2xl text-muted-foreground">Chatroom - Coming in Phase 6</div>} />
                <Route path="/forums" element={<div className="p-8 text-center text-2xl text-muted-foreground">Forums - Coming in Phase 6</div>} />
                <Route path="/forum/:threadId" element={<div className="p-8 text-center text-2xl text-muted-foreground">Forum Thread - Coming in Phase 6</div>} />
                <Route path="/forum/create" element={<div className="p-8 text-center text-2xl text-muted-foreground">Create Thread - Coming in Phase 6</div>} />
                <Route path="/about" element={<div className="p-8 text-center text-2xl text-muted-foreground">About - Coming in Phase 6</div>} />
                <Route path="/settings" element={<div className="p-8 text-center text-2xl text-muted-foreground">Settings - Coming in Phase 6</div>} />
                <Route path="/settings/profile" element={<div className="p-8 text-center text-2xl text-muted-foreground">Profile Settings - Coming in Phase 6</div>} />
                <Route path="/profile/:id" element={<div className="p-8 text-center text-2xl text-muted-foreground">User Profile - Coming in Phase 6</div>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
