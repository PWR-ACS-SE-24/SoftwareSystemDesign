import { ComponentHealth, Monitorable } from "@jobberknoll/app";
import { createLocalJWKSet } from "jose";

export type JwksResolver = ReturnType<typeof createLocalJWKSet>;
export type { ComponentHealth };

export abstract class JwksProvider implements Monitorable {
  public abstract getJwksResolver(): Promise<JwksResolver>;
  public abstract health(): Promise<ComponentHealth>;
}
