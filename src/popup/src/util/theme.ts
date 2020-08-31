export const theme = {
  fonts: {
    body: 'Open Sans',
  },
  colors: {
    text: {
      primary: '#320C0E',
      secondary: '#6B2020',
      contrast: '#FFFFFF',
      caption: '#030303',
    },
    background: '#FFFFFF',
    grayOverlay: '#0000000D',
    alternateBackground: '#f0f0f0',
    primary: '#FF8484',
    secondary: '#B83737',
    contrast: '#6B2020',
    overlay: '#FCE9E980',
    modes: {
      dark: {

      },
      blue: {

      },
    },
  },
  fontSizes: {
    mini: 10,
    small: 14,
    medium: 16,
    large: 18,
    larger: 20,
    largest: 24,
  },
  fontWeight: {
    body: 'normal',
  },
  lineHeights: {
    body: 1.5,
  },
  letterSpacings: {
    body: 'normal',
    caps: '0.2em',
  },
  bodyWrapper: {
    px: '10%',
    mt: '12vh', //navbar height, this is so hardcoded
    py: '3%',
  },
  redEllipse: {
    bg: 'primary',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    color: 'text.contrast',
    textAlign: 'center',
    borderRadius: '50%',
  },
  whiteEllipse: {
    bg: 'background',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'contrast',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    color: 'text.primary',
    textAlign: 'center',
    borderRadius: '50%',
  },
};