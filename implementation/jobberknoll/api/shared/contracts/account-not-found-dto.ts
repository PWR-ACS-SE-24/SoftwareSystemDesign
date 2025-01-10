import type { z } from "@hono/zod-openapi";
import { errorDto, jsonRes } from "~/shared/openapi.ts";

const DESCRIPTION = "The account could not be found.";

export const AccountNotFoundDto = errorDto(
  "AccountNotFoundDto",
  404,
  "account-not-found",
  DESCRIPTION,
);

export const AccountNotFoundResponse = jsonRes(AccountNotFoundDto, DESCRIPTION);

export type AccountNotFoundDto = z.infer<typeof AccountNotFoundDto>;
