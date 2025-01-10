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
        },
        border: "rgb(229 231 235)",
        input: "rgb(229 231 235)",
        ring: "rgb(59 130 246)",
        background: "transparent", // Set global background transparency
        foreground: "rgb(15 23 42)",
      },
      backgroundColor: (theme) => ({
        ...theme('colors'),
        gray: {
          50: "transparent", // Override bg-gray-50 to be transparent
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate")],
};
