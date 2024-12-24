import type { z } from "@hono/zod-openapi";
import { errorDto } from "~/shared/openapi.ts";

export const AccountNotFoundDto = errorDto(
  "AccountNotFoundDto",
  404,
  "account-not-found",
  "The account could not be found.",
);

export type AccountNotFoundDto = z.infer<typeof AccountNotFoundDto>;
