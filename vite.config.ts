import { defineConfig } from "vite";
import { execSync } from "node:child_process";
import path from "node:path";

function buildTokensPlugin() {
  return {
    name: "build-tokens",
    buildStart() {
      execSync("node scripts/build-tokens.mjs", { stdio: "inherit" });
    },
  };
}

export default defineConfig({
  root: "src",
  publicDir: path.resolve("public"),
  plugins: [buildTokensPlugin()],
  resolve: {
    alias: {
      "@tokens": path.resolve("dist/tokens.css"),
    },
  },
  build: {
    outDir: path.resolve("site"),
    emptyOutDir: true,
  },
});
