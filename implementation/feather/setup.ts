import { buildApi } from "./api.ts";

export const setupDev = () => {
  const api = buildApi();
  return { api };
};

export const setupProd = () => {
  const api = buildApi();
  return { api };
};
