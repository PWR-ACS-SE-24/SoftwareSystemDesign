export type UserRole = "guest" | "admin" | "driver" | "passenger" | "inspector";

export const USER_ROLES = [
  "guest",
  "admin",
  "driver",
  "passenger",
  "inspector",
] as const;
