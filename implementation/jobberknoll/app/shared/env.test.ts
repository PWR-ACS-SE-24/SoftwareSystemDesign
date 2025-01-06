import { TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals, assertThrows } from "@std/assert";
import z from "zod";
import { envReader, logEnvironment } from "./env.ts";

const TestSchema = z.coerce.number();

Deno.test("envReader should parse valid environment variables", () => {
  const reader = envReader("TEST", TestSchema);

  const value = reader(() => "123");

  assertEquals(value, 123);
});

Deno.test("envReader should throw an error for missing environment variables", () => {
  const reader = envReader("TEST", TestSchema);

  assertThrows(() => reader(() => undefined));
});

Deno.test("envReader should throw an error for invalid environment variables", () => {
  const reader = envReader("TEST", TestSchema);

  assertThrows(() => reader(() => "abc"));
});

Deno.test("logEnvironment should log the environment", () => {
  const logger = new TestLogger();
  const getter = (key: string) => ({
    PROD: undefined,
    SERVER_PORT: "123",
    DATABASE_URL: "postgres://example",
  }[key]);

  logEnvironment(logger, getter);

  assert(logger.matches("env", {
    prod: false,
    serverPort: 123,
    databaseUrl: "postgres://example",
  }, null));
});
