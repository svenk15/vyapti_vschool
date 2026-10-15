import type {Identity} from '../../../../shared/contracts/access';
import type {StudentPortalPurpose} from '../../../../shared/contracts/student-portal';
export interface StudentSelfAccessVerifier{verify(transaction:object,identity:Identity,input:{studentId:string;purpose:StudentPortalPurpose;moduleId:'student_core'|'attendance'|'timetable'|'communication'|'homework'}):Promise<{accessId:string;organizationId:string;schoolId:string;studentId:string;timezone:string;enrollmentFrom:string;enrollmentUntil:string}>}
