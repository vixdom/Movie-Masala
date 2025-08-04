import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { getPortFromEnvOrAllocate } from "./utils/portManager";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export interface ViteSetupOptions {
  /** HMR port (will be dynamically allocated if not provided) */
  hmrPort?: number;
}

export async function setupVite(app: Express, server: Server, options: ViteSetupOptions = {}) {
  // Dynamically allocate HMR port if not provided
  const hmrPort = options.hmrPort || await getPortFromEnvOrAllocate(
    'VITE_HMR_PORT',
    24678, // Base port for Vite HMR
    'vite-hmr'
  );
  
  log(`🔥 Setting up Vite with HMR on port ${hmrPort}`, 'vite');
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { 
      server,
      port: hmrPort,
      host: 'localhost'
    },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      ...viteConfig.server,
      ...serverOptions,
      // Override any hardcoded ports in vite config
      port: undefined, // Let middleware mode handle this
      strictPort: false // Allow port flexibility
    },
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
        target: 'http://localhost:5000',
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
