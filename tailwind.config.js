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
      screens: {
        'xsm': {'max': '404px'},
        'xx-sm': {'max': '310px'},
      },
    },
    minHeight: {
      300: '300px',
    },
  },
  plugins: [],
};
