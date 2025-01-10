export type HealthStatus = "UP" | "DOWN";

export type ComponentHealth = {
  status: HealthStatus;
  details?: Record<string, string>;
};

export type SystemHealth = {
  status: HealthStatus;
  components?: Record<string, ComponentHealth>;
};
