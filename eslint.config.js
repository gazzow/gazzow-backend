// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import security from "eslint-plugin-security";
import prettier from "eslint-plugin-prettier";
import globals from "globals";   // 👈 You forgot this import

export default [
  {
    files: ["**/*.ts"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        myCustomGlobal: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      security,
      prettier,
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...security.configs.recommended.rules,
      "prettier/prettier": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "security/detect-object-injection": "off",
    },
  },
];
