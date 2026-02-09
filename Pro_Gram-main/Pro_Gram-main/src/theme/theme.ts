import { Theme } from './types';

export const theme: Theme = {
  colors: {
    primary: '#6C47FF',
    secondary: '#FF4B6C',
    tertiary: '#00BFA5',
    background: {
      default: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #6C47FF 0%, #8C65FF 100%)',
      purple: '#6C47FF',
      light: '#F8F9FA',
      card: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      light: '#FFFFFF',
      accent: '#6C47FF',
    },
    status: {
      available: '#4CAF50',
      ongoing: '#FF9800',
      completed: '#2196F3',
      error: '#FF4B6C',
    },
    button: {
      primary: '#6C47FF',
      primaryHover: '#5635CC',
      secondary: '#FF4B6C',
      secondaryHover: '#E63E5C',
    }
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    xl: '24px',
    circle: '50%',
  },
  shadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: '0 8px 16px rgba(0, 0, 0, 0.1)',
    hover: '0 8px 20px rgba(108, 71, 255, 0.15)',
    button: '0 4px 10px rgba(108, 71, 255, 0.2)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    headings: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  transitions: {
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease',
  },
  zIndex: {
    navbar: 1000,
    modal: 2000,
    tooltip: 3000,
  },
  card: {
    padding: {
      default: '24px',
      compact: '16px',
      spacious: '32px',
    },
    hover: {
      transform: 'translateY(-4px)',
      shadow: '0 8px 20px rgba(108, 71, 255, 0.15)',
    }
  },
  animation: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.4s ease-out',
    pulse: 'pulse 2s infinite',
  }
};

export default theme;