import { z } from "@hono/zod-openapi";
import { JWT_EXAMPLE, JwtSchema } from "~/ext/openapi.ts";

export const RefreshTokenDto = z.object({
  refreshToken: JwtSchema.openapi({ description: "Refresh token as a JWT.", examples: [JWT_EXAMPLE] }),
}).openapi("RefreshTokenDto", {
  description: "Refresh token passed to refresh the access token.",
  examples: [{ refreshToken: JWT_EXAMPLE }],
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;
