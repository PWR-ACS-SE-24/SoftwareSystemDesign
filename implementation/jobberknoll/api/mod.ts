export { buildApi } from "./api.ts";

// Feather
import { HealthDto } from "./int/contracts/health-dto.ts";
import { IntHeadersSchema } from "./int/openapi.ts";
import { configureDocs } from "./shared/docs.ts";
import { jsonRes, UuidSchema } from "./shared/openapi.ts";

export { configureDocs, HealthDto, IntHeadersSchema, jsonRes, UuidSchema };
