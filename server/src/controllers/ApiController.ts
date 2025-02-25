// @deno-types="@types/express"
import { Router } from "express";
import User from "../../../shared/User.ts";
import UserController from "./UserController.ts";
import NodeController from "./NodeController.ts";

namespace ApiController {
  export const router = Router();
  
  router.get("/", (req, res) => {
    res.json({
      message: "Hello from the API!",
      user: new User(
        "John Doe",
        "john@doe.com",
        "password",
        1
      )
    });
  });

  router.use("/users", UserController.router)
  router.use("/nodes", NodeController.router)
}

export default ApiController;