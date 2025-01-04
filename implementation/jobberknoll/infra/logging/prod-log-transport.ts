import type { LogTransport } from "@jobberknoll/app";

export const prodLogTransport = {
  level: "info",
  handle: (data) => console.log(JSON.stringify(data)),
} satisfies LogTransport;
