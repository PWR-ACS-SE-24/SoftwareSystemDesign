import { z } from "@hono/zod-openapi";
import { EmailSchema, FullNameSchema, PasswordSchema, PhoneNumberSchema } from "@jobberknoll/app";

export const RegisterDto = z.object({
  fullName: FullNameSchema.openapi({
    description: "Full name of the account owner.",
    examples: ["John Smith"],
  }),
  email: EmailSchema.openapi({
    description: "Email address of the account owner.",
    examples: ["john.smith@example.com"],
  }),
  password: PasswordSchema.openapi({
    description: "Account password.",
    examples: ["Password"],
  }),
  phoneNumber: PhoneNumberSchema.openapi({
    description: "Phone number of the passenger.",
    examples: ["+48123456789"],
  }),
}).openapi("RegisterDto", {
  description: "Information about the registered account.",
  examples: [{
    fullName: "John Smith",
    email: "john.smith@example.com",
    password: "Password",
    phoneNumber: "+48123456789",
  }],
});

export type RegisterDto = z.infer<typeof RegisterDto>;
