/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      colors: {
        darkbg: '#0D0B13',
        navgray: '#1A1A21',
        accent: '#7C83FD',
      },
    },
  },
  plugins: [],
}
