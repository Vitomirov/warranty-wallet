import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import path from "path";
import { fileURLToPath } from "url";

// Kreiramo __dirname u ES modu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  plugins: [
    ...(process.env.NODE_ENV === "production"
      ? [
          purgeCSSPlugin({
            content: [
              path.resolve(__dirname, "index.html"),
              path.resolve(__dirname, "**/*.jsx"),
              path.resolve(__dirname, "**/*.js"),
            ],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
            safelist: {
              standard: [
                "is-active",
                "is-open",
                "show",
                "fade",
                "modal-open",
                "collapsing",
              ],
              deep: [
                /^col-/,
                /^container-/,
                /^row/,
                /^btn/,
                /^alert/,
                /^card/,
                /^form-/,
                /^input-group/,
                /^navbar/,
                /^nav-/,
                /^dropdown-/,
                /^collapse/,
                /^modal/,
                /^offcanvas/,
                /^spinner-/,
                /^text-/,
                /^bg-/,
                /^shadow-/,
                /^border-/,
                /^m[y|x|t|b|e|s]-/,
                /^p[y|x|t|b|e|s]-/,
                /^d-/,
                /^float-/,
                /^position-/,
                /^justify-content-/,
                /^align-items-/,
                /^motion-/,
                /^ai-/,
                /^hook-/,
                /^layout-/,
                /^page-/,
                /^feature-/,
                /^ui-/,
                /^header-/,
                /^footer-/,
                /^dashboard-/,
                /^warranty-/,
                /^button-/,
              ],
              keyframes: [/^keyframes-/],
              variables: [/^--motion-/],
            },
          }),
        ]
      : []),
  ],
};
