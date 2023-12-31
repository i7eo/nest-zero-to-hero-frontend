import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

/**
 * use esm config eslint, please see
 * 1. https://github.com/eslint/eslintrc
 * 2. https://www.raulmelo.me/en/blog/migration-eslint-to-flat-config
 * 3. https://github.com/eslint/eslint/issues/16580#issuecomment-1484028136
 */

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,                  // optional; default: process.cwd()
    resolvePluginsRelativeTo: __dirname,       // optional
    recommendedConfig: {}, // optional
});

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // translate an entire config
  ...compat.config({
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/recommended',
      'plugin:eslint-comments/recommended',
      'plugin:jsonc/recommended-with-jsonc',
      'plugin:markdown/recommended',
      'prettier',
    ],
    ignorePatterns: ['dist', 'eslint.config.mjs', 'prettier.config.mjs', 'stylelint.config.mjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'prettier'],
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.mjs', '.ts', '.d.ts', '.tsx'] },
      },
    },
    overrides: [
      {
        files: ['*.json', '*.json5', '*.jsonc', '*rc'],
        parser: 'jsonc-eslint-parser',
      },
      {
        files: ['**/__tests__/**'],
        rules: {
          'no-console': 'off',
        },
      },
      {
        files: ['package.json'],
        parser: 'jsonc-eslint-parser',
        rules: {
          'jsonc/sort-keys': [
            'error',
            {
              pathPattern: '^$',
              order: [
                'name',
                'version',
                'private',
                'packageManager',
                'description',
                'type',
                'keywords',
                'homepage',
                'bugs',
                'license',
                'author',
                'contributors',
                'funding',
                'files',
                'main',
                'module',
                'exports',
                'unpkg',
                'jsdelivr',
                'browser',
                'bin',
                'man',
                'directories',
                'repository',
                'publishConfig',
                'scripts',
                'peerDependencies',
                'peerDependenciesMeta',
                'optionalDependencies',
                'dependencies',
                'devDependencies',
                'engines',
                'config',
                'overrides',
                'pnpm',
                'husky',
                'lint-staged',
                'eslintConfig',
              ],
            },
            {
              pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
              order: { type: 'asc' },
            },
          ],
        },
      },
      {
        files: ['*.d.ts'],
        rules: {
          'import/no-duplicates': 'off',
        },
      },
      {
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
        },
      },
      {
        files: ['**/*.md/*.js', '**/*.md/*.ts'],
        rules: {
          'no-console': 'off',
          'import/no-unresolved': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
        },
      },
    ],
    rules: {
      // js/ts
      camelcase: ['error', { properties: 'never' }],
      // 'no-console': ['warn', { allow: ['error'] }],
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      'no-return-await': 'error',
      'no-var': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': [
        'warn',
        { destructuring: 'all', ignoreReadBeforeAssign: true },
      ],
      'prefer-arrow-callback': [
        'error',
        { allowNamedFunctions: false, allowUnboundThis: true },
      ],
      'object-shorthand': [
        'error',
        'always',
        { ignoreConstructors: false, avoidQuotes: true },
      ],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
  
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
  
      // best-practice
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'no-alert': 'warn',
      'no-case-declarations': 'error',
      'no-multi-str': 'error',
      'no-with': 'error',
      'no-void': 'error',
  
      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
  
      // stylistic-issues
      'prefer-exponentiation-operator': 'error',
  
      // ts
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/ban-ts-comment': ['off', { 'ts-ignore': false }],
      '@typescript-eslint/ban-types': 'off',
  
       // prettier
       'prettier/prettier': 'error',
  
       // import
       'import/first': 'error',
       'import/no-duplicates': 'error',
       'import/order': [
         'error',
         {
           groups: [
             'builtin',
             'external',
             'internal',
             ['parent', 'sibling', 'index'],
             'type',
           ],
           pathGroups: [
             {
               pattern: 'react',
               group: 'builtin',
               position: 'before',
             },
             {
               pattern: 'next',
               group: 'builtin',
               position: 'before',
             },
             // always put css import to the last, ref:
             // https://github.com/import-js/eslint-plugin-import/issues/1239
             {
               pattern: '*.+(css|sass|less|scss|pcss|styl)',
               group: 'unknown',
               patternOptions: { matchBase: true },
               position: 'after',
             },
           ],
           pathGroupsExcludedImportTypes: ['type'],
           // example: let `import './nprogress.css';` after importing others
           // in `packages/docusaurus-theme-classic/src/nprogress.ts`
           // see more: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#warnonunassignedimports-truefalse
           warnOnUnassignedImports: true,
         },
       ],
       'import/no-unresolved': 'off',
       'import/namespace': 'off',
       'import/default': 'off',
       'import/no-named-as-default': 'off',
       'import/no-named-as-default-member': 'off',
       'import/named': 'off',
   
       // eslint-plugin-eslint-comments
       'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
  
      // 'react-refresh/only-export-components': [
      //   'warn',
      //   { allowConstantExport: true },
      // ],
      'react-refresh/only-export-components': 'off',
    },
  })
];
