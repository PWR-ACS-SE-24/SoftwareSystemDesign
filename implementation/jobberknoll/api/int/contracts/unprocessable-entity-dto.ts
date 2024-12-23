import { errorDto } from "~/shared/openapi.ts";

export const UnprocessableEntityDto = errorDto(
  "UnprocessableEntityDto",
  422,
  "unprocessable-entity",
  "The request data did not align with the schema.",
);
