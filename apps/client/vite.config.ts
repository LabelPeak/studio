import { defineConfig, loadEnv } from "vite";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), UnoCSS()],
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.DEV_PROXY,
          changeOrigin: true
        },
      },
    },
  };
});