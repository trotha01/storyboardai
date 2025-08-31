module.exports = {
  content: ['./public/index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted-ink)',
        stroke: 'var(--stroke)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        accent3: 'var(--accent-3)',
        focus: 'var(--focus)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
      fontSize: {
        0: 'var(--fs-0)',
        1: 'var(--fs-1)',
        2: 'var(--fs-2)',
        3: 'var(--fs-3)',
        4: 'var(--fs-4)',
      },
    },
  },
  plugins: [],
};
