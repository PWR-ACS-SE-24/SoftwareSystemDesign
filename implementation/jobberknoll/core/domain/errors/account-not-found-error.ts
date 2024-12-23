import type { UUID } from "@jobberknoll/core/shared";
import type { AppError } from "./app-error.ts";

export type AccountNotFoundError = AppError & {
  code: 404;
  kind: "account-not-found";
};

export function accountNotFoundError(id: UUID): AccountNotFoundError {
  return {
    code: 404 as const,
    kind: "account-not-found" as const,
    messageEn: `Account with ID "${id}" was not found!`,
    messagePl: `Konto o ID "${id}" nie zostało znalezione!`,
  } satisfies AppError;
}
