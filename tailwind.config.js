/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        sage: {
          DEFAULT: "#4A524A",
          light: "#5B635B",
          dark: "#3A413A"
        },
        stone: {
          DEFAULT: "#E7E5E0",
          light: "#F2F1ED",
          dark: "#D8D5D0"
        },
        dove: {
          DEFAULT: "#B7B5B0",
          light: "#C8C6C2",
          dark: "#A6A49E"
        },
        earth: {
          DEFAULT: "#2F2E2C",
          light: "#3F3E3C",
          dark: "#1F1E1C"
        },
        cloud: {
          DEFAULT: "#F8F7F5",
          light: "#FFFFFF",
          dark: "#ECEAE8"
        },
        // Accent Colors
        cosmic: {
          DEFAULT: "#3E54B8",
          light: "#4F64C9",
          dark: "#2D43A7"
        },
        burgundy: {
          DEFAULT: "#8E4F4F",
          light: "#9F5F5F",
          dark: "#7D3F3F"
        },
        lavender: {
          DEFAULT: "#E0DDE7",
          light: "#ECEAF2",
          dark: "#D4D0DC"
        },
        clay: {
          DEFAULT: "#C2B4A6",
          light: "#D3C7BC",
          dark: "#B1A190"
        },
        mist: {
          DEFAULT: "#E8EAE8",
          light: "#F5F6F5",
          dark: "#DBDCDB"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 2px #3E54B8, 0 0 4px #3E54B8' },
          '50%': { boxShadow: '0 0 8px #3E54B8, 0 0 16px #3E54B8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      transitionTimingFunction: {
        'in-out-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'spiritual': '0 0 15px rgba(62, 84, 184, 0.1)',
        'cosmic': '0 0 20px rgba(62, 84, 184, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
