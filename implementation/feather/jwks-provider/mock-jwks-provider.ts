import { Logger } from "@jobberknoll/app";
import { createLocalJWKSet, JSONWebKeySet } from "jose";
import { ComponentHealth, JwksProvider, JwksResolver } from "./jwks-provider.ts";

export class MockJwksProvider extends JwksProvider {
  public constructor(logger: Logger, private readonly jwks: JSONWebKeySet) {
    super(logger);
  }

  public handleGetJwksResolver(): Promise<JwksResolver> {
    return Promise.resolve(createLocalJWKSet(this.jwks));
  }

  public health(): Promise<ComponentHealth> {
    return Promise.resolve({
      status: "UP",
      details: { implementation: this.constructor.name },
    });
  }
}
