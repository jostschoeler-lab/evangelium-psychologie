// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function consoleRelay() {
  return {
    name: "console-relay",
    apply: "serve",
    configureServer(server: any) {
      server.ws.on("custom:console", (data: { level: string; args: string[] }) => {
        const { level, args } = data || { level: "log", args: [] };
        const text = args.join(" ");
        const logger = server.config.logger;
        switch (level) {
          case "error":
            logger.error(`[browser] ${text}`);
            break;
          case "warn":
            logger.warn(`[browser] ${text}`);
            break;
          case "info":
            logger.info(`[browser] ${text}`);
            break;
          default:
            logger.info(`[browser] ${text}`);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), consoleRelay()],
  server: {
    port: 5176,
    open: false,
  },
  preview: {
    port: 5176,
  },
});
