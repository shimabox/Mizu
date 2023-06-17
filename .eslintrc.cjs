module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  rules: {
    "semi": ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],
    "space-before-function-paren": ["error", "never"],
    "@typescript-eslint/space-before-function-paren": ["error", "never"],
    "no-console": "error"
  }
}
