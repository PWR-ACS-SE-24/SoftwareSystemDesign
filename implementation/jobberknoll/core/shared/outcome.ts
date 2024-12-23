import type { Option } from "./option.ts";
import type { Result } from "./result.ts";

export function expect<T>(
  container: Result<T, unknown> | Option<T>,
  message: string,
): T {
  switch (container.tag) {
    case "ok":
    case "some":
      return container.value;
    default:
      throw new Error(message);
  }
}
