import type { z } from "@hono/zod-openapi";
import { errorDto, jsonRes } from "~/shared/openapi.ts";

const DESCRIPTION = "The request data did not align with the schema.";

export const SchemaMismatchDto = errorDto(
  "SchemaMismatchDto",
  422,
  "schema-mismatch",
  DESCRIPTION,
);

export const SchemaMismatchResponse = jsonRes(SchemaMismatchDto, DESCRIPTION);

export type SchemaMismatchDto = z.infer<typeof SchemaMismatchDto>;
