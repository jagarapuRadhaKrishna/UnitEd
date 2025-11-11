export const theme = {
  colors: {
    primary: '#6C47FF',
    secondary: '#FF4B6C',
    background: {
      default: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #6C47FF 0%, #8C65FF 100%)',
      purple: '#6C47FF',
      light: '#F8F9FA',
      card: '#FFFFFF'
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      light: '#FFFFFF',
    },
    status: {
      available: '#4CAF50',
      ongoing: '#FF9800',
      completed: '#2196F3',
    },
    button: {
      primary: '#6C47FF',
      primaryHover: '#8C65FF',
      hover: '#8C65FF',
      disabled: '#C4C4C4'
    }
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%'
  },
  zIndex: {
    navbar: 100,
    modal: 1000,
    tooltip: 1100
  },
  shadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: '0 8px 16px rgba(0, 0, 0, 0.1)',
    button: '0 2px 4px rgba(0, 0, 0, 0.1)',
    hover: '0 6px 12px rgba(0, 0, 0, 0.15)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  typography: {
    fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75
    },
    headings: {
      h1: '3.5rem',
      h2: '2.5rem',
      h3: '2rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem'
    }
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease'
  },
  animation: {
    fadeIn: 'fadeIn 0.5s ease',
    slideUp: 'slideUp 0.5s ease'
  },
  card: {
    padding: {
      default: '1.5rem',
      spacious: '2rem'
    },
    hover: {
      transform: 'translateY(-4px)',
      shadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
    }
  }
};

export default theme;