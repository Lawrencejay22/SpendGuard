/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B1014',
        card: '#151E20',
        card2: '#1A2428',
        accent: '#5DE0B0',
        accent2: '#3FBF8F',
        ptext: '#F2F7F5',
        stext: '#9AA9A6',
        line: '#1F2A2D',
        warn: '#F59E0B',
        err: '#F87171',
        ok: '#5DE0B0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
