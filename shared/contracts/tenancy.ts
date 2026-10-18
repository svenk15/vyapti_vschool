import type { AdminHome,RoleCode } from './access';
import type {ThemeId} from './branding';
export type BranchSummary={id:string;code:string;name:string;timezone:string;selectable:boolean;roles:RoleCode[];delegatedLeadership?:boolean};
export type InstitutionSummary={id:string;name:string;revision:number;canManage:boolean;branches:BranchSummary[]};
export type ContextDirectory={institutions:InstitutionSummary[]};
export type BranchInput={code:string;name:string;timezone:string;themeId?:ThemeId|null;expectedRevision:number;key:string;reason:string};
export type InstitutionCommand=
 | {kind:'CreateInstitution';organizationId:string;accountId:string;name:string;themeId?:ThemeId;key:string;reason:string}
 | {kind:'SetInstitutionGrant';organizationId:string;accountId:string;status:'ACTIVE'|'REVOKED';expectedVersion:number;key:string;reason:string}
 | {kind:'SetBranchMembership';organizationId:string;schoolId:string;accountId:string;status:'ACTIVE'|'REVOKED';roles:RoleCode[];expectedVersion:number;key:string;reason:string};
export type InstitutionResult={organizationId:string;resourceId:string;version:number;revision:number;replayed:boolean};
export type SwitchedContext=AdminHome;
