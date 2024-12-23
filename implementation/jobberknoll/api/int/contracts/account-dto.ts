import { z } from "@hono/zod-openapi";

export const AccountDto = z.intersection(
  z.object({
    id: z.string().uuid().openapi({
      description: "Account identifier as UUIDv7.",
      examples: ["0193f537-b47e-74a0-80e3-316db4dd3ab5"],
    }),
    fullName: z.string().openapi({
      description: "Full name of the account owner.",
      examples: ["John Smith"],
    }),
    email: z.string().email().openapi({
      description: "Email address of the account owner.",
      examples: ["john.smith@example.com"],
    }),
  }),
  z.union([
    z.object({
      type: z.literal("passenger").openapi({
        description: "Account for a passenger.",
      }),
      phoneNumber: z.string().optional().openapi({
        description: "Phone number of the passenger.",
        examples: ["+48 123 456 789"],
      }),
    }),
    z.object({ type: z.literal("driver") }).openapi({
      description: "Account for a driver.",
    }),
    z.object({ type: z.literal("admin") }).openapi({
      description: "Account for an admin.",
    }),
    z.object({ type: z.literal("inspector") }).openapi({
      description: "Account for an inspector.",
    }),
  ]),
).openapi("AccountDto", {
  description: "Account details.",
  examples: [{
    id: "0193f537-b47e-74a0-80e3-316db4dd3ab5",
    type: "passenger",
    fullName: "John Smith",
    email: "john.smith@example.com",
    phoneNumber: "+48 123 456 789",
  }],
});
