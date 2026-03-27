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

function fontPreloadPlugin() {
  return {
    name: "font-preload",
    transformIndexHtml: {
      order: "post" as const,
      handler(_html: string, ctx: { bundle?: Record<string, unknown> }) {
        if (!ctx.bundle) return [];
        return Object.keys(ctx.bundle)
          .filter((name) => /inter-latin-\d{3}-normal.*\.woff2$/.test(name))
          .map((name) => ({
            tag: "link",
            attrs: {
              rel: "preload",
              href: `/${name}`,
              as: "font",
              type: "font/woff2",
              crossorigin: "",
            },
            injectTo: "head" as const,
          }));
      },
    },
  };
}

export default defineConfig({
  root: "src",
  publicDir: path.resolve("public"),
  plugins: [buildTokensPlugin(), fontPreloadPlugin()],
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
