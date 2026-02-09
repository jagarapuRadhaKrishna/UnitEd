import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { initializePostLifecycle } from './services/postLifecycleService';
import { storageSecurityMonitor } from './services/storageSecurityMonitor';
import unitedTheme from './theme/unitedTheme';
import PrivateRoute from './components/Layout/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';
import LandingPageNew from './pages/LandingPageNew';
import RoleSelection from './pages/RoleSelection';
import StudentRegister from './pages/StudentRegister';
import FacultyRegister from './pages/FacultyRegister';
import LoginNew from './pages/LoginNew';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import CandidateProfile from './pages/CandidateProfile';
import Dashboard from './pages/Dashboard';
import CreatePostMultiStep from './pages/CreatePostMultiStep';
import AppliedOpportunities from './pages/AppliedOpportunities';
import NotFoundPage from './pages/NotFoundPage';
import Notifications from './pages/Notifications';
import Chatrooms from './pages/ChatroomsNew';
import Home from './pages/Home';
import Applications from './pages/Applications';
import About from './pages/AboutNew';
import PostDetailPage from './pages/PostDetailPage';
import Settings from './pages/Settings';
import ChatroomPage from './pages/ChatroomPage';
import PostManagePage from './pages/PostManagePage';
import Forums from './pages/Forums';
import ForumThread from './pages/Forums/ForumThread';
import CreateThread from './pages/Forums/CreateThread';
import AcceptedApplications from './pages/AcceptedApplications';
import UserProfile from './pages/UserProfile';
import CandidateRecommendations from './pages/CandidateRecommendations';
import ProfileSettings from './pages/ProfileSettingsNew';
import Invitations from './pages/Invitations';
import RecommendedCandidatesPage from './pages/RecommendedCandidatesPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import MyPosts from './pages/MyPosts';
import SkillMatchedPosts from './pages/SkillMatchedPosts';

function App() {
  // Initialize post lifecycle management and security monitoring
  useEffect(() => {
    const cleanup = initializePostLifecycle();
    
    // Initialize security monitoring
    storageSecurityMonitor.getSecurityStatus();
    
    return cleanup;
  }, []);

  return (
    <ThemeProvider theme={unitedTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPageNew />} />
            <Route path="/login" element={<LoginNew />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<RoleSelection />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/register/faculty" element={<FacultyRegister />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/matched-posts" element={<SkillMatchedPosts />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/post/:postId/candidates" element={<RecommendedCandidatesPage />} />
              <Route path="/candidate/:candidateId" element={<CandidateProfilePage />} />
              <Route path="/post/manage/:id" element={<PostManagePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/applied" element={<AppliedOpportunities />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/accepted-applications" element={<AcceptedApplications />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/chatrooms" element={<Chatrooms />} />
              <Route path="/chatroom/:id" element={<ChatroomPage />} />
              <Route path="/forums" element={<Forums />} />
              <Route path="/forum/:threadId" element={<ForumThread />} />
              <Route path="/forum/create" element={<CreateThread />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/profile" element={<ProfileSettings />} />
              <Route path="/create-post" element={<CreatePostMultiStep />} />
              <Route path="/create-opportunity" element={<CreatePostMultiStep />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/candidate/:candidateId" element={<CandidateProfile />} />
              <Route path="/post/:postId/candidates" element={<CandidateRecommendations />} />
            </Route>

            {/* 404 Page */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;