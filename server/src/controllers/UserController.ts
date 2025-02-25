// @deno-types="@types/express"
import { Router } from "express";

namespace UserController {
  export const router = Router();
  
  router.get("/", (req, res) => {
    res.json({ message: "Hello from the API!" });
  });
}

export default UserController;