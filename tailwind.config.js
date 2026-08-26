/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#f6f5f3',
          100: '#e9e5e0',
          200: '#d3cabc',
          300: '#b8a696',
          400: '#9c8470',
          500: '#7d6650',
          600: '#5e4d3c',
          700: '#433729',
          800: '#2b231a',
          900: '#1a1410',
          950: '#100b08',
        },
        caramel: {
          50: '#fdf8ef',
          100: '#f8ecd2',
          200: '#f0d8a5',
          300: '#e6bd6f',
          400: '#dca24a',
          500: '#c98a32',
          600: '#a96d26',
          700: '#875321',
          800: '#6f431f',
          900: '#5d381c',
        },
        cream: {
          50: '#fffdf9',
          100: '#fbf6ec',
          200: '#f4e9d3',
          300: '#ecd9b5',
          400: '#e0c490',
          500: '#d2ab68',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
