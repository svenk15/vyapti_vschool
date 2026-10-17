import type {Identity} from '../../../../shared/contracts/access';
import type {AttendanceCorrectionRequesterKind} from '../../../../shared/contracts/attendance-correction-requests';
export type VerifiedCorrectionRequester=Readonly<{organizationId:string;schoolId:string;studentId:string}>;
export interface AttendanceCorrectionRequesterPort{verify(transaction:object,actor:Identity,input:{kind:AttendanceCorrectionRequesterKind;studentId:string;sessionId:string}):Promise<VerifiedCorrectionRequester>}
