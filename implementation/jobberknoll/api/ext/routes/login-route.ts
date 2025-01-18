import { createRoute } from "@hono/zod-openapi";
import type { LoginUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { InvalidCredentialsResponse, LoginDto, TokensDto } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonReq, jsonRes } from "~/shared/openapi.ts";

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  summary: "Login to an existing account",
  tags: ["Auth"],
  request: {
    headers: extHeadersSchema("guest"),
    body: jsonReq(LoginDto, "Login information."),
  },
  responses: {
    200: jsonRes(TokensDto, "Login successful."),
    403: InvalidCredentialsResponse,
    422: SchemaMismatchResponse,
  },
});

export function loginHandler(login: LoginUseCase): JkHandler<typeof loginRoute> {
  return async (c) => {
    const loginReq = c.req.valid("json");
    const res = await login.invoke(c.get("ctx"), loginReq);
    return isOk(res) ? c.json(res.value, 200) : c.json(res.value, res.value.code);
  };
}
