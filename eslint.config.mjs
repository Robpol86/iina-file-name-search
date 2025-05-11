import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPackageJson from "eslint-plugin-package-json";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import js from "@eslint/js";
import json from "@eslint/json";

export default defineConfig([
    globalIgnores(["coverage/"]),
    { languageOptions: { globals: { ...globals.node, iina: true } } },
    { files: ["**/*.js", "**/*.cjs", "**/*.mjs"], plugins: { js }, extends: ["js/recommended"] },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        ignores: ["package.json", "package-lock.json"],
        ...json.configs.recommended,
        rules: {
            "json/sort-keys": "error",
        },
    },
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
    {
        rules: {
            "package-json/require-version": "off",
            "package-json/valid-package-definition": "off",
        },
    },
]);
