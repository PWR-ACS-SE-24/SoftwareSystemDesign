import workspace from "../deno.json" with { type: "json" };

export const SERVICE_VERSION = workspace.version;

export const SERVICE_AGENT: `Feather/${string}` = `Feather/${workspace.version}`;
