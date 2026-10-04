export type ActivationResult = {activated:true};
export type IssueActivationInput = {accountId:string;membershipIds:string[];caseReference:string;reason:string};
export type IssuedActivation = {activationId:string;accountId:string;token:string;expiresAt:string};
