import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Logger, Service } from "@jobberknoll/app";
import { SERVICE_VERSION } from "@jobberknoll/core/shared";
import type { Controller } from "~/shared/controller.ts";
import { configureDocs } from "~/shared/docs.ts";
import { createOpenAPIHono } from "~/shared/hooks.ts";
import * as r from "./routes/mod.ts";

export class ExtController implements Controller {
  public constructor(private readonly service: Service, private readonly logger: Logger) {}

  public get prefix(): string {
    return "/ext/v1";
  }

  public get routes(): OpenAPIHono {
    const app = createOpenAPIHono(this.logger)
      .openapi(
        r.createAccountRoute,
        r.createAccountHandler(this.service.createAccount),
      )
      .openapi(
        r.getAccountByIdRoute,
        r.getAccountByIdHandler(this.service.getAccountById),
      )
      .openapi(
        r.deleteAccountRoute,
        r.deleteAccountHandler(this.service.deleteAccount),
      );

    configureDocs(app, {
      path: this.prefix,
      title: "Jobberknoll External API",
      version: SERVICE_VERSION,
      description: "The external API for JakPrzyjade account management.",
      externalDocs: { url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign" },
    });

    return app;
  }
}
