/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './<custom directory>/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          text: 'white',
          border: 'gray',
          button: 'green',
        },
        secondary: {
          text: 'black',
          border: 'gray',
          button: 'gray',
        },
      },
    },
  },
  plugins: [],
};
