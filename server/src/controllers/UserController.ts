// @deno-types="@types/express"
import { Router } from "express";

namespace UserController {
  export const router = Router();
  
  router.get("/", (req, res) => {
    res.json({
      id: 1,
      username: "root"
    });
  });
}

export default UserController;