module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vuetify/recommended',
    // 'plugin:vue/recommended',
    'plugin:vue/essential',
    'plugin:cypress/recommended',
  ],
  plugins: ['cypress'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error',
    'vue/no-mutating-props': 'warn',
    'no-console': process.env.VUE_APP_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.VUE_APP_ENV === 'production' ? 'warn' : 'off',
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'warn',
    'cypress/no-async-tests': 'error',
    'cypress/no-pause': 'error',
  },
}
