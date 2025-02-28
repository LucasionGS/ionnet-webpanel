import Router from "./packages/router/Router.ts";
import WebsitePage from "./pages/WebsitePage.tsx";
import WebsitesPage from "./pages/WebsitesPage.tsx";

export const router = new Router();

router.add("/", (req, next) => {
  console.log(req);
  return next();
}, () => {
  return <WebsitesPage />;
});

router.add("/website/:id", (req) => {
  return <WebsitePage id={req.params.id} />;
});