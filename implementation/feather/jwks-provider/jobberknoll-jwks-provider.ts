import { Logger } from "@jobberknoll/app";
import { createLocalJWKSet, JSONWebKeySet } from "jose";
import { SERVICE_AGENT } from "../util/metadata.ts";
import { ComponentHealth, JwksProvider, JwksResolver } from "./jwks-provider.ts";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export class JobberknollJwksProvider extends JwksProvider {
  private jwks: JSONWebKeySet = { keys: [] };
  private lastUpdateMs = 0;
  private isHealthy = true;

  public constructor(logger: Logger, private readonly jobberknollAddress: string) {
    super(logger);
  }

  private async refreshKeys(): Promise<void> {
    const nowMs = Date.now();
    if (nowMs - this.lastUpdateMs < REFRESH_INTERVAL_MS) return;
    this.lastUpdateMs = nowMs;

    try {
      const response = await fetch(`${this.jobberknollAddress}/int/v1/jwks`, {
        headers: { "user-agent": SERVICE_AGENT },
      });
      const jwks = await response.json();

      this.jwks = jwks;
      this.isHealthy = true;
      this.logger.info(null, "refreshKeys success", { jwks });
    } catch (err) {
      console.error(err);
      this.isHealthy = false;
      this.logger.warn(null, "refreshKeys fail", { err });
    }
  }

  public async handleGetJwksResolver(): Promise<JwksResolver> {
    await this.refreshKeys();
    return createLocalJWKSet(this.jwks);
  }

  public async health(): Promise<ComponentHealth> {
    await this.refreshKeys();
    return {
      status: this.isHealthy ? "UP" : "DOWN",
      details: { implementation: this.constructor.name },
    };
  }
}
