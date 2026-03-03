import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About Us', sectionId: 'about' },
    { label: 'How It Works', sectionId: 'workflow' },
    { label: 'Features', sectionId: 'features' },
    { label: 'Testimonials', sectionId: 'testimonials' },
    { label: 'FAQ', to: '/register' },
  ];

  const studentLinks = [
    { label: 'Browse Opportunities', to: '/login' },
    { label: 'Create Profile', to: '/register' },
    { label: 'Apply to Projects', to: '/login' },
    { label: 'Join Teams', to: '/login' },
    { label: 'Resources', sectionId: 'features' },
  ];

  return (
    <Box
      id="footer"
      sx={{
        backgroundColor: '#111827',
        color: '#FFFFFF',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 4,
            mb: 6,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <GraduationCap size={28} color="#2563EB" strokeWidth={2.5} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                UnitEd
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3, lineHeight: 1.7 }}>
              Connecting students and faculty for research, projects, and hackathons through AI-powered matching.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Twitter, href: 'https://x.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Instagram, href: 'https://instagram.com' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#9CA3AF',
                      '&:hover': {
                        color: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      },
                    }}
                  >
                    <Icon size={20} />
                  </IconButton>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                component={item.to ? RouterLink : 'button'}
                to={item.to}
                type={item.sectionId ? 'button' : undefined}
                onClick={item.sectionId ? () => scrollToSection(item.sectionId as string) : undefined}
                sx={{
                  border: 0,
                  background: 'none',
                  p: 0,
                  textAlign: 'left',
                  width: '100%',
                  display: 'block',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  mb: 1,
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#2563EB',
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              For Students
            </Typography>
            {studentLinks.map((item) => (
              <Link
                key={item.label}
                component={item.to ? RouterLink : 'button'}
                to={item.to}
                type={item.sectionId ? 'button' : undefined}
                onClick={item.sectionId ? () => scrollToSection(item.sectionId as string) : undefined}
                sx={{
                  border: 0,
                  background: 'none',
                  p: 0,
                  textAlign: 'left',
                  width: '100%',
                  display: 'block',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  mb: 1,
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#2563EB',
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Created By
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5, mb: 2 }}>
              <Mail size={18} color="#9CA3AF" />
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                210040017@anits.edu.in
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5, mb: 2 }}>
              <Phone size={18} color="#9CA3AF" />
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                +91 9985949494
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
              <MapPin size={18} color="#9CA3AF" />
              <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                Anil Neerukonda Institute of Technology & Sciences
                <br />
                Sangivalasa, Bheemunipatnam Mandal
                <br />
                Visakhapatnam, Andhra Pradesh 531162
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid #374151',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            © {currentYear} UnitEd. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { label: 'Privacy Policy', to: '/register' },
              { label: 'Terms of Service', to: '/register' },
              { label: 'Cookie Policy', to: '/register' },
            ].map((item) => (
              <Link
                key={item.label}
                component={RouterLink}
                to={item.to}
                sx={{
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#2563EB',
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
