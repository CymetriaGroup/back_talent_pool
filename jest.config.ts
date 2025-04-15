import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	moduleFileExtensions: ["ts", "js", "json"],
	testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	clearMocks: true,
	coverageDirectory: "coverage",

	setupFiles: ["<rootDir>/jest.config.ts"],

	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
				diagnostics: true,
			},
		],
	},

	transformIgnorePatterns: ["<rootDir>/node_modules/"],

	collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts", "!src/**/types.ts", "!src/**/constants.ts"],
};

export default config;
