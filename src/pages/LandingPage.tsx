import React from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import PublicNavbar from '@/components/landing/PublicNavbar';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';
import unitedTheme from '@/theme/unitedTheme';

const LandingPage: React.FC = () => {
  return (
    <ThemeProvider theme={unitedTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
        <PublicNavbar />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <WorkflowSection />
        <TestimonialsSection />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
