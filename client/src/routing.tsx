import Router from "./packages/router/Router.ts";

export const router = new Router();

router.add("/", (req, next) => {
  console.log(req);
  return next();
}, (request, next) => {
  return <div>Home</div>;
});

router.add("/structure", (request, next) => {
  return <div>Structure</div>;
});

router.add("/analytics", (request, next) => {
  return <div>Analytics</div>;
});