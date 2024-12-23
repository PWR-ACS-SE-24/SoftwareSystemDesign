import { OpenAPIHono } from "@hono/zod-openapi";
import denoJson from "~/deno.json" with { type: "json" };
import type { Controller } from "~/shared/controller.ts";
import { configureDocs } from "~/shared/docs.ts";
import { getHealthHandler, getHealthRoute } from "./routes/get-health-route.ts";

export class IntController implements Controller {
  public get prefix(): string {
    return "/int/v1";
  }

  public get routes(): OpenAPIHono {
    const app = new OpenAPIHono()
      .openapi(getHealthRoute, getHealthHandler());

    configureDocs(app, {
      prefix: this.prefix,
      title: "Jobberknoll Internal API",
      version: denoJson.version,
      description: "The internal API for JakPrzyjade account management.",
      externalDocs: {
        url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign",
      },
    });

    return app;
  }
}
