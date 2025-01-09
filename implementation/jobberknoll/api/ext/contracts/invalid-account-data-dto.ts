import type { z } from "@hono/zod-openapi";
import { errorDto, jsonRes } from "~/shared/openapi.ts";

const DESCRIPTION = "Some of the provided account data is invalid.";

export const InvalidAccountDataDto = errorDto(
  "InvalidAccountDataDto",
  400,
  "invalid-account-data",
  "Some of the provided account data is invalid.",
);

export const InvalidAccountDataResponse = jsonRes(InvalidAccountDataDto, DESCRIPTION);

export type InvalidAccountDataDto = z.infer<typeof InvalidAccountDataDto>;
