// src/theme.js

const theme = {
  light: {
    name: 'light',
    colors: {
      primary: '#2D6CDF',
      primaryHover: '#1a4fbf',
      dark: '#0f172a',
      text: '#475569',
      lightText: '#64748b',
      background: '#ffffff',
      backgroundAlt: '#f8fafc',
      border: '#e2e8f0',
    },
  },

  dark: {
    name: 'dark',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      dark: '#f1f5f9',
      text: '#cbd5e1',
      lightText: '#94a3b8',
      background: '#0f172a',
      backgroundAlt: '#1e293b',
      border: '#334155',
    },
  },

  typography: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    sizes: {
      xs: '0.8rem',
      sm: '0.95rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.75rem',
      xxl: '2.5rem',
    },
  },

  layout: {
    borderRadius: '12px',
    containerWidth: '1200px',
    sectionPadding: '96px 24px',
  },

  shadows: {
    soft: '0 4px 12px rgba(0,0,0,0.08)',
    medium: '0 10px 30px rgba(0,0,0,0.12)',
    strong: '0 20px 60px rgba(0,0,0,0.18)',
  },
};

export default theme;
