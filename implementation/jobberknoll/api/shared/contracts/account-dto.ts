import { z } from "@hono/zod-openapi";
import { uuid } from "@jobberknoll/core/shared";

export const AccountDto = z.object({
  id: z.string().uuid().openapi({
    description: "Account identifier as UUIDv7.",
    examples: [uuid()],
  }),
  type: z.enum(["passenger", "driver", "admin", "inspector"]).openapi({
    description: "Type of the account.",
    examples: ["passenger"],
  }),
  fullName: z.string().openapi({
    description: "Full name of the account owner.",
    examples: ["John Smith"],
  }),
  email: z.string().email().openapi({
    description: "Email address of the account owner.",
    examples: ["john.smith@example.com"],
  }),
  phoneNumber: z.string().optional().openapi({
    description: "Phone number of the passenger.",
    examples: ["+48 123 456 789"],
  }),
}).openapi("AccountDto", {
  description: "Account details.",
  examples: [{
    id: uuid(),
    type: "passenger",
    fullName: "John Smith",
    email: "john.smith@example.com",
    phoneNumber: "+48 123 456 789",
  }],
});

export type AccountDto = z.infer<typeof AccountDto>;
