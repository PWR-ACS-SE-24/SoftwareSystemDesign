import type { UUID } from "@jobberknoll/core/shared";

export type AccountBase = {
  id: UUID;
  fullName: string;
  email: string;
  hashedPassword: string;
  isActive: boolean;
  lastModified: number;
};
