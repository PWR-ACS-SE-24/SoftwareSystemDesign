import { z } from "@hono/zod-openapi";
import { PasswordSchema } from "@jobberknoll/app";

export const EditAccountPasswordDto = z.object({
  oldPassword: PasswordSchema.openapi({
    description: "Current password of the account owner.",
    examples: ["password123"],
  }),
  newPassword: PasswordSchema.openapi({
    description: "New password for the account owner.",
    examples: ["supersecretpassword"],
  }),
}).openapi("EditAccountPasswordDto", {
  description: "Information about the password edit.",
  examples: [{
    oldPassword: "old-password",
    newPassword: "new-password",
  }],
});

export type EditAccountPasswordDto = z.infer<typeof EditAccountPasswordDto>;
