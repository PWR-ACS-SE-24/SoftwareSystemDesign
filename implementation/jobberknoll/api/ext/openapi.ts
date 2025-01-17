import { z } from "@hono/zod-openapi";
import type { UserRole } from "@jobberknoll/app";
import { NIL_UUID, uuid } from "@jobberknoll/core/shared";
import { RequestIdSchema, UserAgentSchema, UuidSchema } from "~/shared/openapi.ts";

export const extHeadersSchema = (role: UserRole) =>
  z.object({
    "jp-user-id": UuidSchema.openapi({
      description: "User ID as UUIDv7 of the requester.",
      examples: [role === "guest" ? NIL_UUID : uuid()],
    }),
    "jp-user-role": z.enum([
      "guest",
      "admin",
      "driver",
      "inspector",
      "passenger",
    ]).openapi({
      description: "User role of the requester.",
      examples: [role],
    }),
    "jp-request-id": RequestIdSchema,
    "user-agent": UserAgentSchema,
  });

export const JwtSchema = z.string().regex(/^[\w-]+\.[\w-]+\.[\w-]+$/);

export const JWT_EXAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
