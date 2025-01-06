import type { UUID } from "@jobberknoll/core/shared";
import { SERVICE_AGENT } from "@jobberknoll/core/shared";
import type { Ctx } from "../shared/ctx.ts";

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

type LogMethod = (
  requestId: UUID | null,
  event: string,
  tags?: LogTags,
) => void;

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

  private logMethod(level: LogLevel): LogMethod {
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

  public debug: LogMethod = this.logMethod("debug");
  public info: LogMethod = this.logMethod("info");
  public warn: LogMethod = this.logMethod("warn");
  public error: LogMethod = this.logMethod("error");

  /**
   * Wraps a handler function with logging and returns a new function DROPPING the context.
   */
  public instrument<A extends unknown[], R>(
    that: object,
    handler: (...a: A) => Promise<R>,
  ): (c: Ctx, ...a: A) => Promise<R> {
    const method = `${that.constructor.name}#${handler.name}`;
    return async ({ requestId }, ...args) => {
      this.debug(requestId, `${method} - start`, { args });
      const res = await handler.bind(that)(...args);
      this.debug(requestId, `${method} - end`, { res });
      return res;
    };
  }

  /**
   * Wraps a handler function with logging and returns a new function PASSING the context along.
   */
  public propagate<A extends unknown[], R>(
    that: object,
    handler: (c: Ctx, ...a: A) => Promise<R>,
  ): (c: Ctx, ...a: A) => Promise<R> {
    const method = `${that.constructor.name}#${handler.name}`;
    return async (ctx, ...args) => {
      this.debug(ctx.requestId, `${method} - start`, { args });
      const res = await handler.bind(that)(ctx, ...args);
      this.debug(ctx.requestId, `${method} - end`, { res });
      return res;
    };
  }
}
