import zjutjh from "@zjutjh/eslint-config";

export default zjutjh(
  {
    react: true,
    ts: {
      parserOptions: {
        projectService: {
          defaultProject: "tsconfig.eslint.json"
        },
        project: ["tsconfig.eslint.json", "**/packages/*/tsconfig.json", "**/apps/*/tsconfig.json"]
      }
    },
    prettier: true,
    overrides: {
      ts: {
        "@typescript-eslint/no-unnecessary-condition": "error"
      }
    }
  },
  {
    rules: {
      curly: ["error", "all"]
    }
  }
);
