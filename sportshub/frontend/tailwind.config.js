/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1A2B',
        'ink-light': '#16273D',
        chalk: '#F2F4F3',
        volt: '#C8FF3D',
        signal: '#FF4D3D',
        steel: '#64748B',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      clipPath: {
        stripe: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)',
      },
    },
  },
  plugins: [],
}
