import type { Prisma } from '../../../../generated/prisma/client';
import type { VerifiedBranchContextInput,VerifiedDatabaseContextPort,VerifiedStaffInviteContext } from '../contracts/verified-database-context';

export type VerifiedBranchDatabaseContext=Readonly<{
 accountId:string;
 organizationId:string;
 branchId:string;
}>;

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Call at the start of a branch transaction; the fixed database helper confirms current membership before setting scope. */
export async function setVerifiedBranchDatabaseContext(tx:Prisma.TransactionClient,context:VerifiedBranchDatabaseContext,tokenVersion:number):Promise<boolean>{
 if(!UUID.test(context.accountId)||!UUID.test(context.organizationId)||!UUID.test(context.branchId))throw new Error('Invalid verified tenant database context');
 if(!Number.isSafeInteger(tokenVersion)||tokenVersion<0)throw new Error('Invalid verified tenant database context');
 const result=await tx.$queryRaw<{verified:boolean}[]>`SELECT public.vs_set_verified_branch_context(${context.accountId}::uuid,${tokenVersion},${context.organizationId}::uuid,${context.branchId}::uuid) AS verified`;
 return result[0]?.verified===true;
}

export async function setVerifiedAccountDatabaseContext(tx:Prisma.TransactionClient,accountId:string,tokenVersion:number):Promise<boolean>{
 if(!UUID.test(accountId)||!Number.isSafeInteger(tokenVersion)||tokenVersion<0)throw new Error('Invalid verified account database context');
 const result=await tx.$queryRaw<{verified:boolean}[]>`SELECT public.vs_set_verified_account_context(${accountId}::uuid,${tokenVersion}) AS verified`;
 return result[0]?.verified===true;
}

export class PrismaVerifiedDatabaseContext implements VerifiedDatabaseContextPort{
 establish(transaction:object,context:VerifiedBranchContextInput){return setVerifiedBranchDatabaseContext(transaction as Prisma.TransactionClient,context,context.tokenVersion);}
 establishAccount(transaction:object,accountId:string,tokenVersion:number){return setVerifiedAccountDatabaseContext(transaction as Prisma.TransactionClient,accountId,tokenVersion);}
 async findAccountByEmail(transaction:object,normalizedEmail:string):Promise<string|null>{
  if(normalizedEmail.length<3||normalizedEmail.length>320||normalizedEmail!==normalizedEmail.trim().toLowerCase())throw new Error('Invalid normalized account email');
  const result=await (transaction as Prisma.TransactionClient).$queryRaw<{account_id:string|null}[]>`SELECT public.vs_find_account_context_by_email(${normalizedEmail}) AS account_id`;
  return result[0]?.account_id??null;
 }
 async findAccountForPasswordReset(transaction:object,tokenHash:string):Promise<string|null>{
  if(!/^[0-9a-f]{64}$/.test(tokenHash))return null;
  const result=await (transaction as Prisma.TransactionClient).$queryRaw<{account_id:string|null}[]>`SELECT public.vs_set_password_reset_context(${tokenHash}) AS account_id`;
  return result[0]?.account_id??null;
 }
 async findStaffInviteByToken(transaction:object,tokenHash:string):Promise<VerifiedStaffInviteContext|null>{
  if(!/^[0-9a-f]{64}$/.test(tokenHash))return null;
  const result=await (transaction as Prisma.TransactionClient).$queryRaw<VerifiedStaffInviteContext[]>`SELECT invite_id AS "inviteId",account_id AS "accountId",inviter_account_id AS "inviterAccountId",organization_id AS "organizationId",school_id AS "schoolId" FROM public.vs_set_staff_invite_context_by_token(${tokenHash})`;
  return result[0]??null;
 }
 async findStaffInviteById(transaction:object,inviteId:string):Promise<VerifiedStaffInviteContext|null>{
  if(!UUID.test(inviteId))return null;
  const result=await (transaction as Prisma.TransactionClient).$queryRaw<VerifiedStaffInviteContext[]>`SELECT invite_id AS "inviteId",account_id AS "accountId",inviter_account_id AS "inviterAccountId",organization_id AS "organizationId",school_id AS "schoolId" FROM public.vs_set_staff_invite_context_by_id(${inviteId}::uuid)`;
  return result[0]??null;
 }
}
