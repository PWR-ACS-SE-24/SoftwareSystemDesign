import { assertEquals } from "@std/assert";
import { setupTest } from "../setup.ts";

Deno.test("GET /int/v1/health should return the service health", async () => {
  const { api } = await setupTest();

  const response = await api.request("/int/v1/health");
  const body = await response.json();

  assertEquals(response.status, 200);
  assertEquals(body, { status: "UP" });
});
