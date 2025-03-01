/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    // 确保 Tailwind 不会与 Arco Design 样式冲突
    corePlugins: {
      preflight: false,
    },
  }