import { type UUID, uuid } from "@jobberknoll/core/shared";

export type Ctx = { requestId: UUID };

export const newCtx: () => Ctx = () => ({ requestId: uuid() });
