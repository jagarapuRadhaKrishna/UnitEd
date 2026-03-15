import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const terminalLogRelay = (): Plugin => ({
  name: "terminal-log-relay",
  configureServer(server) {
    server.middlewares.use("/__dev-log", (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return;
      }

      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const payload = JSON.parse(body) as { title?: string; lines?: string[] };
          const title = payload.title || "Browser Log";
          const lines = Array.isArray(payload.lines) ? payload.lines : [];

          console.log(`\n[relay] ${title}`);
          lines.forEach((line) => console.log(line));
        } catch (error) {
          console.error("[relay] Failed to parse browser log payload:", error);
        }

        res.statusCode = 204;
        res.end();
      });
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), terminalLogRelay()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
