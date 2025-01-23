import { z } from "@hono/zod-openapi";
import { JWT_EXAMPLE, JwtSchema } from "@jobberknoll/api";

export const AccessTokenDto = z
  .object({
    accessToken: JwtSchema.openapi({
      description: "Access token as a JWT.",
      examples: [JWT_EXAMPLE],
    }),
  })
  .openapi("AccessTokenDto", {
    description: "Authentication flow response.",
    examples: [
      {
        accessToken: JWT_EXAMPLE,
      },
    ],
  });

export type AccessTokenDto = z.infer<typeof AccessTokenDto>;
