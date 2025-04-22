/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'deep-space': '#0A0B0F',
        'cosmic-purple': '#6E3AFF',
        'stellar-blue': '#2B7FFF',
        'nova-mint': '#00E5B0',
        'star-white': '#F8F9FA',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 32px rgba(31, 38, 135, 0.15)',
        'glow': '0 0 25px rgba(110, 58, 255, 0.5)',
        'blue-glow': '0 0 25px rgba(43, 127, 255, 0.5)',
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(135deg, #6E3AFF 0%, #2B7FFF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(10, 11, 15, 0.95), rgba(10, 11, 15, 0.8))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shine': 'shine 8s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
};