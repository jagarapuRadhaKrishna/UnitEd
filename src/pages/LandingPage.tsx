import React from 'react';
import PublicNavbar from '@/components/landing/PublicNavbar';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-united-dark">
      <PublicNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
