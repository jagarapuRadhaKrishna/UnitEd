import React from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import PublicNavbar from '../components/Landing/PublicNavbar';
import HeroSection from '../components/Landing/HeroSection';
import AboutSection from '../components/Landing/AboutSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import WorkflowSection from '../components/Landing/WorkflowSection';
import TestimonialsSection from '../components/Landing/TestimonialsSection';
import Footer from '../components/Landing/Footer';
import unitedTheme from '../theme/unitedTheme';

const LandingPageNew: React.FC = () => {
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

export default LandingPageNew;
