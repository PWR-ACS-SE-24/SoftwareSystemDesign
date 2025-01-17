import { z } from "@hono/zod-openapi";
import { JWT_EXAMPLE, JwtSchema } from "~/ext/openapi.ts";

export const TokensDto = z.object({
  accessToken: JwtSchema.openapi({ description: "Access token as a JWT.", examples: [JWT_EXAMPLE] }),
  refreshToken: JwtSchema.openapi({ description: "Refresh token as a JWT.", examples: [JWT_EXAMPLE] }),
  tokenType: z.literal("Bearer").openapi({ description: "Token type.", examples: ["Bearer"] }),
  expiresIn: z.number().positive().openapi({ description: "Token expiration time in seconds.", examples: [3600] }),
}).openapi("TokensDto", {
  description: "Authentication flow response.",
  examples: [{
    accessToken: JWT_EXAMPLE,
    refreshToken: JWT_EXAMPLE,
    tokenType: "Bearer",
    expiresIn: 3600,
  }],
});

export type TokensDto = z.infer<typeof TokensDto>;
