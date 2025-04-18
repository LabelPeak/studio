import zjutjh from "@zjutjh/eslint-config";

export default zjutjh({
  ts: {
    parserOptions: {
      project: ["tsconfig.eslint.json", "**/packages/*/tsconfig.json", "**/apps/*/tsconfig.json"]
    }
  },
  prettier: true
});
