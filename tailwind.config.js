/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'pitch-green': '#10b981',
                'dark-turf': '#064e3b',
            },
            fontFamily: {
                sans: ['Saira', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
