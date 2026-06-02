/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/App.tsx",
        "./src/pages/**/*.tsx",
        "./src/components/**/*.tsx",
        "./src/main.tsx",
    ],
    theme: {
        extend: {
            fontFamily: {

            },
            colors: {
                primary: '#073249',
                secondary: '#2c86ac',
                black: '#000',
                light: '#e4ecef',
                gray: '#6b6b6b',
                accent: '#FF7F50',
                shadow: 'rgba(0, 0, 0, 0.1)'
            }
        },
    },
    plugins: [],
}