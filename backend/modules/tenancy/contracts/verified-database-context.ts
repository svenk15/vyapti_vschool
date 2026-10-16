export type VerifiedBranchContextInput=Readonly<{
 accountId:string;
 tokenVersion:number;
 organizationId:string;
 branchId:string;
}>;
export type VerifiedStaffInviteContext=Readonly<{inviteId:string;accountId:string;inviterAccountId:string;organizationId:string;schoolId:string}>;

export interface VerifiedDatabaseContextPort {
 establish(transaction:object,context:VerifiedBranchContextInput):Promise<boolean>;
 establishAccount(transaction:object,accountId:string,tokenVersion:number):Promise<boolean>;
 findAccountByEmail(transaction:object,normalizedEmail:string):Promise<string|null>;
 findAccountForPasswordReset(transaction:object,tokenHash:string):Promise<string|null>;
 findStaffInviteByToken(transaction:object,tokenHash:string):Promise<VerifiedStaffInviteContext|null>;
 findStaffInviteById(transaction:object,inviteId:string):Promise<VerifiedStaffInviteContext|null>;
}
