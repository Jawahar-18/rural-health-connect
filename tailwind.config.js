/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          green: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            500: '#22C55E',
            600: '#16A34A',
            700: '#15803D', // Primary
            800: '#166534',
            900: '#14532D',
          },
          teal: {
            50: '#F0FDFA',
            100: '#CCFBF1',
            600: '#0D9488',
            700: '#0F766E', // Secondary
            800: '#115E59',
          },
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#64748B',
          },
          accent: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        'gov': '12px',
      }
    },
  },
  plugins: [],
}
