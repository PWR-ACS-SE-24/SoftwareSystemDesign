import { z } from "@hono/zod-openapi";

export const EditAccountNameDto = z.object({
  fullName: z.string().min(1).max(255).openapi({
    description: "Full name of the account owner.",
    examples: ["John Smith"],
  }),
}).openapi({
  description: "Information about the name edit.",
  examples: [{
    fullName: "John Smith",
  }],
});

export type EditAccountNameDto = z.infer<typeof EditAccountNameDto>;
