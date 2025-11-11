export type Theme = {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: {
      default: string;
      gradient: string;
      purple: string;
      light: string;
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      light: string;
      accent: string;
    };
    status: {
      available: string;
      ongoing: string;
      completed: string;
      error: string;
    };
    button: {
      primary: string;
      primaryHover: string;
      secondary: string;
      secondaryHover: string;
    };
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    xl: string;
    circle: string;
  };
  shadows: {
    card: string;
    elevation: string;
    hover: string;
    button: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    headings: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      h6: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
  zIndex: {
    navbar: number;
    modal: number;
    tooltip: number;
  };
  card: {
    padding: {
      default: string;
      compact: string;
      spacious: string;
    };
    hover: {
      transform: string;
      shadow: string;
    };
  };
  animation: {
    fadeIn: string;
    slideUp: string;
    pulse: string;
  };
};

declare const theme: Theme;
export default theme;