import { OpenAPIHono } from "@hono/zod-openapi";
import type { Controller } from "~/shared/controller.ts";

export function buildApp(controllers: Controller[]): OpenAPIHono {
  const app = new OpenAPIHono();
  controllers.forEach((controller) => {
    app.route(controller.prefix, controller.routes);
  });
  return app;
}
