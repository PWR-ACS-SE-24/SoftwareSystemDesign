import { z } from "@hono/zod-openapi";
import { FullNameSchema } from "@jobberknoll/app";

export const EditAccountNameDto = z.object({
  fullName: FullNameSchema.openapi({
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
