import { z } from "zod";
import type { Logger } from "~/interfaces/mod.ts";

const defaultGetter = Deno.env.get;

type Getter = typeof defaultGetter;
type Reader<T> = (getter?: Getter) => T;

export function envReader<S extends z.ZodType>(key: string, schema: S): Reader<z.infer<S>> {
  return (getter = defaultGetter) => {
    const value = getter(key);
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new Error(`${key}: ${result.error.issues.map((i) => `${i.code} - ${i.message}`).join(", ")}`);
    }
    return result.data;
  };
}

const ProdSchema = z.coerce.boolean();
const ServerPortSchema = z.coerce.number().min(1).max(65535).default(8000);
const DatabaseUrlSchema = z.string().url().startsWith("postgres://");
const JwtAlgorithmSchema = z.string().default("ES384");
const JwtPrivateKeySchema = z.string().startsWith("-----BEGIN PRIVATE KEY-----").endsWith("-----END PRIVATE KEY-----");
const JwtPublicKeySchema = z.string().startsWith("-----BEGIN PUBLIC KEY-----").endsWith("-----END PUBLIC KEY-----");

export const envProd: Reader<boolean> = envReader("PROD", ProdSchema);
export const envServerPort: Reader<number> = envReader("SERVER_PORT", ServerPortSchema);
export const envDatabaseUrl: Reader<string> = envReader("DATABASE_URL", DatabaseUrlSchema);
export const envJwtAlgorithm: Reader<string> = envReader("JWT_ALGORITHM", JwtAlgorithmSchema);
export const envJwtPrivateKey: Reader<string> = envReader("JWT_PRIVATE_KEY", JwtPrivateKeySchema);
export const envJwtPublicKey: Reader<string> = envReader("JWT_PUBLIC_KEY", JwtPublicKeySchema);

const envDatabaseUrlOpt = envReader("DATABASE_URL", DatabaseUrlSchema.optional());

export function logEnvironment(logger: Logger, getter = defaultGetter) {
  const prod = envProd(getter);

  logger.info(null, "env", {
    prod,
    serverPort: envServerPort(getter),
    databaseUrl: envDatabaseUrlOpt(getter),
    jwtAlgorithm: envJwtAlgorithm(getter),
    jwtPrivateKey: envJwtPrivateKey(getter),
    jwtPublicKey: envJwtPublicKey(getter),
  });

  if (!prod) {
    logger.warn(null, "dev mode");
  }
}
