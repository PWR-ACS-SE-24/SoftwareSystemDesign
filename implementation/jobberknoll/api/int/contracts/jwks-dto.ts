import { z } from "@hono/zod-openapi";

const JWK_EXAMPLE = {
  kty: "EC",
  crv: "P-384",
  x: "mIVl8us5OraMt1yuVe3NmWZ-CfZfCR_ibjzY1XCo_lbAd8Kvb-UzBJB6e-L7Q2k4",
  y: "yq13VlAOO0g0MDSBXLZvwuW0BA7PfBNhPsxleLUAjoTsFNyi55XnyAJ4chQBU_fi",
  kid: "a6y6pdvqKVEVdlsxHYrbZK0ntJaNjAOP056-VlTzUVs",
} as const;

const Jwk = z.object({
  kty: z.string().openapi({
    description: "Cryptographic algorithm family used with the key.",
    examples: [JWK_EXAMPLE.kty],
  }),
  kid: z.string().optional().openapi({ description: "The key ID.", examples: [JWK_EXAMPLE.kid] }),
  // NOTE: the JWK technically has many more fields, but it's not necessary to include them all here
}).openapi({ description: "A JSON Web Key object.", examples: [JWK_EXAMPLE] });

export const JwksDto = z.object({
  keys: z.array(Jwk).openapi({
    description: "An array of JWK values.",
    examples: [[JWK_EXAMPLE]],
  }),
}).openapi("JwksDto", { description: "The JSON Web Key Set object.", examples: [{ keys: [JWK_EXAMPLE] }] });

export type JwksDto = z.infer<typeof JwksDto>;
