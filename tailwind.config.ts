import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#1E6B3A',
        'brand-burgundy': '#8B1A1A',
        'brand-gray': '#9B9588',
        'brand-cream': '#F7F5F0',
      },
      fontFamily: {
        'league-spartan': ['League Spartan', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
