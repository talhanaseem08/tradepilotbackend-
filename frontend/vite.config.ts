import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /** Default matches Docker Compose `3001:3000`. Override with VITE_PROXY_TARGET (e.g. http://127.0.0.1:3000 for local node). */
  const proxyTarget =
    env.VITE_PROXY_TARGET || "http://127.0.0.1:3001";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: "/",
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
