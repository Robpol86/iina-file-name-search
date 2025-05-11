import { defineConfig } from "eslint/config";
import eslintPluginPackageJson from "eslint-plugin-package-json";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
    { languageOptions: { globals: { ...globals.node, iina: true } } },
    { plugins: { js }, extends: ["js/recommended"] },
    {
        rules: {
            "no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
            "prettier/prettier": [
                "error",
                {
                    printWidth: 120,
                    tabWidth: 4,
                },
            ],
            "sort-imports": ["error", {}],
        },
    },
    eslintPluginPrettierRecommended,
    eslintPluginPackageJson.configs.recommended,
]);
