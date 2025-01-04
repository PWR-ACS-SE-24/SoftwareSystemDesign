import type { LogTransport } from "@jobberknoll/app";
import { redactSensitiveKeysDeep } from "@jobberknoll/app";

export const prodLogTransport = {
  level: "info",
  handle: async (data) => console.log(JSON.stringify(await redactSensitiveKeysDeep(data))),
} satisfies LogTransport;
