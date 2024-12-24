import { errorDto } from "~/shared/openapi.ts";

export const SchemaMismatchDto = errorDto(
  "SchemaMismatchDto",
  422,
  "schema-mismatch",
  "The request data did not align with the schema.",
);
