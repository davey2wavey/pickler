import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export const ignores = globalIgnores([
  "node_modules/**",
  "dist/**",
  ".next/**",
  ".turbo/**",
  "coverage/**",
  "playwright-report/**",
  "test-results/**",
  "next-env.d.ts",
]);

export const baseConfig = defineConfig([
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  prettier,
]);
