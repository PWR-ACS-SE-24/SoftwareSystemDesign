import type { JkApp } from "~/shared/hooks.ts";

export type Controller = {
  prefix: string;
  routes: JkApp;
};
