import type { Hook, OpenAPIHono, z } from "@hono/zod-openapi";
import type { Env, ErrorHandler } from "hono";
import {
  ServerFailureDto,
  type UnprocessableEntityDto,
} from "./contracts/mod.ts";

export const defaultHook: Hook<unknown, Env, string, unknown> = (res, c) => {
  if (!res.success) {
    return c.json(
      {
        code: 422,
        kind: "unprocessable-entity",
        messageEn: "The request data did not align with the schema!",
        messagePl: "Dane zapytania nie zgadzają się ze schematem!",
      } satisfies z.infer<typeof UnprocessableEntityDto>,
      422,
    );
  }
};

const onError: ErrorHandler = (_err, c) => {
  return c.json(
    {
      code: 500,
      kind: "server-failure",
      messageEn: "An unexpected server failure occurred!",
      messagePl: "Wystąpił nieoczekiwany błąd serwera!",
    } satisfies z.infer<typeof ServerFailureDto>,
    500,
  );
};

export function configureErrorHandler(app: OpenAPIHono) {
  app.openAPIRegistry.register("ServerFailureDto", ServerFailureDto);
  app.onError(onError);
}
