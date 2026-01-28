module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['jest'],
  env: {
    jest: true,
  },
  rules: {
    '@typescript-eslint/func-call-spacing': 'off',
    'func-call-spacing': ['error', 'never'],
  },
};
