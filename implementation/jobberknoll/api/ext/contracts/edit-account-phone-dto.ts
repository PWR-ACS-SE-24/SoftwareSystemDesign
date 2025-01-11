import { z } from "@hono/zod-openapi";
import { PhoneNumberSchema } from "@jobberknoll/app";

export const EditAccountPhoneDto = z.object({
  phoneNumber: PhoneNumberSchema.openapi({
    description: "Phone number of the account owner.",
    examples: ["+48 123 456 789", null],
  }),
}).openapi({
  description: "Information about the phone edit.",
  examples: [{
    phoneNumber: "+48 123 456 789",
  }],
});

export type EditAccountPhoneDto = z.infer<typeof EditAccountPhoneDto>;
