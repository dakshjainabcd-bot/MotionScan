/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          raised: '#ffffff',
          dark: '#17171c',
          'dark-raised': '#1d1d23',
        },
        ink: {
          DEFAULT: '#14141a',
          muted: '#6b6b76',
          faint: '#a3a3ad',
          dark: '#f2f2f5',
          'dark-muted': '#a3a3ad',
        },
        border: {
          DEFAULT: '#e8e8ec',
          strong: '#d4d4dc',
          dark: '#2a2a32',
        },
        brand: {
          DEFAULT: '#6d28d9',
          soft: '#f3edfe',
          dark: '#a78bfa',
        },
        state: {
          good: '#0f9d58',
          'good-soft': '#eaf7f0',
          warn: '#b8860b',
          'warn-soft': '#fdf6e5',
          bad: '#c23934',
          'bad-soft': '#fdecec',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        ms: '14px',
        'ms-lg': '20px',
      },
      boxShadow: {
        'ms-sm': '0 1px 2px rgba(20,20,26,0.04), 0 1px 1px rgba(20,20,26,0.03)',
        'ms-md': '0 4px 16px rgba(20,20,26,0.06), 0 1px 3px rgba(20,20,26,0.04)',
        'ms-lg': '0 12px 32px rgba(20,20,26,0.10), 0 2px 6px rgba(20,20,26,0.05)',
      },
    },
  },
  plugins: [],
}