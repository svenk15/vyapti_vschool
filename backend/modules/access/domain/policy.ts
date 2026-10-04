import type { ProvisionInput, RoleCode } from "../../../../shared/contracts/access";
export class AccessError extends Error {
  constructor(public readonly code: "VALIDATION" | "PROVISION_CONFLICT" | "UNAUTHENTICATED" | "NOT_FOUND" | "UNAVAILABLE" | "FORBIDDEN" | "CONFLICT" | "STALE_VERSION" | "LAST_ADMIN" | "TIMEZONE_IN_USE" | "IDEMPOTENCY_CONFLICT" | "INVALID_CURSOR" | "INVALID_ACTIVATION" | "MODULE_NOT_LICENSED" | "RELEASE_UNAVAILABLE" | "DEPENDENCY_DISABLED" | "PREVIEW_STALE" | "MODULE_DISABLED" | "CALENDAR_REQUIRED" | "CALENDAR_IN_USE" | "SOURCE_EXPIRED") { super(code); }
}
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function normalizeEmail(value: string): string { return value.trim().toLowerCase(); }
export function validPassword(value: string): boolean {
  // Count UTF-8 bytes without importing a hosting environment into the domain.
  const bytes = [...value].reduce((n,c) => { const p=c.codePointAt(0)!; return n+(p<=0x7f?1:p<=0x7ff?2:p<=0xffff?3:4); },0);
  return value.length >= 12 && bytes <= 72;
}
export function normalizeProvision(input: ProvisionInput): ProvisionInput {
  const text=(value:string,max:number) => { const result=value.normalize("NFC").trim(); if(!result||result.length>max||/[\u0000-\u001f]/.test(result))throw new AccessError("VALIDATION");return result; };
  const result={...input,organizationName:text(input.organizationName,160),schoolName:text(input.schoolName,160),schoolCode:text(input.schoolCode,40),adminEmail:normalizeEmail(input.adminEmail)};
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.adminEmail)||result.adminEmail.length>254||!validPassword(result.password)||result.timezone.length>64)throw new AccessError("VALIDATION");
  try { new Intl.DateTimeFormat("en",{timeZone:result.timezone}); } catch { throw new AccessError("VALIDATION"); }
  return result;
}
const admin=["school.manage","user.manage","module.configure","branding.manage","class.manage","class.read","student.manage","student.read","attendance.read_class","attendance.read_school","attendance.correct","attendance.export","self.read"];
const teacher=["class.read","student.read","attendance.mark","attendance.read_class","self.read"];
export function capabilitiesFor(roles: readonly RoleCode[]): readonly string[] { return [...new Set(roles.flatMap(r=>r==="SCHOOL_ADMIN"?admin:r==="TEACHER"?teacher:[]))]; }
export function currentIdentity(account:{status:string;tokenVersion:number}|null,tokenVersion:number):boolean { return !!account&&account.status==="ACTIVE"&&account.tokenVersion===tokenVersion; }
export function nextFailure(failedAttempts:number,lockedUntil:Date|null,now:Date) {
 const count=(lockedUntil&&lockedUntil<=now?0:failedAttempts)+1;
 return {failedAttempts:count,lockedUntil:count>=5?new Date(now.getTime()+15*60*1000):null};
}
