import { z } from "@hono/zod-openapi";
import { EmailSchema, PasswordSchema } from "@jobberknoll/app";

export const LoginDto = z.object({
  email: EmailSchema.openapi({
    description: "Email address of the account owner.",
    examples: ["john.smith@example.com"],
  }),
  password: PasswordSchema.openapi({
    description: "Account password.",
    examples: ["Password"],
  }),
}).openapi("LoginDto", {
  description: "Login information.",
  examples: [{
    email: "john.smith@example.com",
    password: "Password",
  }],
});

export type LoginDto = z.infer<typeof LoginDto>;
