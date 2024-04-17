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
