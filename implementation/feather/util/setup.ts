import { ProdLogger, TestLogger } from "@jobberknoll/infra";
import { JSONWebKeySet } from "jose";
import { buildApi } from "../api.ts";
import { JobberknollJwksProvider, MockJwksProvider } from "../jwks-provider/mod.ts";

export const setupTest = (jwks: JSONWebKeySet) => {
  const logger = new TestLogger();
  const jwksProvider = new MockJwksProvider(jwks);
  const api = buildApi(logger, jwksProvider);
  return { logger, jwksProvider, api };
};

export const setupProd = (jobberknollAddress: string) => {
  const logger = new ProdLogger();
  const jwksProvider = new JobberknollJwksProvider(jobberknollAddress);
  const api = buildApi(logger, jwksProvider);
  return { logger, jwksProvider, api };
};
