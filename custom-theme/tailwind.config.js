const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: require('fast-glob').sync([
        './blocks/**/*.php',
        './blocks/**/*.js',
        './template-parts/**/*.php',
        '*.php',
    ]),
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: '#ffffff',
            black: '#000000',
        },
        extend: {
            fontFamily: {
                sans: ['Arial', ...defaultTheme.fontFamily.sans],
                heading: ['Helvetica Neue'],
            },
        },
    },
    plugins: [],
};
