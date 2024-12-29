import workspace from "$workspace" with { type: "json" };

export const SERVICE_VERSION: string = workspace.version;

export const SERVICE_AGENT: `Jobberknoll/${string}` =
  `Jobberknoll/${workspace.version}`;
