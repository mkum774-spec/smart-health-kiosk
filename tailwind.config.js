/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hospital: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary medical teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        }
      },
      fontSize: {
        'kiosk-xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'kiosk-2xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        'kiosk-3xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'touch': '0 4px 14px 0 rgba(0, 0, 0, 0.08)',
        'touch-active': '0 1px 4px 0 rgba(0, 0, 0, 0.12)',
        'emergency': '0 0 25px rgba(220, 38, 38, 0.35)',
      }
    },
  },
  plugins: [],
}
