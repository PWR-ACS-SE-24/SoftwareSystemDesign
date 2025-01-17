import { assertEquals, assertGreaterOrEqual } from "@std/assert";
import { setupTest } from "../setup.ts";

Deno.test("/int/v1/jwks should return a list of JWKs", async () => {
  const { api } = await setupTest();

  const response = await api.request("/int/v1/jwks");
  const body = await response.json();

  assertEquals(response.status, 200);
  assertGreaterOrEqual(body.keys.length, 1);
});
