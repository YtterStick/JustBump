import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0efff',
                    200: '#b8dcff',
                    300: '#7ac0ff',
                    400: '#3aa0ff',
                    500: '#0a7aff',
                    600: '#005ed4',
                    700: '#004aab',
                    800: '#003d8d',
                    900: '#003474',
                },
                surface: {
                    50: '#f8f9fb',
                    100: '#f1f3f5',
                    200: '#e9ecef',
                    300: '#dee2e6',
                },
            },
        },
    },
    plugins: [],
};

export default config;
