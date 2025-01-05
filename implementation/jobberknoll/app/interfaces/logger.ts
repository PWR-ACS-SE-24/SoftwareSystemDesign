import type { UUID } from "@jobberknoll/core/shared";
import { SERVICE_AGENT } from "@jobberknoll/core/shared";

export type LogLevel = "debug" | "info" | "warn" | "error";

type LogTags = Record<string, unknown>;

type LogParams = {
  requestId: UUID | null;
  level: LogLevel;
  event: string;
  tags: LogTags;
};

export type LogData = {
  service: string;
  requestId: UUID | null;
  time: number;
  level: LogLevel;
  event: string;
  tags: LogTags;
};

type LogMethod = (
  requestId: UUID | null,
  event: string,
  tags?: LogTags,
) => void;

const LEVELS = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
};

export abstract class Logger {
  public debug: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "debug", event, tags });

  public info: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "info", event, tags });

  public warn: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "warn", event, tags });

  public error: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "error", event, tags });

  private log(params: LogParams): void {
    if (LEVELS[this.level] <= LEVELS[params.level]) {
      this.handle({
        service: SERVICE_AGENT,
        requestId: params.requestId,
        time: Date.now(),
        level: params.level,
        event: params.event,
        tags: params.tags,
      });
    }
  }

  protected abstract get level(): LogLevel;
  protected abstract handle(data: LogData): void | Promise<void>;
}
