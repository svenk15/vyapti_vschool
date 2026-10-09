export type BindingTransaction = object;
export type VerifiedPersonBindingInput = Readonly<{
 organizationId:string; schoolId:string; accountId:string; personId:string;
 verifiedBy:string; verificationReference:string; occurredAt:string; requestId:string;
}>;
export interface VerifiedPersonBindingPort {
 bind(transaction:BindingTransaction,input:VerifiedPersonBindingInput):Promise<{bindingId:string}>;
}
