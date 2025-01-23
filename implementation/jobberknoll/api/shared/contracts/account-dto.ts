import { z } from "@hono/zod-openapi";
import { EmailSchema, FullNameSchema, PhoneNumberSchema } from "@jobberknoll/app";
import { uuid } from "@jobberknoll/core/shared";
import { UuidSchema } from "~/shared/openapi.ts";

export const AccountDto = z.object({
  id: UuidSchema.openapi({
    description: "Account identifier as UUIDv7.",
    examples: [uuid()],
  }),
  type: z.enum(["admin", "driver", "inspector", "passenger"]).openapi({
    description: "Type of the account.",
    examples: ["passenger"],
  }),
  fullName: FullNameSchema.openapi({
    description: "Full name of the account owner.",
    examples: ["John Smith"],
  }),
  email: EmailSchema.openapi({
    description: "Email address of the account owner.",
    examples: ["john.smith@example.com"],
  }),
  phoneNumber: PhoneNumberSchema.optional().openapi({
    description: "Phone number of the passenger.",
    examples: ["+48123456789"],
  }),
}).openapi("AccountDto", {
  description: "Account details.",
  examples: [{
    id: uuid(),
    type: "passenger",
    fullName: "John Smith",
    email: "john.smith@example.com",
    phoneNumber: "+48123456789",
  }],
});

export type AccountDto = z.infer<typeof AccountDto>;
