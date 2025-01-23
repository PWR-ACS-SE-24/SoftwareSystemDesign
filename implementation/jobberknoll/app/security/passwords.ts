import { Libargon2 } from "./libargon2.ts";

// SAFETY: according to OWASP recommendations (https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id)
const ARGON2ID_T_COST = 5;
const ARGON2ID_M_COST = 7168;
const ARGON2ID_PARALLELISM = 1;
const ARGON2ID_HASH_LEN = 32;
const ARGON2ID_SALT_LEN = 16;

const randomBytes = (length: number) => crypto.getRandomValues(new Uint8Array(length));

export function hashPassword(userPassword: string): Promise<string> {
  using libargon2 = new Libargon2();
  const saltBuffer = randomBytes(ARGON2ID_SALT_LEN);
  return Promise.resolve(
    libargon2.argon2idHashEncoded(
      ARGON2ID_T_COST,
      ARGON2ID_M_COST,
      ARGON2ID_PARALLELISM,
      userPassword,
      saltBuffer,
      ARGON2ID_HASH_LEN,
    ),
  );
}

export function verifyPassword(userPassword: string, phcHash: string): Promise<boolean> {
  using libargon2 = new Libargon2();
  return Promise.resolve(libargon2.argon2idVerify(phcHash, userPassword));
}

// SAFETY: this function is only used in tests
export function isPasswordHashed(maybePhcHash: string): boolean {
  // NOTE: adapted from https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
  return /^\$[a-z0-9-]+(\$v=[0-9]+)?(\$[a-z0-9-]+=[a-zA-Z0-9/+.-]+(,[a-z0-9-]+=[a-zA-Z0-9/+.-]+)*)?(\$[a-zA-Z0-9/+.-]+(\$[A-Za-z0-9+/=]+)?)?$/
    .test(maybePhcHash);
}
