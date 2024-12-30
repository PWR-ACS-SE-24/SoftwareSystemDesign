import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { UserRole } from "@jobberknoll/app";
import type { UserUnauthorizedDto } from "~/ext/contracts/mod.ts";

export function authorize<R extends RouteConfig>(
  expectedRole: UserRole, // TODO: also handle "member"
  handler: RouteHandler<R>,
): RouteHandler<R> {
  return (c, next) => {
    const userRole = c.req.header("jp-user-role");
    if (userRole !== expectedRole) {
      return c.json(
        {
          code: 401,
          kind: "user-unauthorized",
          messageEn: "The user does not have access to the resource.",
          messagePl: "Użytkownik nie ma dostępu do tego zasobu.",
        } as UserUnauthorizedDto,
        401,
      ) as unknown as ReturnType<RouteHandler<R>>;
    }
    return handler(c, next);
  };
}
