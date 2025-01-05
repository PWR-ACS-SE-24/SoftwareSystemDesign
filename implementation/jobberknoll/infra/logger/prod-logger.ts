import { type LogData, Logger, redactSensitiveKeysDeep } from "@jobberknoll/app";

export class ProdLogger extends Logger {
  protected readonly level = "info";

  protected async handle(data: LogData) {
    console.log(JSON.stringify(await redactSensitiveKeysDeep(data)));
  }
}
