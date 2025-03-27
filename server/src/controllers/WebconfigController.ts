import { json, Router } from "express";
import fs from "node:fs";
import fsp from "node:fs/promises";
import Env from "../Environment.ts";
import { promisify } from "node:util";
import Nginx from "../nginx/Nginx.ts";

const exists = promisify(fs.exists);

namespace WebconfigController {
  export const router = Router();
  
  router.get("/", async (_req, res) => {
    if (!await exists(Env.NGINX_AVAILABLE_DIR)) {
      await fsp.mkdir(Env.NGINX_AVAILABLE_DIR, { recursive: true });
    }
    const webconfigs = await Nginx.getConfigs();

    res.json({
      webconfigs: await Promise.all(webconfigs.map(async (config) => {
        return {
          id: config,
          enabled: await Nginx.getConfigEnabled(config),
          ...await Nginx.getConfigDetails(config)
        };
      }))
    });
  });

  router.get("/test", (req, res) => {
    res.send(`<pre>
      ${new Nginx.NginxConfigBlock(Nginx.blocks.server).parse({
        serverName: "ionnet.dev",
        serverNames: ["ionnet.dev", "www.ionnet.dev"],
        listen: 443,
        ssl: true,
        phpVersion: 8.3,
      })}

      ${new Nginx.NginxConfigBlock(Nginx.blocks.server_redirect).parse({
        serverName: "ionnet.dev",
        serverNames: ["ionnet.dev", "www.ionnet.dev"],
        listen: 80,
        $server_redirect: {
          redirectUrl: "https://ionnet.dev$request_uri",
        }
      })}
    </pre>`);
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const config = await Nginx.getConfig(id);
    const enabled = await Nginx.getConfigEnabled(id);
    const managed = /^#IONNET~MANAGED$/.test(config.split("\n")[0]);

    res.json({
      id,
      config,
      enabled,
      managed,
      ...await Nginx.getConfigDetails(id)
    });
  });

  router.put("/:id", json(), async (req, res) => {
    const id = req.params.id;
    const config = req.body.config;
    await fsp.writeFile(`${Env.NGINX_AVAILABLE_DIR}/${id}`, config);
    res.json({
      message: "Saved"
    });
  });

  router.get("/:id/status", async (req, res) => {
    const id = req.params.id;
    const enabled = await Nginx.getConfigEnabled(id);
    res.json({
      enabled
    });
  });

  router.post("/:id/enable", async (req, res) => {
    const id = req.params.id;
    await Nginx.enableConfig(id);
    res.json({
      message: "Enabled"
    });
  });

  router.post("/:id/disable", async (req, res) => {
    const id = req.params.id;
    await Nginx.disableConfig(id);
    res.json({
      message: "Disabled"
    });
  });

  router.get("/:id/config", async (req, res) => {
    const id = req.params.id;
    const config = await Nginx.getConfig(id);
    res.send(config);
  });
}

export default WebconfigController;