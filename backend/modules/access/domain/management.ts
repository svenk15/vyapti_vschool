import type { ManagementCommand,MemberStatus } from "../../../../shared/contracts/access-management";
import type { RoleCode } from "../../../../shared/contracts/access";
import { AccessError,normalizeEmail,uuidPattern } from "./policy";
function text(value:unknown,max:number){if(typeof value!=="string")throw new AccessError("VALIDATION");const result=value.normalize("NFC").trim();if(!result||result.length>max||/[\u0000-\u001f\u007f]/.test(result))throw new AccessError("VALIDATION");return result;}
function roles(value:unknown):RoleCode[]{if(!Array.isArray(value)||!value.length||value.length>2||value.some(r=>r!=="SCHOOL_ADMIN"&&r!=="TEACHER"))throw new AccessError("VALIDATION");return [...new Set(value)].sort();}
function optionalText(value:unknown,max:number){if(value==null||value==="")return "";return text(value,max);}
export function normalizeCommand(kind:ManagementCommand["kind"],body:unknown,targetId?:string):ManagementCommand {
 if(!body||typeof body!=="object"||!("payload" in body)||!body.payload||typeof body.payload!=="object")throw new AccessError("VALIDATION");
 const p=body.payload as Record<string,unknown>,version="expectedVersion" in body?body.expectedVersion:undefined;
 if((kind==="UpdateSchool"||kind==="PublishSchoolSupport"||kind==="UpdateMembership")&&(!Number.isInteger(version)||Number(version)<1))throw new AccessError("VALIDATION");
 if(kind==="UpdateSchool"){const timezone=text(p.timezone,64),officeEmail=text(p.officeEmail,254).toLowerCase(),officePhone=optionalText(p.officePhone,40),officeAddress=text(p.officeAddress,500),reason=text(p.reason,500);try{new Intl.DateTimeFormat("en",{timeZone:timezone});}catch{throw new AccessError("VALIDATION");}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(officeEmail)||officePhone&&!/^[0-9+().\-\s]{5,40}$/.test(officePhone))throw new AccessError("VALIDATION");return {kind,payload:{name:text(p.name,160),timezone,officeEmail,officePhone,officeAddress,reason},expectedVersion:Number(version)};}
 if(kind==="PublishSchoolSupport"){const email=optionalText(p.email,254).toLowerCase(),phone=optionalText(p.phone,40);if(!email&&!phone||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone&&!/^[0-9+().\-\s]{5,40}$/.test(phone))throw new AccessError("VALIDATION");return {kind,payload:{label:text(p.label,160),email,phone,hours:text(p.hours,500),reason:text(p.reason,500)},expectedVersion:Number(version)};}
 if(kind==="CreateCampus")return {kind,payload:{code:text(p.code,40),name:text(p.name,160)}};
 if(kind==="CreateMembership"){
  if(Boolean(p.email)===Boolean(p.targetAccountId))throw new AccessError("VALIDATION");
  if(p.targetAccountId){if(typeof p.targetAccountId!=="string"||!uuidPattern.test(p.targetAccountId))throw new AccessError("VALIDATION");return {kind,payload:{targetAccountId:p.targetAccountId,roles:roles(p.roles)}};}
  const email=normalizeEmail(text(p.email,254));if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new AccessError("VALIDATION");return {kind,payload:{email,roles:roles(p.roles)}};
 }
 if(!targetId||!uuidPattern.test(targetId)||!["SET_ROLES","SUSPEND","REINSTATE","REVOKE"].includes(String(p.action)))throw new AccessError("VALIDATION");
 return {kind,targetId,payload:{action:p.action as "SET_ROLES"|"SUSPEND"|"REINSTATE"|"REVOKE",reason:text(p.reason,500),...(p.action==="SET_ROLES"?{roles:roles(p.roles)}:{})},expectedVersion:Number(version)};
}
export function nextMembershipStatus(action:string,accountStatus:string,current:MemberStatus):MemberStatus{return action==="SUSPEND"?"SUSPENDED":action==="REVOKE"?"REVOKED":action==="REINSTATE"?accountStatus==="ACTIVE"?"ACTIVE":"PENDING":current;}
export function guardLastAdmin(activeAdminCount:number,wasAdmin:boolean,willBeAdmin:boolean){if(wasAdmin&&!willBeAdmin&&activeAdminCount<=1)throw new AccessError("LAST_ADMIN");}
export function requireCommandKey(key:string){if(!/^[A-Za-z0-9_-]{16,100}$/.test(key))throw new AccessError("VALIDATION");}
