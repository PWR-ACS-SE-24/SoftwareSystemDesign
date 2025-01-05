import { sha256 } from "./hash.ts";

export async function redactText(input: string): Promise<string> {
  const hash = await sha256(input);
  return `[REDACTED#${hash.slice(0, 8)}]`;
}

const SENSITIVE_KEYS = new Set([
  "databaseUrl",
  "fullName",
  "email",
  "password",
  "hashedPassword",
  "phoneNumber",
]);

export async function redactSensitiveKeysDeep(object: Record<string, unknown>): Promise<Record<string, unknown>> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    if (SENSITIVE_KEYS.has(key)) {
      redacted[key] = await redactText(typeof value === "string" ? value : JSON.stringify(value));
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = await redactSensitiveKeysDeep(value as Record<string, unknown>); // SAFETY: https://github.com/microsoft/TypeScript/issues/41746#issuecomment-737361754
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}
