import { assertEquals, assertExists } from "@std/assert";
import { setupTest } from "../setup.ts";

for (const scope of ["int", "ext"]) {
  Deno.test(`GET /${scope}/v1/docs should return an index of docs`, async () => {
    const { api } = setupTest();

    const response = await api.request(`/${scope}/v1/docs`);
    const body = await response.json();

    assertEquals(response.status, 200);
    assertExists(body.openapi);
    assertExists(body.swagger);
    assertExists(body.scalar);
  });

  Deno.test(
    `GET /${scope}/v1/docs/openapi.json should return the OpenAPI spec`,
    async () => {
      const { api } = setupTest();

      const response = await api.request(`/${scope}/v1/docs/openapi.json`);
      const body = await response.json();

      assertEquals(response.status, 200);
      assertEquals(body.openapi, "3.0.0");
    },
  );

  for (const ui of ["swagger", "scalar"]) {
    Deno.test(`GET /${scope}/v1/docs/${ui} should be available`, async () => {
      const { api } = setupTest();

      const response = await api.request(`/${scope}/v1/docs/${ui}`);
      const body = await response.text();

      assertEquals(response.status, 200);
      assertExists(body);
    });
  }
}
