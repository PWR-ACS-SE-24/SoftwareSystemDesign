import type { z } from "@hono/zod-openapi";
import { errorDto } from "~/shared/openapi.ts";

export const ServerFailureDto = errorDto(
  "ServerFailureDto",
  500,
  "server-failure",
  "An unexpected server failure occurred.",
);

export type ServerFailureDto = z.infer<typeof ServerFailureDto>;
