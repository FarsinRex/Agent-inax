/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // For files in the app directory
    "./src/**/*.{js,ts,jsx,tsx}",      // For files in the src directory (like components)
    "./pages/**/*.{js,ts,jsx,tsx}",    // If you have a pages directory
    "./components/**/*.{js,ts,jsx,tsx}", // If you have a components directory
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f97316', // orange-500
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
