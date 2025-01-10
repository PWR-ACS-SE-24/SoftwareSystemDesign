import { assert, assertEquals } from "@std/assert";
import { setupTest } from "../setup.ts";

Deno.test("GET /int/v1/endpoints should return external endpoint array", async () => {
  const { api } = await setupTest();

  const response = await api.request("/int/v1/endpoints");
  const body = await response.json();

  assertEquals(response.status, 200);
  assert(Array.isArray(body));
});
