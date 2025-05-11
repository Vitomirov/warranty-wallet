import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://devitowarranty.xyz/api')
  }
});
