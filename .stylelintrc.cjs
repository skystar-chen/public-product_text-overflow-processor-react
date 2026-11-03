module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['lib/**', 'dist/**', 'build/**', 'coverage/**', 'node_modules/**'],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'scss/dollar-variable-pattern': null,
    'no-descending-specificity': null,
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
  },
};
