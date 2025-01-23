import { createRoute } from "@hono/zod-openapi";
import { IntHeadersSchema, JkHandler, jsonReq, jsonRes, SchemaMismatchResponse } from "@jobberknoll/api";
import { UserRole } from "@jobberknoll/app";
import { expect, NIL_UUID, uuid } from "@jobberknoll/core/shared";
import { jwtVerify } from "jose";
import { AccessTokenDto, VerificationDto } from "../contracts/mod.ts";
import { JwksProvider } from "../jwks-provider/mod.ts";

export const verifyRoute = createRoute({
  method: "post",
  path: "/verify",
  summary: "Verify an access token",
  tags: ["Sidecar"],
  request: {
    headers: IntHeadersSchema,
    body: jsonReq(AccessTokenDto, "Access token to verify."),
  },
  responses: {
    200: jsonRes(VerificationDto, "Verified access token successfully."),
    422: SchemaMismatchResponse,
  },
});

export function verifyHandler(
  jwksProvider: JwksProvider,
): JkHandler<typeof verifyRoute> {
  return async (c) => {
    const jwksResolver = await jwksProvider.getJwksResolver(c.get("ctx"));

    try {
      const { payload } = await jwtVerify(
        c.req.valid("json").accessToken,
        jwksResolver,
        {
          issuer: "jakprzyjade:jobberknoll",
          audience: "jakprzyjade:feather:access",
          requiredClaims: ["sub", "jakprzyjade:account:type"],
        },
      );
      const userId = expect(
        uuid(payload.sub!),
        "access token sub must be a UUID",
      ); // SAFETY: sub is present since it is a required claim
      const userRole = payload["jakprzyjade:account:type"] as UserRole; // SAFETY: jakprzyjade:account:type is present since it is a required claim
      return c.json({ userId, userRole }, 200);
    } catch {
      return c.json({ userId: NIL_UUID, userRole: "guest" as const }, 200);
    }
  };
}
