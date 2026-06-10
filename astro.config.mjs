// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { sendContactEmail, validateContactPayload } from "./src/lib/contact.js";

const isDevelopment = process.argv.includes("dev");

function contactDevApi() {
  return {
    name: "amberhome-contact-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (request, response, next) => {
        if (request.method !== "POST") {
          next();
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const rawBody = Buffer.concat(chunks).toString("utf-8");
          const contentType = request.headers["content-type"] ?? "";
          const body = contentType.includes("application/json")
            ? JSON.parse(rawBody || "{}")
            : Object.fromEntries(new URLSearchParams(rawBody));
          const validation = validateContactPayload(body);

          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.setHeader("Cache-Control", "no-store");

          if (!validation.ok || !validation.payload) {
            response.statusCode = 400;
            response.end(JSON.stringify({ message: validation.message }));
            return;
          }

          await sendContactEmail(validation.payload);
          response.statusCode = 200;
          response.end(JSON.stringify({
            ok: true,
            message: "Paldies. Jūsu pieprasījums nosūtīts uz info@amberhome.lv.",
          }));
        } catch (error) {
          console.error("[contact-dev-api]", error);
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({
            message: "Neizdevās nosūtīt pieprasījumu. Rakstiet uz info@amberhome.lv.",
          }));
        }
      });
    },
  };
}
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
    plugins: [tailwindcss(), contactDevApi()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          "process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
        },
      },
    },
    server: {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  },
});
