import type { OpenAPIHono } from "@hono/zod-openapi";

export type Controller = {
  prefix: string;
  routes: OpenAPIHono;
};
