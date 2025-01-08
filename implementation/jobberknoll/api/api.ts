import { OpenAPIHono } from "@hono/zod-openapi";
import type { Logger, Service } from "@jobberknoll/app";
import { ExtController } from "~/ext/ext-controller.ts";
import { IntController } from "~/int/int-controller.ts";

export function buildApi(service: Service, logger: Logger): OpenAPIHono {
  const intController = new IntController(service, logger);
  const extController = new ExtController(service, logger);

  return new OpenAPIHono()
    .route(intController.prefix, intController.routes)
    .route(extController.prefix, extController.routes);
}
