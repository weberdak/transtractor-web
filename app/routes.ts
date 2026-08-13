import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("develop", "routes/develop.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("supported-bank-statements", "routes/supported-bank-statements.tsx"),
  route("terms-of-use", "routes/terms-of-use.tsx"),
] satisfies RouteConfig;
