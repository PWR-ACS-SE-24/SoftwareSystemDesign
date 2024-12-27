import workspace from "$workspace" with { type: "json" };
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Logger, Service } from "@jobberknoll/app";
import type { Controller } from "~/shared/controller.ts";
import { configureDocs } from "~/shared/docs.ts";
import { configureErrorHandler, defaultHook } from "~/shared/hooks.ts";
import {
  getAccountByIdHandler,
  getAccountByIdRoute,
  getHealthHandler,
  getHealthRoute,
} from "./routes/mod.ts";

export class IntController implements Controller {
  public constructor(
    private readonly service: Service,
    private readonly logger: Logger,
  ) {}

  public get prefix(): string {
    return "/int/v1";
  }

  public get routes(): OpenAPIHono {
    const app = new OpenAPIHono({ defaultHook })
      .openapi(getHealthRoute, getHealthHandler())
      .openapi(
        getAccountByIdRoute,
        getAccountByIdHandler(this.service.getAccountById),
      );

    configureErrorHandler(app, this.logger);

    configureDocs(app, {
      path: this.prefix,
      title: "Jobberknoll Internal API",
      version: workspace.version,
      description: "The internal API for JakPrzyjade account management.",
      externalDocs: {
        url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign",
      },
    });

    return app;
  }
}
