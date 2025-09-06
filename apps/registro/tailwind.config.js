module.exports = {
  content: ["./apps/**/*.{js,ts,jsx,tsx,html}"],
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
  corePlugins: { preflight: false }
}
