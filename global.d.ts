declare module 'eslint-plugin-unused-imports';

declare namespace NodeJS {
	interface ProcessEnv {
		VSCODE_PID?: unknown;
		VSCODE_CWD?: unknown;
		JETBRAINS_IDE?: unknown;
		VIM?: unknown;
		CI?: unknown;
	}
}
