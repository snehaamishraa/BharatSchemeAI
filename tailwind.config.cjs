module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3'
        },
        accent: '#22C55E',
        saffron: '#FF9933',
        indiaGreen: '#138808',
        ink: '#111827'
      },
      boxShadow: {
        soft: '0 24px 80px -32px rgba(15, 23, 42, 0.32)',
        glow: '0 0 0 1px rgba(79, 70, 229, 0.12), 0 18px 60px rgba(79, 70, 229, 0.16)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
