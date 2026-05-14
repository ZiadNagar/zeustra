import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import robotsTxt from "astro-robots-txt";
import { loadEnv } from "vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
const site = (
  process.env.PUBLIC_SITE_ORIGIN ??
  env.PUBLIC_SITE_ORIGIN ??
  "https://zeustra.osloop.com"
).replace(/\/+$/g, "");

const adapterTarget = (
  process.env.ASTRO_ADAPTER ??
  env.ASTRO_ADAPTER ??
  (process.env.VERCEL ? "vercel" : "node")
).toLowerCase();
const adapter = (() => {
  switch (adapterTarget) {
    case "node":
      return node({
        mode: "standalone",
      });
    case "vercel":
      return vercel();
    default:
      throw new Error(
        `Unsupported ASTRO_ADAPTER="${adapterTarget}". Use "node" or "vercel".`,
      );
  }
})();

// https://astro.build/config
export default defineConfig({
  site,
  output: "server",
  adapter,
  trailingSlash: "always",
  integrations: [react(), sitemap(), robotsTxt()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
