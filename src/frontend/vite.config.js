import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",
    build: {
      outDir: "dist",
    },
    css: {
      postcss: "./postcss.config.js",
    },
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
    server: {
      host: true,
      port: 5173,
    },
  };
});
