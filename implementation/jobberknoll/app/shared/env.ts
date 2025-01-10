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

export const envProd: Reader<boolean> = envReader("PROD", ProdSchema);
export const envServerPort: Reader<number> = envReader("SERVER_PORT", ServerPortSchema);
export const envDatabaseUrl: Reader<string> = envReader("DATABASE_URL", DatabaseUrlSchema);

const envDatabaseUrlOpt = envReader("DATABASE_URL", DatabaseUrlSchema.optional());

export function logEnvironment(logger: Logger, getter = defaultGetter) {
  const prod = envProd(getter);

  logger.info(null, "env", {
    prod,
    serverPort: envServerPort(getter),
    databaseUrl: envDatabaseUrlOpt(getter),
  });

  if (!prod) {
    logger.warn(null, "dev mode");
  }
}
