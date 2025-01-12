import { createRoute } from "@hono/zod-openapi";
import type { RegisterUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { InvalidAccountDataResponse, RegisterDto } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountDto, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { mapAccountToDto } from "~/shared/mappers/mod.ts";
import { jsonReq, jsonRes } from "~/shared/openapi.ts";

export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  summary: "Register a new account",
  tags: ["Auth"],
  request: {
    headers: extHeadersSchema("guest"),
    body: jsonReq(RegisterDto, "Information about the registered account."),
  },
  responses: {
    201: jsonRes(AccountDto, "Registered a new account."),
    400: InvalidAccountDataResponse,
    422: SchemaMismatchResponse,
  },
});

export function registerHandler(register: RegisterUseCase): JkHandler<typeof registerRoute> {
  return async (c) => {
    const registerReq = c.req.valid("json");
    const res = await register.invoke(c.get("ctx"), registerReq);
    return isOk(res) ? c.json(mapAccountToDto(res.value), 201) : c.json(res.value, res.value.code);
  };
}
