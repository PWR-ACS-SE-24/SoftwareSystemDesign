import type { Logger, Service } from "@jobberknoll/app";
import { SERVICE_VERSION } from "@jobberknoll/core/shared";
import type { Controller } from "~/shared/controller.ts";
import { configureDocs } from "~/shared/docs.ts";
import { createJkApp, type JkApp } from "~/shared/hooks.ts";
import * as r from "./routes/mod.ts";

export class IntController implements Controller {
  public constructor(private readonly logger: Logger, private readonly service: Service) {}

  public readonly prefix = "/int/v1";

  public get routes(): JkApp {
    const app = createJkApp(this.logger)
      .openapi(
        r.getHealthRoute,
        r.getHealthHandler(this.service.getHealth),
      )
      .openapi(
        r.getEndpointsRoute,
        r.getEndpointsHandler(),
      )
      .openapi(
        r.getAccountByIdRoute,
        r.getAccountByIdHandler(this.service.getAccountById),
      )
      .openapi(
        r.getJwksRoute,
        r.getJwksHandler(this.service.getJwks),
      );

    configureDocs(app, {
      path: this.prefix,
      title: "Jobberknoll Internal API",
      version: SERVICE_VERSION,
      description: "The internal API for JakPrzyjade account management.",
      externalDocs: { url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign" },
    });

    return app;
  }
}
