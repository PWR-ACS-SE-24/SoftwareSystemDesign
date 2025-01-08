import { z } from "@hono/zod-openapi";
import { isNone, uuid } from "@jobberknoll/core/shared";

export function jsonReq<T>(schema: T, description: string, required: boolean = true) {
  return {
    content: { "application/json": { schema } },
    description,
    required,
  };
}

export function jsonRes<T>(schema: T, description: string) {
  return {
    content: { "application/json": { schema } },
    description,
  };
}

export function errorDto<C extends number, K extends string>(
  name: string,
  code: C,
  kind: K,
  description: string,
) {
  return z.object({
    code: z.literal(code).openapi({ description: "HTTP status code." }),
    kind: z.literal(kind).openapi({ description: "Error kind." }),
    messageEn: z.string().openapi({ description: "Error message in English." }),
    messagePl: z.string().optional().openapi({ description: "Error message in Polish." }),
  }).openapi(name, { description });
}

export const UuidSchema = z.string().uuid().transform((id, ctx) => {
  const option = uuid(id);
  if (isNone(option)) {
    ctx.addIssue({ code: z.ZodIssueCode.invalid_string, validation: "uuid" });
    return z.NEVER;
  }
  return option.value;
});

export const RequestIdSchema = UuidSchema
  .optional()
  .transform((id) => id!) // SAFETY: requestId is defined as long as requestIdMiddleware is used (so in all requests)
  .openapi({ description: "Request ID as UUIDv7.", examples: [uuid()] });

export const UserAgentSchema = z.string().optional().openapi({
  description: "Name of the caller.",
  examples: ["Phoenix/1.0.0"],
});

export const IdParamSchema = z.object({
  id: UuidSchema.openapi({
    param: { name: "id", in: "path" },
    description: "Resource ID as UUIDv7.",
    examples: [uuid()],
  }),
});
