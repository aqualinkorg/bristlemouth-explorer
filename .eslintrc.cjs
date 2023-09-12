module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'prettier',
    'fp'
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // More verbose prettier suggestions
    'prettier/prettier': [
      "warn"
    ],
    'no-console': [
      "warn",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ],
    // Warnings to enforce functional programming styles - e.g. no unintended mutations
    "fp/no-delete": "warn",
    "fp/no-mutating-assign": "warn",
    "fp/no-mutating-methods": [
      "warn",
      {
        "allowedObjects": [
          "_"
        ]
      }
    ],
    "fp/no-mutation": [
      "warn",
      {
        "commonjs": true,
        "allowThis": true,
        "exceptions": [
          {
            "property": "propTypes"
          },
          {
            "property": "defaultProps"
          },
          {
            "property": "current"
          }
        ]
      }
    ],
  },
  overrides: [
    {
      files: "**/*.{spec,test}.{ts,tsx}",
      rules: {
        "fp/no-mutation": "off"
      }
    },
  ]
}
