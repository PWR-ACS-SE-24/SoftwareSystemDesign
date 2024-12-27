import workspace from "$workspace" with { type: "json" };

export const SERVICE: `Jobberknoll/${string}` =
  `Jobberknoll/${workspace.version}`;
