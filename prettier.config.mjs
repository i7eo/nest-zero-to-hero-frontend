/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
};

export default config;
