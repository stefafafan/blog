import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['selector'],
  content: ['./src/**/*.{astro,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['UD明朝', ...defaultTheme.fontFamily.sans],
        mono: ['UD明朝', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        additive: {
          DEFAULT: 'hsl(var(--additive))',
          foreground: 'hsl(var(--additive-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        link: 'hsl(var(--link))',
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              'font-size': '2rem',
            },
            h2: {
              'font-size': '1.4rem',
            },
            h3: {
              'font-size': '1.2rem',
            },
            h4: {
              'font-size': '1.1rem',
            },
            h5: {
              'font-size': '1.1rem',
            },
            h6: {
              'font-size': '1.1rem',
            },
            p: {
              'font-size': '1.1rem',
            },
            li: {
              'font-size': '1.1rem',
            },
            a: {
              color: 'hsl(var(--link))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}

export default config
