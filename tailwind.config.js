/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#08294F",
          foreground: "#FFFFFF",
          50: "#EEF4FC",
          100: "#D5E4F8",
          200: "#ACC7F1",
          300: "#7CA7E7",
          400: "#4984DC",
          500: "#2263C7",
          600: "#164B9F",
          700: "#0F3879",
          800: "#0D3768",
          900: "#08294F",
          950: "#04162C",
        },
        secondary: {
          DEFAULT: "#0D3768",
          foreground: "#FFFFFF",
        },
        brandBlue: {
          DEFAULT: "#1687E8",
          light: "#E7F3FD",
          hover: "#116DBE",
        },
        brandTeal: {
          DEFAULT: "#08A7A4",
          light: "#E6F6F6",
          hover: "#068684",
        },
        brandDanger: {
          DEFAULT: "#FF4664",
          light: "#FFF0F2",
          hover: "#D92E4B",
        },
        brandWarning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        brandSuccess: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
        },
        surface: {
          DEFAULT: "#F5F8FC",
          card: "#FFFFFF",
          sidebar: "#08294F",
          sidebarHover: "#0D3768",
        },
        border: "hsl(var(--border, 214 32% 91%))",
        input: "hsl(var(--input, 214 32% 91%))",
        ring: "#1687E8",
      },
      borderRadius: {
        lg: "16px",
        md: "14px",
        sm: "10px",
        xl: "18px",
        "2xl": "22px",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(8, 41, 79, 0.06), 0 4px 6px -2px rgba(8, 41, 79, 0.03)',
        'soft-md': '0 4px 20px -2px rgba(8, 41, 79, 0.08), 0 2px 8px -1px rgba(8, 41, 79, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(8, 41, 79, 0.1), 0 4px 12px -2px rgba(8, 41, 79, 0.05)',
        'sidebar': '4px 0 24px 0 rgba(4, 22, 44, 0.15)',
      },
      fontFamily: {
        sans: ['Sarabun', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        thai: ['Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
