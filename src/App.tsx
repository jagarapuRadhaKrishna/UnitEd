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
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<div>Login - Coming in Phase 2</div>} />
              <Route path="/forgot-password" element={<div>Forgot Password - Coming in Phase 2</div>} />
              <Route path="/register" element={<div>Role Selection - Coming in Phase 2</div>} />
              <Route path="/register/student" element={<div>Student Register - Coming in Phase 2</div>} />
              <Route path="/register/faculty" element={<div>Faculty Register - Coming in Phase 2</div>} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route path="/home" element={<div>Home - Coming in Phase 4</div>} />
                <Route path="/dashboard" element={<div>Dashboard - Coming in Phase 4</div>} />
                <Route path="/profile" element={<div>Profile - Coming in Phase 4</div>} />
                <Route path="/create-post" element={<div>Create Post - Coming in Phase 4</div>} />
                <Route path="/create-opportunity" element={<div>Create Post - Coming in Phase 4</div>} />
                <Route path="/post/:id" element={<div>Post Detail - Coming in Phase 4</div>} />
                <Route path="/my-posts" element={<div>My Posts - Coming in Phase 5</div>} />
                <Route path="/matched-posts" element={<div>Skill Matched Posts - Coming in Phase 5</div>} />
                <Route path="/applications" element={<div>Applications - Coming in Phase 5</div>} />
                <Route path="/applied" element={<div>Applied - Coming in Phase 5</div>} />
                <Route path="/accepted-applications" element={<div>Accepted - Coming in Phase 5</div>} />
                <Route path="/invitations" element={<div>Invitations - Coming in Phase 5</div>} />
                <Route path="/post/:postId/candidates" element={<div>Candidates - Coming in Phase 5</div>} />
                <Route path="/candidate/:candidateId" element={<div>Candidate Profile - Coming in Phase 5</div>} />
                <Route path="/post/manage/:id" element={<div>Post Manage - Coming in Phase 5</div>} />
                <Route path="/notifications" element={<div>Notifications - Coming in Phase 6</div>} />
                <Route path="/chatrooms" element={<div>Chatrooms - Coming in Phase 6</div>} />
                <Route path="/chatroom/:id" element={<div>Chatroom - Coming in Phase 6</div>} />
                <Route path="/forums" element={<div>Forums - Coming in Phase 6</div>} />
                <Route path="/forum/:threadId" element={<div>Forum Thread - Coming in Phase 6</div>} />
                <Route path="/forum/create" element={<div>Create Thread - Coming in Phase 6</div>} />
                <Route path="/about" element={<div>About - Coming in Phase 6</div>} />
                <Route path="/settings" element={<div>Settings - Coming in Phase 6</div>} />
                <Route path="/settings/profile" element={<div>Profile Settings - Coming in Phase 6</div>} />
                <Route path="/profile/:id" element={<div>User Profile - Coming in Phase 6</div>} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
