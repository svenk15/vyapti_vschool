import type { BranchInput,InstitutionCommand } from '../../../../shared/contracts/tenancy';
import { AccessError,uuidPattern } from './policy';
export function identifier(value:unknown):string {if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
function text(value:unknown,min:number,max:number):string {if(typeof value!=='string')throw new AccessError('VALIDATION');const t=value.normalize('NFC').trim();if(t.length<min||t.length>max||/[\u0000-\u001f]/.test(t))throw new AccessError('VALIDATION');return t;}
function revision(value:unknown){if(!Number.isSafeInteger(value)||Number(value)<0||Number(value)>2147483646)throw new AccessError('VALIDATION');return Number(value);}
export function branchInput(raw:unknown):BranchInput {
 if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const b=raw as Record<string,unknown>,code=text(b.code,1,40).toUpperCase(),timezone=text(b.timezone,1,64);
 if(!/^[A-Z0-9_-]+$/.test(code))throw new AccessError('VALIDATION');try{new Intl.DateTimeFormat('en',{timeZone:timezone});}catch{throw new AccessError('VALIDATION');}
 const expectedRevision=revision(b.expectedRevision);if(!expectedRevision)throw new AccessError('VALIDATION');return {code,name:text(b.name,1,160),timezone,expectedRevision,key:identifier(b.key),reason:text(b.reason,5,500)};
}
export function institutionCommand(raw:InstitutionCommand):InstitutionCommand {
 if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const common={organizationId:identifier(raw.organizationId),accountId:identifier(raw.accountId),key:identifier(raw.key),reason:text(raw.reason,5,500)};
 if(raw.kind==='CreateInstitution')return {kind:raw.kind,...common,name:text(raw.name,1,160)};
 if(raw.status!=='ACTIVE'&&raw.status!=='REVOKED')throw new AccessError('VALIDATION');const expectedVersion=revision(raw.expectedVersion);
 if(raw.kind==='SetInstitutionGrant')return {kind:raw.kind,...common,status:raw.status,expectedVersion};
 if(raw.kind!=='SetBranchMembership'||!Array.isArray(raw.roles)||raw.roles.length<1||raw.roles.length>3||raw.roles.some(r=>!['SCHOOL_ADMIN','TEACHER','PRINCIPAL'].includes(r)))throw new AccessError('VALIDATION');
 return {kind:raw.kind,...common,status:raw.status,expectedVersion,schoolId:identifier(raw.schoolId),roles:[...new Set(raw.roles)].sort()};
}
