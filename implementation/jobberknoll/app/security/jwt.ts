import type { Account } from "@jobberknoll/core/domain";
import type { UUID } from "@jobberknoll/core/shared";
import {
  calculateJwkThumbprint,
  exportJWK,
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importPKCS8,
  importSPKI,
  type JSONWebKeySet,
  type JWK,
  jwtVerify,
  type KeyLike,
  SignJWT,
} from "jose";

const ISSUER = "jakprzyjade:jobberknoll";
const TYPE_KEY = "jakprzyjade:account:type";

const AUDIENCE_ACCESS = "jakprzyjade:feather:access";
const EXPIRATION_ACCESS = "1h";

const AUDIENCE_REFRESH = "jakprzyjade:jobberknoll:refresh";
const EXPIRATION_REFRESH = "7d";

type AccessTokenData = Pick<Account, "id" | "type">;

export class JwtHandler {
  private constructor(
    private readonly algorithm: string,
    private readonly privateKey: KeyLike,
    private readonly publicKey: KeyLike,
  ) {}

  public static async setup(algorithm: string, privateKeyPkcs8: string, publicKeySpki: string): Promise<JwtHandler> {
    const privateKey = await importPKCS8(privateKeyPkcs8, algorithm);
    const publicKey = await importSPKI(publicKeySpki, algorithm);
    return new JwtHandler(algorithm, privateKey, publicKey);
  }

  // SAFETY: this function should not be used outside of tests, since it makes the service stateful, use setup instead
  public static async setupMockForTesting(algorithm: string): Promise<JwtHandler> {
    const { privateKey, publicKey } = await generateKeyPair(algorithm);
    return new JwtHandler(algorithm, privateKey, publicKey);
  }

  public async createAccessToken({ id, type }: AccessTokenData): Promise<string> {
    const { kid } = await this.getKeyedJWK();
    return await new SignJWT({ [TYPE_KEY]: type })
      .setSubject(id)
      .setProtectedHeader({ alg: this.algorithm, kid })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE_ACCESS)
      .setExpirationTime(EXPIRATION_ACCESS)
      .sign(this.privateKey);
  }

  public async createRefreshToken(accountId: UUID): Promise<string> {
    const { kid } = await this.getKeyedJWK();
    return await new SignJWT()
      .setSubject(accountId)
      .setProtectedHeader({ alg: this.algorithm, kid })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE_REFRESH)
      .setExpirationTime(EXPIRATION_REFRESH)
      .sign(this.privateKey);
  }

  public async verifyRefreshToken(refreshToken: string, accountId: UUID): Promise<boolean> {
    try {
      await jwtVerify(refreshToken, this.publicKey, {
        algorithms: [this.algorithm],
        issuer: ISSUER,
        audience: AUDIENCE_REFRESH,
        subject: accountId,
      });
      return true;
    } catch {
      return false;
    }
  }

  private async getKeyedJWK(): Promise<JWK> {
    const jwk = await exportJWK(this.publicKey);
    const kid = await calculateJwkThumbprint(jwk);
    return { ...jwk, kid };
  }

  public async exportJWKS(): Promise<JSONWebKeySet> {
    return { keys: [await this.getKeyedJWK()] };
  }
}

if (import.meta.main) {
  const { privateKey, publicKey } = await generateKeyPair("ES384", { extractable: true });
  const privateKeyPkcs8 = await exportPKCS8(privateKey);
  const publicKeySpki = await exportSPKI(publicKey);
  console.log(privateKeyPkcs8);
  console.log(publicKeySpki);
}
