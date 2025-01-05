import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { USER_ROLES, type UserRole } from "@jobberknoll/app";
import type { UserUnauthorizedDto } from "~/ext/contracts/mod.ts";

function isValid(expectedRole: UserRole | "member", userRole: string | undefined): boolean {
  if (!USER_ROLES.includes(userRole as UserRole)) return false;
  if (expectedRole === "member") return userRole !== "guest";
  return userRole === expectedRole;
}

export function authorize<R extends RouteConfig>(
  expectedRole: UserRole | "member",
  handler: RouteHandler<R>,
): RouteHandler<R> {
  return (c, next) => {
    const userRole = c.req.header("jp-user-role");

    if (isValid(expectedRole, userRole)) return handler(c, next);

    return c.json(
      {
        code: 401,
        kind: "user-unauthorized",
        messageEn: "The user does not have access to the resource.",
        messagePl: "Użytkownik nie ma dostępu do tego zasobu.",
      } as UserUnauthorizedDto,
      401,
    ) as unknown as ReturnType<RouteHandler<R>>;
  };
}
