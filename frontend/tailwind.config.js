/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./layouts/**/*.{js,jsx}",
    "./dashboard/**/*.{js,jsx}",
    "./booking/**/*.{js,jsx}",
    "./auth/**/*.{js,jsx}",
    "./maps/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#faff5d",
        secondary: "#121212",
        accent: "#d4af37",
        "accent-gold": "#d4af37",
        surface: "#080808",
        muted: "#1a1a1a",
        ink: "#0f172a",
        ember: "#dc2626",
        sand: "#fff7ed",
        sunset: "#f59e0b",
        mist: "#e2e8f0"
      },
      boxShadow: {
        card: "0 20px 60px -20px rgba(15, 23, 42, 0.18)"
      },
      backgroundImage: {
        rescue: "radial-gradient(circle at top left, rgba(245, 158, 11, 0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(220, 38, 38, 0.18), transparent 30%), linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #fee2e2 100%)"
      }
    }
  },
  plugins: []
};
