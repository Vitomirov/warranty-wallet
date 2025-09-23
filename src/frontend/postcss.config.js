import purgecss from "@fullhuman/postcss-purgecss";
import path from "path";
import { fileURLToPath } from "url";

// Kreiramo __dirname u ES modu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  plugins: [
    ...(process.env.NODE_ENV === "production"
      ? [
          purgecss({
            content: [
              path.resolve(__dirname, "index.html"),
              path.resolve(__dirname, "src/**/*.js"),
              path.resolve(__dirname, "src/**/*.jsx"),
              // Dodata putanja za skeniranje Bootstrap JavaScript fajlova.
              // Neke Bootstrap klase se dinamički dodaju.
              path.resolve(__dirname, "node_modules/bootstrap/dist/js/*.js"),
            ],
            defaultExtractor: (content) => {
              // regex za sve klase, uključujući dinamičke
              const classes = content.match(/[\w-/:]+(?<!:)/g) || [];
              // Neke klase koje koristi React Bootstrap i koje PurgeCSS ne prepoznaje uvek
              const reactBootstrapSafelist = [
                "show",
                "fade",
                "collapsing",
                "modal-open",
              ];
              return [...classes, ...reactBootstrapSafelist];
            },
            safelist: {
              // Osnovne klase
              standard: ["is-active", "is-open"],
              // Dinamičke klase i klase iz Bootstrap-a
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
                // Klase koje se koriste u tvojim komponentama
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
            // Korisno za debagovanje
            rejected: process.env.NODE_ENV === "development",
          }),
        ]
      : []),
  ],
};
