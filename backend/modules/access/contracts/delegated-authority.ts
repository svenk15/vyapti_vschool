import type {Identity, LeadershipDelegationAction} from '../../../../shared/contracts/access';

export type DelegatedAuthorityTransaction = object;
export type DelegatedAuthorityFact = Readonly<{
  delegationId:string;
  membershipId:string;
  startsAt:Date;
  endsAt:Date;
  actions:readonly LeadershipDelegationAction[];
}>;

/** Access-owned runtime fact. Callers must still enforce their own resource and module rules. */
export interface DelegatedAuthorityPort {
  resolve(
    transaction:DelegatedAuthorityTransaction,
    actor:Identity,
    input:Readonly<{organizationId:string; schoolId:string; requiredAction:LeadershipDelegationAction; at:Date}>,
  ):Promise<DelegatedAuthorityFact|null>;
}
