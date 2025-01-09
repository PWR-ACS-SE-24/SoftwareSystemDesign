import { createRoute } from "@hono/zod-openapi";
import { USER_ROLES, type UserRole } from "@jobberknoll/app";
import { TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { createJkApp, type JkHandler } from "~/shared/hooks.ts";
import { authorize, isValid } from "./authorization.ts";

for (const expectedRole of [...USER_ROLES, "member"] as const) {
  Deno.test(`isValid should reject invalid user roles if expecting ${expectedRole}`, () => {
    assert(!isValid(expectedRole, undefined));
    assert(!isValid(expectedRole, ""));
    assert(!isValid(expectedRole, "invalid"));
    assert(!isValid(expectedRole, "something"));
    assert(!isValid(expectedRole, "member"));
  });
}

for (const expectedRole of USER_ROLES) {
  Deno.test(`isValid should accept ${expectedRole} if expecting ${expectedRole}`, () => {
    assert(isValid(expectedRole, expectedRole));
  });
}

for (const expectedRole of USER_ROLES) {
  Deno.test(`isValid should reject other roles if expecting ${expectedRole}`, () => {
    for (const userRole of USER_ROLES.filter((role) => role !== expectedRole)) {
      assert(!isValid(expectedRole, userRole));
    }
  });
}

Deno.test("isValid should reject guest if expecting member", () => {
  assert(!isValid("member", "guest"));
});

for (const userRole of ["admin", "driver", "passenger", "inspector"] as const) {
  Deno.test(`isValid should accept ${userRole} if expecting member`, () => {
    assert(isValid("member", userRole));
  });
}

function setup(expectedRole: UserRole | "member") {
  const route = createRoute({
    method: "get",
    path: "/path",
    responses: { 204: { description: "No content." } },
  });
  const info = { wasCalled: false };
  const handler = authorize(expectedRole, (c) => {
    info.wasCalled = true;
    return c.body(null, 204);
  }) satisfies JkHandler<typeof route>;
  const app = createJkApp(new TestLogger()).openapi(route, handler);
  return { info, app };
}

Deno.test("authorize should call the handler if the user is authorized", async () => {
  const { info, app } = setup("admin");

  const res = await app.request("/path", { headers: { "jp-user-role": "admin" } });

  assertEquals(res.status, 204);
  assert(info.wasCalled);
});

Deno.test("authorize should not call the handler if the user is not authorized", async () => {
  const { info, app } = setup("admin");

  const res = await app.request("/path", { headers: { "jp-user-role": "guest" } });

  assertEquals(res.status, 401);
  assert(!info.wasCalled);
});
