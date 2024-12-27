export type Ok<T> = { tag: "ok"; value: T };
export type Err<E> = { tag: "err"; value: E };

export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ tag: "ok", value });
export const err = <E>(value: E): Err<E> => ({ tag: "err", value });

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.tag === "ok";
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.tag === "err";
