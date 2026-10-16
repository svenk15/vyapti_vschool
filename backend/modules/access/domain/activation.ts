import { AccessError,uuidPattern,validPassword } from "./policy";
import type { IssueActivationInput } from "../../../../shared/contracts/activation";
export function normalizeIssue(input:IssueActivationInput,recovery:boolean):IssueActivationInput {
 const membershipIds=Array.isArray(input.membershipIds)?[...new Set(input.membershipIds)].sort():[];
 if(!uuidPattern.test(input.accountId)||membershipIds.length>100||(!recovery&&!membershipIds.length)||membershipIds.some(id=>!uuidPattern.test(id)))throw new AccessError("VALIDATION");
 const caseReference=input.caseReference?.trim(),reason=input.reason?.normalize("NFC").trim();
 if(!caseReference||!/^[A-Za-z0-9_.:-]{1,80}$/.test(caseReference)||!reason||reason.length>500||/[\u0000-\u001f\u007f]/.test(reason))throw new AccessError("VALIDATION");
 return {...input,membershipIds,caseReference,reason};
}
export function validActivation(token:unknown,password:unknown,confirmation:unknown):token is string {
 return typeof token==="string"&&/^[A-Za-z0-9_-]{43}$/.test(token)&&typeof password==="string"&&validPassword(password)&&password===confirmation;
}
export function liveActivation(expiresAt:Date,consumedAt:Date|null,revokedAt:Date|null,now:Date){return expiresAt>now&&!consumedAt&&!revokedAt;}
