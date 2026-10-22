import type { Identity } from "../../../../shared/contracts/access";
import type { ManagementCommand,ManagementResult,SchoolSettings,StaffAccessCommand,StaffAccessCommandStatus,StaffPage } from "../../../../shared/contracts/access-management";
import { AccessError,uuidPattern } from "../domain/policy";
import { normalizeCommand,requireCommandKey } from "../domain/management";
export interface ManagementRepository {
 settings(identity:Identity,schoolId?:string):Promise<SchoolSettings>;
 members(identity:Identity,schoolId?:string,cursor?:string):Promise<StaffPage>;
 execute(identity:Identity,command:ManagementCommand,key:string,schoolId?:string):Promise<ManagementResult>;
 status(identity:Identity,command:StaffAccessCommand,key:string,schoolId?:string):Promise<StaffAccessCommandStatus>;
}
export interface ManagementFacade {
 getSettings(identity:Identity|null,schoolId?:string):Promise<SchoolSettings>;
 listMembers(identity:Identity|null,schoolId?:string,cursor?:string):Promise<StaffPage>;
 command(identity:Identity|null,kind:ManagementCommand["kind"],body:unknown,key:string,schoolId?:string,targetId?:string):Promise<ManagementResult>;
 status(identity:Identity|null,command:StaffAccessCommand,key:string,schoolId?:string):Promise<StaffAccessCommandStatus>;
}
function authenticated(identity:Identity|null,schoolId?:string):asserts identity is Identity {if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");if(schoolId&&!uuidPattern.test(schoolId))throw new AccessError("NOT_FOUND");}
export function createManagementUseCases(repository:ManagementRepository):ManagementFacade{return {
 getSettings(identity,schoolId){authenticated(identity,schoolId);return repository.settings(identity,schoolId);},
 listMembers(identity,schoolId,cursor){authenticated(identity,schoolId);if(cursor&&cursor.length>1024)throw new AccessError("INVALID_CURSOR");return repository.members(identity,schoolId,cursor);},
 command(identity,kind,body,key,schoolId,targetId){authenticated(identity,schoolId);requireCommandKey(key);return repository.execute(identity,normalizeCommand(kind,body,targetId),key,schoolId);},
 status(identity,command,key,schoolId){authenticated(identity,schoolId);requireCommandKey(key);if(command!=="CreateMembership"&&command!=="UpdateMembership")throw new AccessError("VALIDATION");return repository.status(identity,command,key,schoolId);},
};}
