import { randomUUID } from "node:crypto";
import { hash, compare } from "bcryptjs";
import type { Passwords } from "../contracts";
export class BcryptPasswords implements Passwords {
 private readonly dummy=hash(randomUUID()+randomUUID(),12);
 hash(value:string) {return hash(value,12);}
 async verify(value:string,passwordHash:string|null) { const actual=passwordHash??await this.dummy;const matches=await compare(value,actual);return !!passwordHash&&matches; }
}
