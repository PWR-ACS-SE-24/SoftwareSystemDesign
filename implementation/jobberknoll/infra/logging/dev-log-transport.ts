import type { LogTransport } from "@jobberknoll/app";
import { bold, cyan, gray, green, red, white, yellow } from "@std/fmt/colors";

const COLORS = {
  debug: white,
  info: green,
  warn: yellow,
  error: red,
};

export const devLogTransport = {
  level: "debug",
  handle: (data) => {
    const date = new Date(data.time);
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const time = `[${hour}:${minute}]`;
    const requestId = `(${data.requestId?.slice(-8) ?? data.service})`;
    const level = bold(data.level.toUpperCase());
    const event = cyan(data.event);

    console.log(COLORS[data.level](`${time} ${requestId} ${level}: ${event}`));
    if (Object.keys(data.tags).length > 0) {
      console.log(gray(JSON.stringify(data.tags)));
    }
  },
} satisfies LogTransport;
