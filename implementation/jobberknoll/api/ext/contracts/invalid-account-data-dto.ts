import type { z } from "@hono/zod-openapi";
import { errorDto } from "~/shared/openapi.ts";

export const InvalidAccountDataDto = errorDto(
  "InvalidAccountDataDto",
  400,
  "invalid-account-data",
  "Some of the provided account data is invalid.",
);

export type InvalidUserDataDto = z.infer<typeof InvalidAccountDataDto>;
