import type { InstitutionResult } from '../../../../shared/contracts/tenancy';
export type InstitutionEvidence={organizationId:string;schoolId?:string;actorAccountId:string;command:string;key:string;inputHash:string;response:InstitutionResult;expectedRevision:number;newRevision:number;reason:string;requestId:string;occurredAt:string;changes:{schemaVersion:1;principalKind:'OPERATOR'|'ACCOUNT';operatorId?:string;resourceId:string;version:number;status?:string;roles?:string[]}};
export interface InstitutionEvidenceWriter {append(input:InstitutionEvidence):Promise<void>}
