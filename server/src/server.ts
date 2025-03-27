import envs, { isDebug } from "./Environment.ts";
if (!isDebug() && Deno.uid() !== 0) {
  console.error("This server must be run as root.");
  Deno.exit(1);
}
import process from "node:process";
// @deno-types="@types/express"
import express from "express";
import { type HmrOptions } from "vite";
import ApiController from "./controllers/ApiController.ts";
import Migrations from "./database/migrations.ts";
import { sequelize } from "./database/sequelize.ts";
import fs from "node:fs";

if (!fs.existsSync(envs.APPDIR)) {
  fs.mkdirSync(envs.APPDIR, { recursive: true });
}


console.log("Starting server...");
if (isDebug()) {
  console.log(`Debug mode: ${envs.DEBUG}`);
  console.log(`Environment: ${envs.NODE_ENV}`);
  const __dirs = [envs.APPDIR, envs.NGINX_DIR, envs.NGINX_AVAILABLE_DIR, envs.NGINX_ENABLED_DIR, envs.NGINX_MANAGED];
  console.log(`Using directories:`);
  for (let i = 0; i < __dirs.length; i++) {
    console.log(`  ${__dirs[i]}`);
  }
}


const app = express();

// Check arguments
const args = process.argv;
envs.NODE_ENV = "development";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--env") {
    envs.NODE_ENV = args[i + 1];
    args.splice(i, 2);
    i--;
    continue;
  }

  if (args[i] === "--port") {
    envs.PORT = args[i + 1];
    args.splice(i, 2);
    i--;
    continue;
  }
  
  if (args[i] === "--migration-up") {
    try {
      await Migrations.runMigrations(sequelize);
    } catch (error) {
      console.error(error);
    }
    process.exit(0);
  }

  if (args[i] === "--migration-down") {
    try {
      await Migrations.rollbackMigrations(sequelize);
    } catch (error) {
      console.error(error);
    }
    process.exit(0);
  }
}

// Apply the API controller to the /api route.
// The API is responsible for serving JSON data for the headless CMS.
app.use("/api", ApiController.router);

// Deploying the server for either production or development.
// When compiled, the server will only work in production mode.
if (envs.NODE_ENV === "production") {
  serveWebApp(app);
  const port = +(envs.PORT || 3000);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port} in ${envs.NODE_ENV} mode`);
  });
}
else {
  const vite = await serveViteServer(app);
  const port = +(envs.PORT || 3000);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port} in ${envs.NODE_ENV} mode`);
    console.log(`Server websocket at ws://localhost:${(vite.config.server.hmr as HmrOptions)?.port}`);
  });
}




// Helpers for serving the web app for prod or dev
function serveWebApp(app: express.Application) {
  app.use(express.static("dist"));
}

async function serveViteServer(app: express.Application) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: {
      middlewareMode: true,
      host: "0.0.0.0",
      port: 3000,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 24678
      }
    }
  });
  app.use(vite.middlewares);

  return vite;
}