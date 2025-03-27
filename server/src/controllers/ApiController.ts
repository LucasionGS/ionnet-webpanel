// @deno-types="@types/express"
import { Router } from "express";
import CookieParser from "cookie-parser";
import UserController from "./UserController.ts";
import WebconfigController from "./WebconfigController.ts";
import envs from "../Environment.ts";
import NginxController from "./NginxController.ts";

namespace ApiController {
  export const router = Router();
  
  router.get("/", (_req, res) => {
    res.json({
      message: "Hello from the API!"
    });
  });

  router.use("/user", CookieParser(), UserController.router);
  router.use("/webconfig", WebconfigController.router);
  router.use("/nginx", NginxController.router);
}

export default ApiController;