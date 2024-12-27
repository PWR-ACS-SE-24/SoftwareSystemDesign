type HealthStatus = "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN" | "UP";

export type ServiceHealth = {
  status: HealthStatus;
};
