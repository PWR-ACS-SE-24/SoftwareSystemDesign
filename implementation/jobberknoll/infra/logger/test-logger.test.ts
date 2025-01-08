import { uuid } from "@jobberknoll/core/shared";
import { assert } from "@std/assert";
import { TestLogger } from "./test-logger.ts";

Deno.test("matches should return true if the logger has logged a given event", () => {
  const logger = new TestLogger();

  logger.info(null, "event");

  assert(logger.matches("event"));
});

Deno.test("matches should return true if the correct tags have been logged", () => {
  const logger = new TestLogger();

  logger.info(null, "event", { key: "value", deep: [1, 2], extra: "extra" });

  assert(logger.matches("event", { key: "value", deep: [1, 2] }));
});

Deno.test("matches should return true if the correct requestId has been logged", () => {
  const logger = new TestLogger();
  const requestId = uuid();

  logger.info(requestId, "event");

  assert(logger.matches("event", {}, requestId));
});

Deno.test("matches should return false if the logger has not logged a given event", () => {
  const logger = new TestLogger();

  logger.info(null, "event");

  assert(!logger.matches("other"));
});

Deno.test("matches should return false if the incorrect tags have been logged", () => {
  const logger = new TestLogger();

  logger.info(null, "event", { key: "value", deep: [1, 2] });

  assert(!logger.matches("event", { key: "value", deep: [3, 4] }));
});

Deno.test("matches should return false if the incorrect requestId has been logged", () => {
  const logger = new TestLogger();

  logger.info(uuid(), "event");

  assert(!logger.matches("event", {}, uuid()));
});
