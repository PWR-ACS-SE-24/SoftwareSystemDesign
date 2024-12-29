import type { z } from "@hono/zod-openapi";
import { errorDto } from "~/shared/openapi.ts";

export const UserUnauthorizedDto = errorDto(
  "UserUnauthorizedDto",
  401,
  "user-unauthorized",
  "The user does not have access to the resource.",
);

export type UserUnauthorizedDto = z.infer<typeof UserUnauthorizedDto>;
