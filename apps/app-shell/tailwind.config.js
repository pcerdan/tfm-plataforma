const withMT = require("@material-tailwind/react/utils/withMT");
const { safelist } = require("../registro/tailwind.config");

module.exports = withMT({
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-indigo-100", "bg-indigo-200", "bg-indigo-300",
    "bg-emerald-100", "bg-emerald-200", "bg-emerald-300",
    "bg-amber-100", "bg-amber-200", "bg-amber-300",
    "hover:bg-indigo-200", "hover:bg-emerald-200", "hover:bg-amber-200"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
