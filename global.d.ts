declare module 'eslint-plugin-perfectionist/configs/recommended-natural';
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
