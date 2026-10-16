import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianPurpose} from '../../../../shared/contracts/guardians';
import type {ModuleId} from '../../../../shared/contracts/modules';
export type VerifiedGuardianChildAccess=Readonly<{accessId:string;organizationId:string;schoolId:string;studentId:string;accessFrom:string;timezone:string}>;
export interface GuardianChildAccessVerifier{verify(transaction:object,identity:Identity,input:{studentId:string;purpose:GuardianPurpose;moduleId:ModuleId}):Promise<VerifiedGuardianChildAccess>}
