import type { z } from "@hono/zod-openapi";
import { errorDto, jsonRes } from "~/shared/openapi.ts";

const DESCRIPTION = "The user does not have access to the resource.";

export const UserUnauthorizedDto = errorDto(
  "UserUnauthorizedDto",
  401,
  "user-unauthorized",
  "The user does not have access to the resource.",
);

export const UserUnauthorizedResponse = jsonRes(UserUnauthorizedDto, DESCRIPTION);

export type UserUnauthorizedDto = z.infer<typeof UserUnauthorizedDto>;
