module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        480: '480px',
      },
      height: {
        480: '480px',
        'px-36': '36px',
      },
      padding: {
        20: '20rem',
      },
    },
  },
  plugins: [],
};
