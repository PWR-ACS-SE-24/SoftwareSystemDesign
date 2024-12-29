import { OpenAPIHono } from "@hono/zod-openapi";
import type { Logger, Service } from "@jobberknoll/app";
import { SERVICE_VERSION } from "@jobberknoll/core/shared";
import type { Controller } from "~/shared/controller.ts";
import { configureDocs } from "~/shared/docs.ts";
import { configureErrorHandler, defaultHook } from "~/shared/hooks.ts";

export class ExtController implements Controller {
  public constructor(
    private readonly service: Service,
    private readonly logger: Logger,
  ) {}

  public get prefix(): string {
    return "/ext/v1";
  }

  public get routes(): OpenAPIHono {
    const app = new OpenAPIHono({ defaultHook });

    configureErrorHandler(app, this.logger);

    configureDocs(app, {
      path: this.prefix,
      title: "Jobberknoll External API",
      version: SERVICE_VERSION,
      description: "The external API for JakPrzyjade account management.",
      externalDocs: {
        url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign",
      },
    });

    return app;
  }
}
