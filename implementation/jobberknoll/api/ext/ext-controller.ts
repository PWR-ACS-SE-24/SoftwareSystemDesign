import type { Logger, Service } from "@jobberknoll/app";
import { SERVICE_VERSION } from "@jobberknoll/core/shared";
import type { Controller } from "~/shared/controller.ts";
import { configureDocs } from "~/shared/docs.ts";
import { createJkApp, type JkApp } from "~/shared/hooks.ts";
import * as r from "./routes/mod.ts";

export class ExtController implements Controller {
  public constructor(private readonly logger: Logger, private readonly service: Service) {}

  public readonly prefix = "/ext/v1";

  public get routes(): JkApp {
    const app = createJkApp(this.logger)
      .openapi(
        r.registerRoute,
        r.registerHandler(this.service.register),
      )
      .openapi(
        r.loginRoute,
        r.loginHandler(this.service.login),
      )
      .openapi(
        r.revokeTokensRoute,
        r.revokeTokensHandler(this.service.revokeTokens),
      )
      .openapi(
        r.getSelfRoute,
        r.getSelfHandler(this.service.getAccountById),
      )
      .openapi(
        r.editSelfNameRoute,
        r.editSelfNameHandler(this.service.editAccountName),
      )
      .openapi(
        r.editSelfPasswordRoute,
        r.editSelfPasswordHandler(this.service.editAccountPassword),
      )
      .openapi(
        r.editSelfPhoneRoute,
        r.editSelfPhoneHandler(this.service.editAccountPhone),
      )
      .openapi(
        r.deleteSelfRoute,
        r.deleteSelfHandler(this.service.deleteAccount),
      )
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
