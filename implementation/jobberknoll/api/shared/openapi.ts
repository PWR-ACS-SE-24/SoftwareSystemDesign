export function jsonRes<T>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}
