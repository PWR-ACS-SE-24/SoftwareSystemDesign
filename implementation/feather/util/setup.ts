import { JSONWebKeySet } from "jose";
import { buildApi } from "../api.ts";
import { JobberknollJwksProvider, MockJwksProvider } from "../jwks-provider/mod.ts";

export const setupTest = (jwks: JSONWebKeySet) => {
  const jwksProvider = new MockJwksProvider(jwks);
  const api = buildApi(jwksProvider);
  return { jwksProvider, api };
};

export const setupProd = (jobberknollAddress: string) => {
  const jwksProvider = new JobberknollJwksProvider(jobberknollAddress);
  const api = buildApi(jwksProvider);
  return { jwksProvider, api };
};
