import { type LogData, Logger } from "@jobberknoll/app";
import type { UUID } from "@jobberknoll/core/shared";

export class TestLogger extends Logger {
  private readonly logs: LogData[] = [];

  protected readonly level = "debug";

  protected handle(data: LogData) {
    this.logs.push(data);
  }

  public matches(event: string, tags: Record<string, unknown> = {}, requestId?: UUID | null): boolean {
    return this.logs.some((log) => {
      if (log.event !== event) return false;
      for (const [key, value] of Object.entries(tags)) {
        if (!(key in log.tags)) return false;
        if (JSON.stringify(log.tags[key]) !== JSON.stringify(value)) return false;
      }
      if (requestId !== undefined && log.requestId !== requestId) return false;
      return true;
    });
  }
}
