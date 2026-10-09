import type { RoleCode } from "./access";
export type MemberStatus="PENDING"|"ACTIVE"|"SUSPENDED"|"REVOKED";
export type StaffMember={resourceId:string;accountId:string;email:string;accountStatus:string;status:MemberStatus;version:number;roles:RoleCode[]};
export type FailedStaffInvite={invitationId:string;accountId:string;email:string;roles:RoleCode[];deliveryFailedAt:string;deliveryFailureReason:string};
export type CampusDto={resourceId:string;code:string;name:string;status:string;version:number};
export type SchoolSettings={resourceId:string;organizationId:string;schoolCode:string;name:string;timezone:string;status:string;version:number;campuses:CampusDto[]};
export type StaffPage={trustMode:'OPERATOR_CLI'|'HYBRID'|'EMAIL';items:StaffMember[];failedInvitations:FailedStaffInvite[];nextCursor:string|null};
export type ManagementResult={replayed?:boolean;resourceId:string;version:number;status:string;roles?:RoleCode[];schoolCode?:string;name?:string;timezone?:string};
export type ManagementCommand=
 |{kind:"UpdateSchool";payload:{name:string;timezone:string};expectedVersion:number}
 |{kind:"CreateCampus";payload:{code:string;name:string}}
 |{kind:"CreateMembership";payload:{email?:string;targetAccountId?:string;roles:RoleCode[]}}
 |{kind:"UpdateMembership";targetId:string;payload:{action:"SET_ROLES"|"SUSPEND"|"REINSTATE"|"REVOKE";roles?:RoleCode[];reason:string};expectedVersion:number};
