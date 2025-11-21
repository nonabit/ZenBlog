/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			// 衬线体栈：Newsreader (英) -> Noto Serif SC (中) -> 系统宋体
			serif: ['"Newsreader"', '"Noto Serif SC"', '"PingFang SC"', '"Microsoft YaHei"', 'serif'],
			// 无衬线栈：Inter (英) -> Noto Sans SC (中) -> 系统黑体
			sans: ['"Inter"', '"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
			// 等宽栈：JetBrains Mono (英) -> Noto Sans SC (中)
			mono: ['"JetBrains Mono"', '"Noto Sans SC"', 'monospace'],
		},
		extend: {
			colors: {
				// 可以在这里添加你的品牌色
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'h1, h2, h3, h4, h5, h6': {
							fontFamily: theme('fontFamily.serif'),
							fontWeight: '700',
							letterSpacing: '-0.025em',
						},
						// --- 这里是控制段落的核心 ---
						'p': {
							textAlign: 'justify',
							textJustify: 'inter-ideograph',
							// [关键参数 1] 段落间距
							// 默认是 1.25em，你可以尝试改为 0.75em, 0.8em 或 1em
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},
						'code::before': { content: '""' },
						'code::after': { content: '""' },
						'blockquote': {
							fontStyle: 'normal',
							borderLeftColor: theme('colors.zinc.300'),
						},
					},
				},
				invert: {
					css: {
						'blockquote': {
							borderLeftColor: theme('colors.zinc.700'),
						},
					}
				}
			}),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}