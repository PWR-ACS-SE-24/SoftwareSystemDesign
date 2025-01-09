import { type Hook, OpenAPIHono, type RouteConfig, type RouteHandler } from "@hono/zod-openapi";
import type { Ctx, Logger } from "@jobberknoll/app";
import { expect, isNone, uuid } from "@jobberknoll/core/shared";
import { pick } from "@std/collections";
import type { Env, HonoRequest } from "hono";
import { createMiddleware } from "hono/factory";
import { type SchemaMismatchDto, ServerFailureDto } from "./contracts/mod.ts";

type JkBindings = { Variables: { ctx: Ctx } };
export type JkHandler<R extends RouteConfig> = RouteHandler<R, JkBindings>;
export type JkApp = OpenAPIHono<JkBindings>;

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

const REQUEST_ID_HEADER = "jp-request-id";

const expectRequestId = (req: HonoRequest) =>
  expect(uuid(req.header(REQUEST_ID_HEADER) ?? ""), "requestId should be always set by requestIdMiddleware");

const requestIdMiddleware = createMiddleware<JkBindings>(async (c, next) => {
  const extracted = c.req.header(REQUEST_ID_HEADER);
  if (!extracted || isNone(uuid(extracted))) {
    const headers = new Headers(c.req.raw.headers);
    headers.set(REQUEST_ID_HEADER, uuid());
    c.req.raw = new Request(c.req.raw, { headers });
  }
  c.set("ctx", { requestId: expectRequestId(c.req) });
  await next();
});

function loggingMiddlewareFactory(logger: Logger) {
  const extractBody = (r: Request | Response): Promise<unknown | undefined> => r.clone().json().catch(() => undefined);
  return createMiddleware(async (c, next) => {
    const requestId = expectRequestId(c.req);
    logger.debug(requestId, "http request - start", {
      method: c.req.method,
      route: c.req.routePath,
      url: new URL(c.req.url).pathname + new URL(c.req.url).search,
      headers: pick(c.req.header(), [REQUEST_ID_HEADER, "jp-user-id", "jp-user-role", "user-agent", "content-type"]),
      body: await extractBody(c.req.raw),
    });
    await next();
    logger.debug(requestId, "http request - end", {
      status: c.res.status,
      headers: pick(Object.fromEntries(c.res.headers.entries()), ["content-type"]),
      body: await extractBody(c.res),
    });
  });
}

function configureErrorHandler(logger: Logger, app: OpenAPIHono) {
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

export function createJkApp(logger: Logger): JkApp {
  const app = new OpenAPIHono({ defaultHook });
  app.use(requestIdMiddleware);
  app.use(loggingMiddlewareFactory(logger));
  configureErrorHandler(logger, app);
  return app as JkApp; // SAFETY: the cast is safe as long as app.use(requestIdMiddleware) is used
}
