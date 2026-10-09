export type AccessSecurityEvidence={organizationId:string;schoolId:string;accountId:string;operatorId?:string;caseReference?:string;reason?:string;command:"ActivationIssued"|"RecoveryRequested"|"AccountActivated";version:number;requestId:string;occurredAt:Date};
export interface AccessSecurityEvidenceWriter {append(evidence:AccessSecurityEvidence):Promise<void>}
