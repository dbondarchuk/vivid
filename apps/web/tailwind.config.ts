import base from "@vivid/tailwind-config";
/** @type {import('tailwindcss').Config} */
export default {
  ...base,
  content: [...base.content, "../../node_modules/@vivid/**/*.{js,ts,jsx,tsx}"],
  plugins: [...base.plugins, require("tailwindcss-animate")],
};
