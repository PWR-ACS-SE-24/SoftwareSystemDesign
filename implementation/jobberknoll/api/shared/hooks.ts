import type { Hook, OpenAPIHono } from "@hono/zod-openapi";
import type { Logger } from "@jobberknoll/app";
import type { Env } from "hono";
import { type SchemaMismatchDto, ServerFailureDto } from "./contracts/mod.ts";

export const defaultHook: Hook<unknown, Env, string, unknown> = (res, c) => {
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

export function configureErrorHandler(app: OpenAPIHono, logger: Logger) {
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
