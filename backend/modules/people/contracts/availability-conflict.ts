import type {AvailabilityCollision} from '../../../../shared/contracts/people-availability';
export type AvailabilityConflictTransaction=object;
export interface AvailabilityConflictPort{check(transaction:AvailabilityConflictTransaction,input:Readonly<{organizationId:string;personId:string;startsAt:Date;endsAt:Date}>):Promise<AvailabilityCollision>}
