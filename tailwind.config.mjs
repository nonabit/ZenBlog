/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			serif: ['"Newsreader"', 'serif'],
			sans: ['"Inter"', 'sans-serif'],
			mono: ['"JetBrains Mono"', 'monospace'],
		},
		extend: {
			colors: {
				// 可以在这里添加你的品牌色
			},
            // --- 新增：定制 typography 插件样式 ---
			typography: (theme) => ({
				DEFAULT: {
					css: {
                        // 强制标题使用衬线体 (Newsreader)
						'h1, h2, h3, h4, h5, h6': {
							fontFamily: theme('fontFamily.serif'),
							fontWeight: '600', 
                            letterSpacing: '-0.025em',
						},
                        // 优化代码块样式
						'code::before': { content: '""' }, // 去掉行内代码的反引号
						'code::after': { content: '""' },
                        'blockquote': {
                            fontStyle: 'normal',
                            borderLeftColor: theme('colors.zinc.300'),
                        },
					},
				},
                // 针对暗色模式的微调
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