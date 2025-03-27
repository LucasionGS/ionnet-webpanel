import Router from "./packages/router/Router.ts";
import LoginPage from "./pages/LoginPage.tsx";
import WebsitePage from "./pages/WebsitePage.tsx";
import WebsitesPage from "./pages/WebsitesPage.tsx";

export const router = new Router();

router.add("/", () => {
  return <WebsitesPage />;
});

router.add("/login", () => {
  return <LoginPage />;
});


router.add("/website/:id", (req) => {
  return <WebsitePage id={req.params.id} />;
});