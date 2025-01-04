import { type Hook, OpenAPIHono } from "@hono/zod-openapi";
import type { Logger } from "@jobberknoll/app";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import { isNone, uuid } from "../../core/shared/mod.ts";
import { type SchemaMismatchDto, ServerFailureDto } from "./contracts/mod.ts";

const defaultHook: Hook<unknown, Env, string, unknown> = (res, c) => {
  if (!res.success) {
    return c.json(
      {
        code: 422,
        kind: "schema-mismatch",
        messageEn: "The request data did not align with the schema!",
        messagePl: "Dane zapytania nie zgadzają się ze schematem!",
      } satisfies SchemaMismatchDto,
      422,
    );
  }
};

const requestIdMiddleware = createMiddleware(async (c, next) => {
  const HEADER_NAME = "jp-request-id";
  const requestId = c.req.header(HEADER_NAME);
  if (!requestId || isNone(uuid(requestId))) {
    const headers = new Headers(c.req.raw.headers);
    headers.set(HEADER_NAME, uuid());
    c.req.raw = new Request(c.req.url, { ...c.req.raw, headers });
  }
  await next();
});

function configureErrorHandler(app: OpenAPIHono, logger: Logger) {
  app.openAPIRegistry.register("ServerFailureDto", ServerFailureDto);
  app.onError((err, c) => {
    logger.error(null, "onError", { err: err.message });
    return c.json(
      {
        code: 500,
        kind: "server-failure",
        messageEn: "An unexpected server failure occurred!",
        messagePl: "Wystąpił nieoczekiwany błąd serwera!",
      } satisfies ServerFailureDto,
      500,
    );
  });
}

export function createOpenAPIHono(logger: Logger): OpenAPIHono {
  const app = new OpenAPIHono({ defaultHook });
  app.use(requestIdMiddleware);
  configureErrorHandler(app, logger);
  return app;
}
