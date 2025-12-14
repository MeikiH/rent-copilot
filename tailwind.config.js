/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{vue,js}",
    "./app/layouts/**/*.vue", 
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/nuxt.config.{js,ts}",
    "./app/**/*.{vue,js,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

