export type Some<T> = { tag: "some"; value: T };
export type None = { tag: "none" };

export type Option<T> = Some<T> | None;

export const some = <T>(value: T): Some<T> => ({ tag: "some", value });
export const none = (): None => ({ tag: "none" });

export const isSome = <T>(option: Option<T>): option is Some<T> => option.tag === "some";
export const isNone = <T>(option: Option<T>): option is None => option.tag === "none";
