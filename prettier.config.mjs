/** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
  semi: false,
  singleQuote: true,
  tabWidth: 2,
};

export default config;
