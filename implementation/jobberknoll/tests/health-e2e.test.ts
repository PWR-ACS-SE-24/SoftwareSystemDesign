import { MemoryAccountRepo } from "@jobberknoll/infra";
import { assertEquals, assertObjectMatch } from "@std/assert";
import { setupTest } from "../setup.ts";

Deno.test("GET /int/v1/health should return the service health", async () => {
  const { api } = await setupTest();

  const response = await api.request("/int/v1/health");
  const body = await response.json();

  assertEquals(response.status, 200);
  assertObjectMatch(body, {
    status: "UP",
    components: {
      accountRepo: { status: "UP" },
      logger: { status: "UP" },
    },
  });
});

Deno.test("GET /int/v1/health should react to a failing component", async () => {
  const { api, accountRepo } = await setupTest();
  (accountRepo as MemoryAccountRepo).isHealthy = false; // SAFETY: if this cast fails, the test will fail, which is good

  const response = await api.request("/int/v1/health");
  const body = await response.json();

  assertEquals(response.status, 503);
  assertObjectMatch(body, {
    status: "DOWN",
    components: {
      accountRepo: { status: "DOWN" },
      logger: { status: "UP" },
    },
  });
});
