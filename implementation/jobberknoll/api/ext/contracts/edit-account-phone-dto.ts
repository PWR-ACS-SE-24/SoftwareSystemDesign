import { z } from "@hono/zod-openapi";

export const EditAccountPhoneDto = z.object({
  phoneNumber: z.string().regex(/^[0-9+ ]{1,16}$/).nullable().openapi({ // TODO: what are our phone number constraints?
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
