import type { AppError } from "./app-error.ts";

export type InvalidAccountDataError = AppError & {
  code: 400;
  kind: "invalid-account-data";
};

export function invalidAccountData(field: string): InvalidAccountDataError {
  return {
    code: 400,
    kind: "invalid-account-data",
    messageEn: `Invalid account data for field ${field}!`,
    messagePl: `Nieprawidłowe dane konta dla pola ${field}!`,
  } as const;
}
