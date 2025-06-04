/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // include other folders if needed
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // example if you use it
        destructive: "#dc2626", // ✅ red
        "destructive-foreground": "#ffffff", // white text on red background
      },
    },
  },
  plugins: [],
};
