import { envReader, Logger } from "@jobberknoll/app";
import z from "zod";

const ServerPortSchema = z.coerce.number().min(1).max(65535).default(8001);
const JobberknollServiceHostSchema = z.string().url();
const JobberknollServicePortSchema = z.coerce.number().min(1).max(65535);

const envJobberknollServiceHost = envReader("JOBBERKNOLL_SERVICE_HOST", JobberknollServiceHostSchema);
const envJobberknollServicePort = envReader("JOBBERKNOLL_SERVICE_PORT", JobberknollServicePortSchema);

export const envServerPort = envReader("SERVER_PORT", ServerPortSchema);
export const envJobberknollAddress = () => `${envJobberknollServiceHost()}:${envJobberknollServicePort()}`;

export function logEnvironment(logger: Logger) {
  logger.info(null, "env", {
    serverPort: envServerPort(),
    jobberknollAddress: envJobberknollAddress(),
  });
}
