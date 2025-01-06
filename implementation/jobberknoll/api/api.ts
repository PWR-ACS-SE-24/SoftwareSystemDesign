import { OpenAPIHono } from "@hono/zod-openapi";
import type { Logger, Service } from "@jobberknoll/app";
import { ExtController } from "~/ext/ext-controller.ts";
import { IntController } from "~/int/int-controller.ts";

export function buildApi(logger: Logger, service: Service): OpenAPIHono {
  const intController = new IntController(logger, service);
  const extController = new ExtController(logger, service);

  return new OpenAPIHono()
    .route(intController.prefix, intController.routes)
    .route(extController.prefix, extController.routes);
}
