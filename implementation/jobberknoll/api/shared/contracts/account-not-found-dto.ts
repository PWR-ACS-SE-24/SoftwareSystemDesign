import { errorDto } from "~/shared/openapi.ts";

export const AccountNotFoundDto = errorDto(
  "AccountNotFoundDto",
  404,
  "account-not-found",
  "The account could not be found.",
);
