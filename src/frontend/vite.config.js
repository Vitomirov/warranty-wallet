import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import purgecssPkg from "@fullhuman/postcss-purgecss";

const purgecss = purgecssPkg.default;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  const plugins = [react()];
  if (isProd) {
    plugins.push(visualizer({ open: true, filename: "dist/stats.html" }));
  }

  return {
    plugins,
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      chunkSizeWarningLimit: 200,
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor-react";
              if (id.includes("react-dom")) return "vendor-react-dom";
              if (id.includes("axios")) return "vendor-axios";
              if (id.includes("bootstrap")) return "vendor-bootstrap";
              return "vendor-other";
            }
            if (id.includes("Dashboard")) return "dashboard";
            if (id.includes("Features")) return "features";
            if (id.includes("MyAccount")) return "myAccount";
            if (id.includes("NewWarranty")) return "newWarranty";
            if (id.includes("WarrantyDetails")) return "warrantyDetails";
            if (id.includes("DeleteWarranty")) return "deleteWarranty";
            if (id.includes("AIChat")) return "aichat";
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          isProd &&
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
