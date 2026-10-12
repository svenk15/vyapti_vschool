import type {Identity} from '../../../../shared/contracts/access';
import type {TimetableConflictSession,TimetableReconciliationOutcome} from '../../../../shared/contracts/timetable';

export type AttendancePlannedOccurrence=Readonly<{occurrenceId:string;organizationId:string;schoolId:string;academicYearId:string;sectionId:string;offeringId:string;teacherAssignmentId:string;calendarRevisionId:string;schoolDate:string;startsAt:string;endsAt:string}>;
export type AttendancePlanningResult=Readonly<{outcome:TimetableReconciliationOutcome;sessionId:string|null;existingSession:TimetableConflictSession|null;errorCode:string|null}>;
export interface AttendanceTimetablePlanningPort {
 authorize(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string}):Promise<void>;
 reconcile(transaction:object,actor:Identity,input:AttendancePlannedOccurrence):Promise<AttendancePlanningResult>;
 cancelRemoved(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;occurrenceId:string;reason:string}):Promise<'CANCELLED'|'ALREADY_CANCELLED'|'BLOCKED'>;
}
