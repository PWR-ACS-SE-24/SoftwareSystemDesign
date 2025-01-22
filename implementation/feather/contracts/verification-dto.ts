import { z } from "@hono/zod-openapi";
import { UuidSchema } from "@jobberknoll/api";
import { uuid } from "@jobberknoll/core/shared";

export const VerificationDto = z
  .object({
    userId: UuidSchema.openapi({
      description: "User ID as UUIDv7 from the token.",
      examples: [uuid()],
    }),
    userRole: z
      .enum(["guest", "admin", "driver", "inspector", "passenger"])
      .openapi({
        description: "User role from the token.",
        examples: ["passenger"],
      }),
  })
  .openapi("VerificationDto", {
    description: "Information contained in the token.",
    examples: [
      {
        userId: uuid(),
        userRole: "passenger",
      },
    ],
  });
