// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    react(),
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? "kshtq64w",
      dataset: process.env.PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2026-04-16",
      useCdn: false,
      studioBasePath: "/admin",
      studioRouterHistory: "hash",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  },
});
