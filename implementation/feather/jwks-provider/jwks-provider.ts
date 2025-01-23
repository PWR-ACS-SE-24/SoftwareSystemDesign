import { ComponentHealth, Ctx, Logger, Monitorable } from "@jobberknoll/app";
import { createLocalJWKSet } from "jose";

export type JwksResolver = ReturnType<typeof createLocalJWKSet>;
export type { ComponentHealth };

export abstract class JwksProvider implements Monitorable {
  public constructor(protected readonly logger: Logger) {
    this.getJwksResolver = logger.instrument(this, this.handleGetJwksResolver);
  }

  public abstract health(): Promise<ComponentHealth>;

  protected abstract handleGetJwksResolver(): Promise<JwksResolver>;
  public readonly getJwksResolver: (ctx: Ctx) => Promise<JwksResolver>;
}
