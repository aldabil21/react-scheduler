import react from "eslint-plugin-react";
import tseslint, { configs as tseslintConfigs } from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";
import * as reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPromise from "eslint-plugin-promise";

export default tseslint.config(
  { ignores: ["jest.config.ts", "scripts", "dist", "vite.config.js"] },
  pluginJsxA11y.flatConfigs.recommended,
  pluginPromise.configs["flat/recommended"],
  pluginImport.flatConfigs.recommended,
  {
    extends: [js.configs.recommended, ...tseslintConfigs.recommended],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
    },
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: "readonly",
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      "linebreak-style": ["error", "unix"],

      quotes: [
        "error",
        "double",
        {
          allowTemplateLiterals: true,
        },
      ],

      semi: ["error", "always"],
      "@typescript-eslint/no-non-null-assertion": 0,
      "no-useless-catch": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-non-null-asserted-optional-chain": 0,
      "no-case-declarations": 0,
      "@typescript-eslint/no-empty-interface": 0,
      "@typescript-eslint/no-empty-function": 0,
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
    },
  },
  {
    // Checks importing of different files
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./",
        },
      },
    },
  }
);
