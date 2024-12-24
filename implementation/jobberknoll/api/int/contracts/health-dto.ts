import { z } from "@hono/zod-openapi";

// https://docs.spring.io/spring-boot/api/rest/actuator/health.html

const Status = z.enum(["DOWN", "OUT_OF_SERVICE", "UNKNOWN", "UP"]).openapi({
  description: "Status, one of: DOWN, OUT_OF_SERVICE, UNKNOWN, UP.",
  examples: ["UP"],
});

const Component = z.object({
  status: Status,
  details: z
    .record(z.string())
    .optional()
    .openapi({
      description:
        "Details of the health of a specific part of the application.",
      examples: [{ version: "1.0.0", database: "H2" }],
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
        examples: [{ db: { status: "DOWN" } }],
      }),
  })
  .openapi("HealthDto", {
    description: "Health status of the service.",
    examples: [
      {
        status: "UP",
        components: { db: { status: "UP", details: { database: "postgres" } } },
      },
    ],
  });

export type HealthDto = z.infer<typeof HealthDto>;
