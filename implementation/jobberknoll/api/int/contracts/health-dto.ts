import { z } from "@hono/zod-openapi";

// NOTE: subset of https://docs.spring.io/spring-boot/api/rest/actuator/health.html

const Status = z.enum(["UP", "DOWN"]).openapi({
  description: "Status, one of: UP, DOWN.",
  examples: ["UP", "DOWN"],
});

const Component = z.object({
  status: Status,
  details: z
    .record(z.string())
    .optional()
    .openapi({
      description: "Details of the health of a specific part of the application.",
      examples: [{
        implementation: "PostgresAccountRepo",
        version:
          "PostgreSQL 17.0 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit",
      }],
    }),
});

export const HealthDto = z
  .object({
    status: Status,
    components: z
      .record(Component)
      .optional()
      .openapi({
        description: "The components that make up the health.",
        examples: [{ accountRepo: { status: "DOWN" } }],
      }),
  })
  .openapi("HealthDto", {
    description: "Health status of the service.",
    examples: [
      {
        status: "UP",
        components: { accountRepo: { status: "UP", details: { implementation: "PostgresAccountRepo" } } },
      },
    ],
  });

export type HealthDto = z.infer<typeof HealthDto>;
