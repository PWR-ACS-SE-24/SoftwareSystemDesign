import { z } from "@hono/zod-openapi";
import { RequestIdSchema, UserAgentSchema } from "~/shared/openapi.ts";

export const IntHeadersSchema = z.object({
  "jp-request-id": RequestIdSchema,
  "user-agent": UserAgentSchema,
});
