import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'dc-dark': '#000000',
        'dc-light': '#ebebeb',
        'dc-muted': '#707070',
      },
      borderRadius: {
        'card': '15.36px',
        'btn': '7.68px',
        'nav': '15.36px',
        'nav-link': '9.22px',
      },
    },
  },
  plugins: [],
}

export default config
