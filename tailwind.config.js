/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary:     '#050508',
        bgSurface:     '#0D0D14',
        bgElevated:    '#12121C',
        accentRed:     '#E0003C',
        accentPink:    '#FF4D6D',
        accentPurple:  '#7B2FBE',
        textPrimary:   '#F0EEF8',
        textSecondary: '#8B8B9E',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
