// SAFETY: see ADR-003
import * as argon2 from "@node-rs/argon2";

// SAFETY: according to OWASP recommendations (https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id)
const ARGON2ID_OPTIONS = {
  memoryCost: 7168,
  timeCost: 5,
  parallelism: 1,
} satisfies argon2.Options;

export async function hashPassword(userPassword: string): Promise<string> {
  return await argon2.hash(userPassword, ARGON2ID_OPTIONS);
}

export async function verifyPassword(userPassword: string, phcHash: string): Promise<boolean> {
  return await argon2.verify(phcHash, userPassword);
}

// SAFETY: this function is only used in tests
export function isPasswordHashed(maybePhcHash: string): boolean {
  // NOTE: adapted from https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
  return /^\$[a-z0-9-]+(\$v=[0-9]+)?(\$[a-z0-9-]+=[a-zA-Z0-9/+.-]+(,[a-z0-9-]+=[a-zA-Z0-9/+.-]+)*)?(\$[a-zA-Z0-9/+.-]+(\$[A-Za-z0-9+/=]+)?)?$/
    .test(maybePhcHash);
}
