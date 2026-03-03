/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#A0C4FF',
					foreground: '#4A4A4A',
				},
				secondary: {
					DEFAULT: '#BDB2FF',
					foreground: '#4A4A4A',
				},
				accent: {
					DEFAULT: '#FDFFB6',
					foreground: '#4A4A4A',
				},
				destructive: {
					DEFAULT: '#FFADAD',
					foreground: '#4A4A4A',
				},
				success: {
					DEFAULT: '#CAFFBF',
					foreground: '#4A4A4A',
				},
				muted: {
					DEFAULT: '#F7F5F9',
					foreground: '#4A4A4A',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#4A4A4A',
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#4A4A4A',
				},
				pastel: {
					cream: '#FDFCF8',
					lavender: '#F7F5F9',
					blue: '#A0C4FF',
					yellow: '#FDFFB6',
					red: '#FFADAD',
					green: '#CAFFBF',
					purple: '#BDB2FF',
					pink: '#FFD6FF',
					peach: '#FFEEB5',
					mint: '#C8F7C5',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					from: { opacity: 0, transform: 'translateY(10px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				'slide-in': {
					from: { opacity: 0, transform: 'translateX(-20px)' },
					to: { opacity: 1, transform: 'translateX(0)' },
				},
				'scale-in': {
					from: { opacity: 0, transform: 'scale(0.95)' },
					to: { opacity: 1, transform: 'scale(1)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
