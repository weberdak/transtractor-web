import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("supported-bank-statements", "routes/supported-bank-statements.tsx"),
] satisfies RouteConfig;
