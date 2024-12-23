import type { OpenAPIHono } from "@hono/zod-openapi";

export interface Controller {
  prefix: string;
  routes: OpenAPIHono;
}
