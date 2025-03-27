import { Router } from "express";
import Nginx from "../nginx/Nginx.ts";


namespace NginxController {
  export const router = Router();
  
  router.get("/restart", async (_req, res) => {
    try {
      await Nginx.restart();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  router.get("/reload", async (_req, res) => {
    try {
      await Nginx.reload();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
}

export default NginxController;