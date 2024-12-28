import { assertEquals, assertExists } from "@std/assert";
import { setupTest } from "../setup.ts";

Deno.test("GET /int/v1/docs should return an index of docs", async () => {
  const { app } = setupTest();

  const response = await app.request("/int/v1/docs");
  const body = await response.json();

  assertEquals(response.status, 200);
  assertExists(body.openapi);
  assertExists(body.swagger);
  assertExists(body.scalar);
});

Deno.test(
  "GET /int/v1/docs/openapi.json should return the OpenAPI spec",
  async () => {
    const { app } = setupTest();

    const response = await app.request("/int/v1/docs/openapi.json");
    const body = await response.json();

    assertEquals(response.status, 200);
    assertEquals(body.openapi, "3.0.0");
  },
);

for (const ui of ["swagger", "scalar"]) {
  const path = `/int/v1/docs/${ui}`;
  Deno.test(`GET ${path} should be available`, async () => {
    const { app } = setupTest();

    const response = await app.request(path);
    const body = await response.text();

    assertEquals(response.status, 200);
    assertExists(body);
  });
}
