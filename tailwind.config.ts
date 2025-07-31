import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))', // Explicitly define background color
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        elevate: {
          dark: '#1A1F2C',
          light: '#F1F1F1',
          accent: '#0EA5E9',
          muted: '#94A3B8',
          'accent-light': '#38BDF8',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'thunder': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.10) rotate(-10deg)' },
          '50%': { transform: 'scale(1.12) rotate(8deg)' },
          '80%': { transform: 'scale(0.98) rotate(-7deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' }
        },
        'thunder-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 #0EA5E9', opacity: '0.7' },
          '70%': { boxShadow: '0 0 25px 8px #0EA5E9', opacity: '1' }
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-10deg)' }
        },
        'spotlight-expand-width': {
          'from': { width: '15rem', opacity: '0.3' },
          'to': { width: '30rem', opacity: '0.6' }
        },
        'spotlight-move-up': {
          'from': { opacity: '0.3', transform: 'translateY(100px)' },
          'to': { opacity: '0.8', transform: 'translateY(0)' }
        },
        'spotlight-expand-small-width': {
          'from': { width: '8rem', opacity: '0.2' },
          'to': { width: '16rem', opacity: '0.4' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'thunder': 'thunder 0.6s cubic-bezier(.6, .2, .6, 1.1)',
        'thunder-glow': 'thunder-glow 0.8s infinite alternate',
        'wave': 'wave 2s ease-in-out infinite',
        'spotlight-width': 'spotlight-expand-width 1.2s ease-in-out 0.5s forwards',
        'spotlight-up': 'spotlight-move-up 1.2s ease-in-out 0.8s forwards',
        'spotlight-small-width': 'spotlight-expand-small-width 1.2s ease-in-out 0.5s forwards'
      },
      screens:{
        'lg-custom': '1140px',
        'sm-custom': '500px'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
