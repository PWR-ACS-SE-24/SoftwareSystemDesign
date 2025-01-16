import { OpenAPIHono } from "@hono/zod-openapi";

export function buildApi() {
  const api = new OpenAPIHono();

  return api;
}
