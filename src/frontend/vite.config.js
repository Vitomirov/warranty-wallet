import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

import pkg from "@fullhuman/postcss-purgecss";
const purgecss = pkg.default;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [react()];
  const isProduction = mode === "production";

  if (isProduction) {
    plugins.push(visualizer({ open: true, filename: "dist/stats.html" }));
  }

  return {
    plugins,
    base: "/",
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          isProduction &&
            purgecss({
              content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
              safelist: {
                standard: [
                  "show",
                  "fade",
                  "collapsing",
                  "modal-open",
                  "modal-backdrop",
                ],
                deep: [/^col-/, /^row/, /^btn/, /^modal/, /^nav/, /^navbar/],
              },
            }),
        ].filter(Boolean),
      },
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
