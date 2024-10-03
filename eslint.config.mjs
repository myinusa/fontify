// import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import tsParser from "@typescript-eslint/parser";
import { fixupPluginRules } from "@eslint/compat";
import tsESLint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import eslintConfigPrettier from "eslint-config-prettier";
import eslint_js from "@eslint/js";
import node from "eslint-plugin-n";
import promise from "eslint-plugin-promise";
import securityNode from "eslint-plugin-security-node";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const importRules = {
  "n/no-unpublished-import": "off",
  "n/no-missing-import": "off",
};


/** @type {Awaited<import('typescript-eslint').Config>} */
export default tsESLint.config(
  eslint_js.configs.recommended,
  ...tsESLint.configs.recommendedTypeChecked,
  //   ...tsESLint.configs.recommended,
  node.configs["flat/recommended"],
  unicorn.configs["flat/all"],
  //   ...tsESLint.configs.strict,
  //   ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.ts"],
  },
  { ignores: ["pnpm-lock.yaml", "dist/**"] },
  {
    plugins: {
      sonarjs: sonarjs,
      "security-node": fixupPluginRules(securityNode),
      promise: fixupPluginRules(promise),
    },
    settings: {
      n: {
        tryExtensions: [".js", ".ts", ".d.ts"],
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.mjs"],
          defaultProject: "./tsconfig.json",
        },
        tsconfigRootDir: import.meta.name,
        // tsconfigRootDir: __dirname,
        // project: "./tsconfig.json",
        // ecmaVersion: 2022,
      },
      parser: tsESLint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  {
    rules: {
      ...sonarjs.configs.recommended.rules,
      //   ...unicorn.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      ...importRules,
    },
  }
);
