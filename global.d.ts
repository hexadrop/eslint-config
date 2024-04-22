declare module 'eslint-plugin-markdown';
declare module 'eslint-plugin-n';
declare module 'eslint-plugin-perfectionist/configs/recommended-natural';
declare module 'eslint-plugin-react';
declare module 'eslint-plugin-react-hooks';
declare module 'eslint-plugin-react-refresh';
declare module 'eslint-plugin-unicorn';
declare module 'eslint-plugin-unused-imports';

declare namespace NodeJS {
	interface ProcessEnv {
		CI?: unknown;
		JETBRAINS_IDE?: unknown;
		VIM?: unknown;
		VSCODE_CWD?: unknown;
		VSCODE_PID?: unknown;
	}
}
