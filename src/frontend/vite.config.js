import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import purgecssPkg from "@fullhuman/postcss-purgecss";

const purgecss = purgecssPkg.default;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  const plugins = [react()];
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
      chunkSizeWarningLimit: 300, // manji threshold
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Node modules razdvojeno po biblioteci
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor-react";
              if (id.includes("react-dom")) return "vendor-react-dom";
              if (id.includes("react-router-dom")) return "vendor-router";
              if (id.includes("axios")) return "vendor-axios";
              if (id.includes("framer-motion")) return "vendor-framer-motion";
              if (id.includes("bootstrap")) return "vendor-bootstrap";
              return "vendor-other";
            }
            // Dashboard chunkovi
            if (id.includes("Dashboard")) return "dashboard";
            if (id.includes("WarrantiesList")) return "dashboard-list";
            if (id.includes("DeleteWarranty")) return "dashboard-delete";
            if (id.includes("AddWarrantyButton")) return "dashboard-add";
            // AIChat
            if (id.includes("AIChat")) return "aichat";
            return null;
          },
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
    server: { host: true, port: 5173 },
  };
});
