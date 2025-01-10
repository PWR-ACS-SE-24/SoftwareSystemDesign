import type { ComponentHealth } from "~/shared/mod.ts";

export type Monitorable = {
  health(): Promise<ComponentHealth>;
};
