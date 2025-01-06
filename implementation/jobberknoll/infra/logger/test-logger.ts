import { type LogData, Logger } from "@jobberknoll/app";

export class TestLogger extends Logger {
  private readonly logs: LogData[] = [];

  protected readonly level = "debug";

  protected handle(data: LogData) {
    this.logs.push(data);
  }

  public matches(event: string, tags: Record<string, unknown> = {}): boolean {
    return this.logs.some((log) => {
      if (log.event !== event) return false;
      for (const [key, value] of Object.entries(tags)) {
        if (!(key in log.tags)) return false;
        if (log.tags[key] !== value) return false;
      }
      return true;
    });
  }
}
