import type {Identity} from '../../../../shared/contracts/access';
export type TimetableCoverTransaction=object;
export interface AttendanceCoverPort { assertActivatable(transaction:TimetableCoverTransaction,actor:Identity,input:Readonly<{organizationId:string;schoolId:string;occurrenceId:string}>):Promise<{sessionId:string|null}>; }
export interface EffectiveOccurrenceTeacherPort { teacherForOccurrence(transaction:TimetableCoverTransaction,input:Readonly<{organizationId:string;schoolId:string;occurrenceId:string}>):Promise<string|null>; }
