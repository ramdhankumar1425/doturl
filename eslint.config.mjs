import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
	eslintConfigPrettier,
	globalIgnores([
		"node_modules/**/*",
		"apps/*/node_modules",
		"dist",
		"build",
		".next",
		".vercel",
		".turbo",
		".cache",
		".eslintcache",
		"coverage",
		"*.tsbuildinfo",
		"*.log",
		"npm-debug.log*",
		"yarn-debug.log*",
		"yarn-error.log*",
		"pnpm-debug.log*",
		".env",
		".env.*",
		".DS_Store",
		"Thumbs.db",
		".vscode",
		"prisma/migrations/*/README.md",
		"prisma/migrations/*/migration.sql",
		"prisma/migrations/*/migration_lock.toml",
		"artillery-report.json",
	]),
]);
