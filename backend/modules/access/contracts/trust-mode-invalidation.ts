export type ProvisioningTrustMode="OPERATOR_CLI"|"HYBRID"|"EMAIL";
export interface TrustModeInvalidationResult { revokedInvites:number; revokedResetTokens:number; affectedAccounts:number; }
/** Access-owned token invalidation enlisted in Tenancy's transaction. The transaction
 * handle is opaque to the application contract and interpreted only by its adapter. */
export interface AccessTrustModeInvalidator<TransactionScope>{
 invalidateForOperatorOnly(input:{transaction:TransactionScope;organizationId:string;configurationVersion:number;requestId:string;occurredAt:Date}):Promise<TrustModeInvalidationResult>;
}
