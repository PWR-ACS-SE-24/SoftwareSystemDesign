import { OpenAPIHono } from "@hono/zod-openapi";
import { getHealth } from "../contracts/routes/get-health.ts";
import denoJson from "../deno.json" with { type: "json" };
import { configureDocs } from "../helpers/docs.ts";
import type { Controller } from "./controller.ts";

export class IntController implements Controller {
  public get prefix(): string {
    return "/int/v1";
  }

  public get routes(): OpenAPIHono {
    const app = new OpenAPIHono()
      // TODO @tchojnacki: Extract this logic to the application layer
      .openapi(getHealth, (c) => c.json({ status: "UP" as const }, 200));

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
