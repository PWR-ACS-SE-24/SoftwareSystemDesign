import type { UUID } from "@jobberknoll/core/shared";
import { SERVICE_AGENT } from "@jobberknoll/core/shared";

export type LogLevel = "debug" | "info" | "warn" | "error";

type LogTags = Record<string, unknown>;

export type LogData = {
  service: string;
  requestId: UUID | null;
  time: number;
  level: LogLevel;
  event: string;
  tags: LogTags;
};

// NOTE: Taken from https://github.com/pinojs/pino/blob/main/docs/api.md#levels
const LEVELS = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
};

export abstract class Logger {
  protected abstract get level(): LogLevel;

  protected abstract handle(data: LogData): void | Promise<void>;

  private logMethod(level: LogLevel): (requestId: UUID | null, event: string, tags?: LogTags) => void {
    return (requestId, event, tags = {}) => {
      if (LEVELS[this.level] <= LEVELS[level]) {
        void this.handle({
          service: SERVICE_AGENT,
          requestId,
          time: Date.now(),
          level,
          event,
          tags,
        });
      }
    };
  }

  public debug = this.logMethod("debug");
  public info = this.logMethod("info");
  public warn = this.logMethod("warn");
  public error = this.logMethod("error");
}
