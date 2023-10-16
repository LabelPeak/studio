import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mock.apifox.cn/m1/3414599-0-default",
        changeOrigin: true
      },
    },
  },
});