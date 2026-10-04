import { randomBytes,createHash } from "node:crypto";
import type { ActivationTokens } from "../application/activation";
export class OpaqueActivationTokens implements ActivationTokens {
 generate(){return randomBytes(32).toString("base64url");}
 hash(token:string){return createHash("sha256").update(token).digest("hex");}
}
