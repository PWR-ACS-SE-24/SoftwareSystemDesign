import type { AppError } from "./app-error.ts";

export type InvalidCredentialsError = AppError & {
  code: 403;
  kind: "invalid-credentials";
};

export function invalidCredentials(field: string): InvalidCredentialsError {
  return {
    code: 403,
    kind: "invalid-credentials",
    messageEn: `Invalid credentials for ${field}!`,
    messagePl: `Nieprawidłowe dane dane dostępu dla ${field}!`,
  } as const;
}
