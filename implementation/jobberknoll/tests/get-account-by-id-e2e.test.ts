import { accountMock, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { setupTest } from "../setup.ts";

for (const scope of ["int", "ext"]) {
  Deno.test(
    `GET /${scope}/v1/accounts/{id} should return an account if it exists`,
    async () => {
      const { api } = setupTest({ seededAccounts: [accountMock] });

      const response = await api.request(
        `/${scope}/v1/accounts/${accountMock.id}`,
      );
      const body = await response.json();

      assertEquals(response.status, 200);
      assertEquals(body.id, accountMock.id);
      assertEquals(body.type, accountMock.type);
      assertEquals(body.fullName, accountMock.fullName);
      assertEquals(body.email, accountMock.email);
    },
  );

  Deno.test(`GET /${scope}/v1/accounts/{id} should not leak private fields`, async () => {
    const { api } = setupTest({ seededAccounts: [accountMock] });

    const response = await api.request(
      `/${scope}/v1/accounts/${accountMock.id}`,
    );
    const body = await response.json();

    assert(!("hashedPassword" in body));
    assert(!("isActive" in body));
    assert(!("lastModified" in body));
  });

  Deno.test(
    `GET /${scope}/v1/accounts/{id} should return account-not-found if the account does not exist`,
    async () => {
      const { api } = setupTest();

      const response = await api.request(`/${scope}/v1/accounts/${uuid()}`);
      const body = await response.json();

      assertEquals(response.status, 404);
      assertEquals(body.kind, "account-not-found");
    },
  );

  Deno.test(
    `GET /${scope}/v1/accounts/{id} should return account-not-found if the account is inactive`,
    async () => {
      const inactiveAccount = { ...accountMock, isActive: false };
      const { api } = setupTest({ seededAccounts: [inactiveAccount] });

      const response = await api.request(
        `/${scope}/v1/accounts/${inactiveAccount.id}`,
      );
      const body = await response.json();

      assertEquals(response.status, 404);
      assertEquals(body.kind, "account-not-found");
    },
  );

  Deno.test(
    `GET /${scope}/v1/accounts/{id} should return schema-mismatch if the account id is not a UUID`,
    async () => {
      const { api } = setupTest();

      const response = await api.request(`/${scope}/v1/accounts/123`);
      const body = await response.json();

      assertEquals(response.status, 422);
      assertEquals(body.kind, "schema-mismatch");
    },
  );
}
