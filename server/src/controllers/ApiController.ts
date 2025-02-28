// @deno-types="@types/express"
import { Router } from "express";
import UserController from "./UserController.ts";
import WebconfigController from "./WebconfigController.ts";

namespace ApiController {
  export const router = Router();
  
  router.get("/", (req, res) => {
    res.json({
      message: "Hello from the API!"
    });
  });

  router.use("/user", UserController.router);
  router.use("/webconfig", WebconfigController.router);
}

export default ApiController;