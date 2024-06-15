const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		container: {
			center: true,
			padding: '1.562rem',
		},
		screens: {
			sm: '640px',
			md: '768px',
			contain: '794px',
			lg: '1024px',
			xl: '1440px',
			'max-height-nav': { raw: '(max-height:750px)' },
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: '#fff',
			black: '#000',
			teal: {
				300: '#C5EBEB',
				400: '#089C9C',
				500: '#026572',
			},
			green: {
				300: '#D0F3DC',
				400: '#39BC66',
				500: '#018847',
			},
			'soft-green': {
				300: '#DEF5D3',
				400: '#A0D088',
				500: '#549D3A',
			},
			yellow: {
				300: '#FCF8D1',
				400: '#EED65B',
				500: '#D4A600',
			},
			orange: {
				300: '#FFE8D2',
				400: '#FFA578',
				500: '#CA6438',
			},
			red: {
				300: '#FFDADA',
				400: '#FF7291',
				500: '#B43E58',
				error: '#ED0303',
			},
			purple: {
				300: '#E9D4F2',
				400: '#B666B6',
				500: '#6C2D6C',
			},
			blue: {
				300: '#DBDFF1',
				400: '#6471B4',
				500: '#2B3771',
			},
			gray: {
				100: '#F2F0EE',
				200: '#D3D2CE',
				300: '#97948D',
				400: '#62605C',
				500: '#292927',
			},
		},
		extend: {
			aspectRatio: {
				'4/3': '4 / 3',
			},
			width: {
				14: '0.88rem',
			},
			height: {
				33: '33rem',
			},
			maxWidth: {
				1200: '1200px',
				'4xxl': '960px',
			},
			spacing: {
				0.7: '.7rem',
				1.5: '1.5rem',
				6.5: '1.5625rem',
				7.5: '1.875rem',
				8.5: '2.125rem',
				11.5: '2.8125rem',
				13: '3.125rem',
				18: '4.375rem',
				20: '5rem',
				22: '5.3125rem', //85px
				25: '6.25rem', //100
				27: '7.5rem', //120
				30: '7.5rem',
				38: '9.375rem',
			},
			transformOrigin: {
				0: '0%',
			},
			zIndex: {
				'-1': '-1',
			},
			transitionTimingFunction: {
				'out-quad': 'cubic-bezier(0.5, 1, 0.89, 1)',
			},
			fontFamily: {
				sans: ['SofiaProSoft', ...defaultTheme.fontFamily.sans],
				heading: ['Gazpacho', 'Georgia', 'serif'],
			},
			fontSize: {
				s: '0.8125rem',
				xl: '1.25rem',
				xxl: '1.375rem',
				'2xxl': '1.625rem',
				'3lg': '1.75rem',
				'3xxl': '2.125rem',
				'4xxl': '2.625rem',
				'5xxl': '3.25rem',
				'6xxl': '4rem',
			},
			borderRadius: {
				'4xl': '1.875rem',
				'5xl': '2.5rem',
				'5xxl': '2.8125rem',
			},
			lineHeight: {
				smaller: '0.9',
				tighter: '1.15',
				snugger: '1.35',
				snug: '1.4',
				135: '135%',
				25: '6.25rem',
			},
			boxShadow: {
				btn: '0 5px 0 2px #000',
				btnHover: '0 8px 0 2px #000',
				btnActive: '0 0 #000',
				card: '0px 40px 60px rgba(41,41,41,0.05)',
			},
		},
	},
	plugins: [],
};
