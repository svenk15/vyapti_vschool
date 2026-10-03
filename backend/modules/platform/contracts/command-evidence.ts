import type { ManagementResult } from "../../../../shared/contracts/access-management";
export type CommandEvidence={organizationId:string;schoolId:string;actorAccountId:string;command:string;key:string;inputHash:string;response:ManagementResult;before:Record<string,unknown>;after:Record<string,unknown>;reason?:string;requestId:string;occurredAt:string;resourceType:string};
export interface CommandEvidenceWriter { append(evidence:CommandEvidence):Promise<void> }
