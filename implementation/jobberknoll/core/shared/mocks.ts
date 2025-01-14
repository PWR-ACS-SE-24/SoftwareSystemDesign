import type { Account } from "../domain/entities/mod.ts";
import { uuid } from "./uuid.ts";

export const accountMock: Account = {
  id: uuid(),
  type: "passenger",
  fullName: "John Smith",
  email: "john.smith@example.com",
  hashedPassword: "$argon2id$v=19$m=16,t=2,p=1$Y3FocFNsT2Q3VjQxaXFpNA$wqO5cqXN1/qEd7+/cHznfg", // "Password"
  lastModified: 1735558355,
  phoneNumber: null,
};
