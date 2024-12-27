import { z } from "@hono/zod-openapi";
import { expect, uuid } from "@jobberknoll/core/shared";

export function jsonRes<T>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
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
    messagePl: z.string().optional().openapi({
      description: "Error message in Polish.",
    }),
  }).openapi(name, { description });
}

export const IdParamSchema = z.object({
  id: z.string().uuid().transform((id) =>
    expect(uuid(id), "ID previously validated by Zod must be a UUID")
  ).openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Resource identifier as UUIDv7.",
    examples: [uuid()],
  }),
});
