import type { UUID } from "@jobberknoll/core/shared";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogTags = Record<string, unknown>;

type LogData = {
  service: string;
  requestId: UUID | null;
  time: number;
  level: LogLevel;
  event: string;
  tags: LogTags;
};

export type LogTransport = {
  level: LogLevel;
  handle(data: LogData): void;
};
