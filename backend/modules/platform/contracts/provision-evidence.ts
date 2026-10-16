export type ProvisionEvidence = {
  organizationId:string;schoolId:string;accountId:string;operatorId:string;requestId:string;occurredAt:Date;
};
export interface ProvisionEvidenceWriter { appendProvisioned(evidence:ProvisionEvidence):Promise<void> }
