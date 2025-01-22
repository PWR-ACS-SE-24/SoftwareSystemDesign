import { createLocalJWKSet, JSONWebKeySet } from "jose";
import { ComponentHealth, JwksProvider, JwksResolver } from "./jwks-provider.ts";

export class MockJwksProvider implements JwksProvider {
  public constructor(private readonly jwks: JSONWebKeySet) {}

  public getJwksResolver(): Promise<JwksResolver> {
    return Promise.resolve(createLocalJWKSet(this.jwks));
  }

  public health(): Promise<ComponentHealth> {
    return Promise.resolve({
      status: "UP",
      details: { implementation: this.constructor.name },
    });
  }
}
