import { json, RequestHandler, Router } from "express";
import { pamAuthenticatePromise, pamErrors } from "node-linux-pam";
import User from "../unix/User.ts";
import SharedUser from "../../../shared/SharedUser.ts";
import envs from "../Environment.ts";


namespace UserController {
  /**
   * Middleware to check if the user is authenticated and getting the user.
   */
  export const auth = (async (req, res, next) => {
    const token = req.cookies.session;
    if (!token) {
      res.status(401).json({
        error: "Unauthorized"
      });
      return;
    }
    const user = User.fromJwt(token);
    
    if (user) {
      if (envs.NGINX_ALLOW_GROUP) {
        const groups = await user.getGroups();
        if (!groups.includes(envs.NGINX_ALLOW_GROUP)) {
          res.status(403).json({
            error: "Forbidden"
          });
          return;
        }
      }
      
      (req).user = user;
      next();
    } else {
      res.status(401).json({
        error: "Unauthorized"
      });
    }
  }) satisfies RequestHandler;

  export const router = Router();
  
  router.post("/login", json(), async (req, res) => {
    const login: pamErrors = await pamAuthenticatePromise({
      username: req.body.username,
      password: req.body.password
    }).catch((err) => err.code);

    console.log("PAM_STATUS:", login);
    if (login === pamErrors.PAM_SUCCESS) {
      const user = (await User.getByUsername(req.body.username))!;
      const token = user.jwt();
      res.cookie("session", token, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict"
      });
      
      res.json({
        id: user.id,
        username: user.username,
        token: token
      } satisfies SharedUser);
    } else {
      let error: string;
      switch (login) {
        case pamErrors.PAM_AUTH_ERR:
          error = "Error authenticating user";
          break;
      
        default:
          error = "Invalid username or password";
          break;
      }
      res.status(401).json({
        error
      });
    }
  });
  
  router.get("/", auth, (req, res) => {
    if (req.user) {
      res.json({
        id: req.user.id,
        username: req.user.username
      } satisfies SharedUser);
    }
    else {
      res.status(401).json({
        error: "Unauthorized"
      });
    }
  });
}

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export default UserController;