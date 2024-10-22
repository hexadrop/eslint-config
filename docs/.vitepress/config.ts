import { defineConfig } from "vitepress";

export default defineConfig({
	title: "Hexadrop's ESLint configuration",
	description:
		"Opinionated ESLint ruleset designed for large teams and projects considering modern JavaScript best practices and providing consistency to your code.",
	head: [
		[
			"link",
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/hexadrop.svg",
			},
		],
	],
	cleanUrls: true,
	lastUpdated: true,
	themeConfig: {
		siteTitle: '@hexadrop/eslint-config',
		logo: "/tailwindcss.svg",
		nav: [
			{
				text: "ESlint",
				link: "https://eslint.org/",
			},
		],
		sidebar: [],
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/hexadrop/eslint-config",
			},
		],
		footer: {
			message: "Released under the MIT license.",
			copyright: "© 2023-present Hexadrop",
		},
		editLink: {
			pattern:
				"https://github.com/hexadrop/eslint-config/edit/master/docs/:path",
		},
		search: {
			provider: "local",
		},
	},
});
