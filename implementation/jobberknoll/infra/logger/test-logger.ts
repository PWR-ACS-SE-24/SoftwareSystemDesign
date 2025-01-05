import { type LogData, Logger } from "@jobberknoll/app";

export class TestLogger extends Logger {
  protected readonly level = "debug";

  protected handle(_data: LogData) {
    // TODO: Implement to use in tests
  }
}
