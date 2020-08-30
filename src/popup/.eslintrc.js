module.exports = {
  root: true,
  extends: ['@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'operator-linebreak': [2, 'before'],
    quotes: [2, 'single', 'avoid-escape'],
  },
};
