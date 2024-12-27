import type { Account } from "../domain/entities/mod.ts";
import { uuid } from "./uuid.ts";

export const accountMock: Account = {
  id: uuid(),
  type: "passenger",
  fullName: "John Smith",
  email: "john.smith@example.com",
  hashedPassword:
    "$2a$12$9rnvHqxGPHRiMtBZlKwKluiQ.qDY3BkmAFN3prpZdkuRhtE9Zx0gy",
  isActive: true,
  lastModified: 1734977958974,
};
