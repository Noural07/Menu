export const colors = {
  primary: {
    50: '#FFF5F5',
    100: '#FFE9E9',
    200: '#FFC7C7',
    300: '#FFA5A5',
    400: '#FF7070',
    500: '#FF3B3B',
    600: '#FF0000',
    700: '#C50000',
    800: '#8B0000', // Main burgundy
    900: '#4D0000',
  },
  secondary: {
    50: '#FFFAF0',
    100: '#FFF5E0',
    200: '#FFE6B3',
    300: '#FFD686',
    400: '#FFC371', // Gold accent
    500: '#FFAA33',
    600: '#FF9500',
    700: '#CC7A00',
    800: '#995C00',
    900: '#663D00',
  },
  neutral: {
    50: '#F9F9F9',
    100: '#F1F1F1',
    200: '#E1E1E1',
    300: '#D1D1D1',
    400: '#A0A0A0',
    500: '#808080',
    600: '#636363',
    700: '#484848',
    800: '#212121',
    900: '#121212',
  },
  white: '#FFFFFF',
  black: '#000000',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

export const fontFamily = {
  serif: '"Playfair Display", "Times New Roman", serif',
  sans: '"Inter", "Helvetica Neue", sans-serif',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.05)',
  glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
};

export const gradients = {
  primaryGradient: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[800]} 100%)`,
  secondaryGradient: `linear-gradient(135deg, ${colors.secondary[400]} 0%, ${colors.secondary[600]} 100%)`,
};