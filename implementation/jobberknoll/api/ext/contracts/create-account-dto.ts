import { z } from "@hono/zod-openapi";

export const CreateAccountDto = z.object({
  type: z.enum(["driver", "inspector"]).openapi({
    description: "Type of the account.",
    examples: ["driver"],
  }),
  fullName: z.string().min(1).max(255).openapi({
    description: "Full name of the account owner.",
    examples: ["John Smith"],
  }),
  email: z.string().email().max(255).openapi({
    description: "Email address of the account owner.",
    examples: ["john.smith@example.com"],
  }),
  password: z.string().min(8).max(64).openapi({ // TODO: what are our password requirements?
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
