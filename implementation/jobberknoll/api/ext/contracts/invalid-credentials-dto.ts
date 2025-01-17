import type { z } from "@hono/zod-openapi";
import { errorDto, jsonRes } from "~/shared/openapi.ts";

const DESCRIPTION = "Some of the provided credentials are invalid.";

export const InvalidCredentialsDto = errorDto(
  "InvalidCredentialsDto",
  403,
  "invalid-credentials",
  DESCRIPTION,
);

export const InvalidCredentialsResponse = jsonRes(InvalidCredentialsDto, DESCRIPTION);

export type InvalidCredentialsDto = z.infer<typeof InvalidCredentialsDto>;
