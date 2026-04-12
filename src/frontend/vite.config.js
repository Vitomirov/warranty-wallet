import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  const plugins = [react()];
  if (isProduction) {
    plugins.push(visualizer({ open: true, filename: "dist/stats.html" }));
  }

  return {
    plugins,
    base: "/warrantywallet/",
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      chunkSizeWarningLimit: 300,
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Rešava fatalnu 'createContext' grešku
            if (id.includes("node_modules")) {
              return "vendor-bundle";
            }

            // Vaše custom grupisanje koda
            if (id.includes("Dashboard")) return "dashboard";
            if (id.includes("WarrantiesList")) return "dashboard-list";
            if (id.includes("DeleteWarranty")) return "dashboard-delete";
            if (id.includes("AddWarrantyButton")) return "dashboard-add";
            if (id.includes("AIChat")) return "aichat";

            return null;
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [], // Prazan niz isključuje PurgeCSS
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
