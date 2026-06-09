// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
// https://astro.build/config
export default defineConfig({
  output: "static",
  devToolbar: {
    enabled: false,
  },
  integrations: [
    react(),
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? "kshtq64w",
      dataset: process.env.PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2026-04-16",
      useCdn: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["react/jsx-dev-runtime", "react/jsx-runtime"],
    },
    server: {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  },
});
