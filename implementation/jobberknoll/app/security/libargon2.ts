// SAFETY: see ADR-003

// SAFETY: even if the FFI fails, the code will error out, so the user will get a 5xx error, which is bad, but safe
const libargon2 = Deno.dlopen(
  "/usr/lib/x86_64-linux-gnu/libargon2.so.1", // sudo apt install libargon2-1
  {
    /*
int argon2id_hash_encoded(const uint32_t t_cost,
                          const uint32_t m_cost,
                          const uint32_t parallelism,
                          const void *pwd, const size_t pwdlen,
                          const void *salt, const size_t saltlen,
                          const size_t hashlen, char *encoded,
                          const size_t encodedlen);
    */
    "argon2id_hash_encoded": {
      parameters: ["u32", "u32", "u32", "buffer", "usize", "buffer", "usize", "usize", "buffer", "usize"],
      result: "i32",
    },
    /*
int argon2id_verify(const char *encoded, const void *pwd,
                    const size_t pwdlen);
    */
    "argon2id_verify": {
      parameters: ["buffer", "buffer", "usize"],
      result: "i32",
    },
  },
);

const ENCODED_BUFFER_SIZE = 256;

// SAFETY: TextEncoder and TextDecoder can be reused across calls (https://encoding.spec.whatwg.org/#interface-textencoder)
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function argon2idHashEncoded(
  tCost: number,
  mCost: number,
  parallelism: number,
  pwd: string,
  saltBuffer: Uint8Array,
  hashLen: number,
): string {
  const pwdBuffer = textEncoder.encode(pwd.normalize("NFKC"));
  const encodedBuffer = new Uint8Array(ENCODED_BUFFER_SIZE);
  const errorCode = libargon2.symbols.argon2id_hash_encoded(
    tCost,
    mCost,
    parallelism,
    pwdBuffer,
    BigInt(pwdBuffer.length),
    saltBuffer,
    BigInt(saltBuffer.length),
    BigInt(hashLen),
    encodedBuffer,
    BigInt(encodedBuffer.length),
  );
  if (errorCode !== 0) {
    throw new Error(`argon2id_hash_encoded failed with error code ${errorCode}`);
  }
  return textDecoder.decode(encodedBuffer).replaceAll("\0", "");
}

export function argon2idVerify(encoded: string, pwd: string): boolean {
  const encodedBuffer = new Uint8Array(ENCODED_BUFFER_SIZE);
  textEncoder.encodeInto(encoded, encodedBuffer);
  const pwdBuffer = textEncoder.encode(pwd.normalize("NFKC"));
  const errorCode = libargon2.symbols.argon2id_verify(
    encodedBuffer,
    pwdBuffer,
    BigInt(pwdBuffer.length),
  );
  return errorCode === 0;
}
