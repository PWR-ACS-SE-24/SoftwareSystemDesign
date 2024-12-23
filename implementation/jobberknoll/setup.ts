import { buildApp, IntController } from "@jobberknoll/api";

export function setupProd() {
  const intController = new IntController();
  return buildApp([intController]);
}

export function setupTest() {
  const intController = new IntController();
  return buildApp([intController]);
}
