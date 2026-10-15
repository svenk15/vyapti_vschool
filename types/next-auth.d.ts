import type { Identity } from "../shared/contracts/access";
declare module "next-auth" {
 interface Session { identity:Identity|null }
 interface User extends Identity { sessionId:string }
}
declare module "next-auth/jwt" {
 interface JWT { accountId?:string; tokenVersion?:number; sessionId?:string }
}
