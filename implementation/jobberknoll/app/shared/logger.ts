import { SERVICE_AGENT, type UUID } from "@jobberknoll/core/shared";
import type { LogLevel, LogTags, LogTransport } from "~/interfaces/mod.ts";

type LogParams = {
  requestId: UUID | null;
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

export class Logger {
  public constructor(private readonly transports: LogTransport[] = []) {}

  public debug: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "debug", event, tags });

  public info: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "info", event, tags });

  public warn: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "warn", event, tags });

  public error: LogMethod = (requestId, event, tags = {}) => this.log({ requestId, level: "error", event, tags });

  private log(params: LogParams): void {
    const data = {
      service: SERVICE_AGENT,
      requestId: params.requestId,
      time: Date.now(),
      level: params.level,
      event: params.event,
      tags: params.tags,
    };

    this.transports.forEach((transport) => {
      if (LEVELS[transport.level] <= LEVELS[data.level]) {
        transport.handle(data);
      }
    });
  }
}
