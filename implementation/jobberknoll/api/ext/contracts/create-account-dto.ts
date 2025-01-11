import { z } from "@hono/zod-openapi";
import { EmailSchema, FullNameSchema, PasswordSchema } from "@jobberknoll/app";

export const CreateAccountDto = z.object({
  type: z.enum(["driver", "inspector"]).openapi({
    description: "Type of the account.",
    examples: ["driver"],
  }),
  fullName: FullNameSchema.openapi({
    description: "Full name of the account owner.",
    examples: ["John Smith"],
  }),
  email: EmailSchema.openapi({
    description: "Email address of the account owner.",
    examples: ["john.smith@example.com"],
  }),
  password: PasswordSchema.openapi({
    description: "Account password (8-64 characters).",
    examples: ["password"],
  }),
}).openapi({
  description: "Information about the created account.",
  examples: [{
    type: "driver",
    fullName: "John Smith",
    email: "john.smith@example.com",
    password: "password",
  }],
});

export type CreateAccountDto = z.infer<typeof CreateAccountDto>;
