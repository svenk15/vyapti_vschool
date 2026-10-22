import type {Prisma} from '../../../../generated/prisma/client';
import type {TeacherEligibilityAttendanceImpactPort,TeacherEligibilityTransaction} from '../../academics/contracts/teacher-eligibility';
export class PrismaTeacherEligibilityAttendanceImpact implements TeacherEligibilityAttendanceImpactPort {
 async frozenAssignmentIds(transaction:TeacherEligibilityTransaction,input:{organizationId:string;schoolId:string;assignmentIds:readonly string[]}){
  if(input.assignmentIds.length===0)return [];
  const tx=transaction as Prisma.TransactionClient,rows=await tx.$queryRaw<{assignment_id:string}[]>`
   SELECT DISTINCT a.id AS assignment_id
   FROM vs_academics_teacher_assignment a
   JOIN vs_attendance_session s
     ON s.organization_id=a.organization_id AND s.school_id=a.school_id AND s.offering_id=a.offering_id
    AND s.school_date>=a.valid_from AND s.school_date<a.valid_to
   WHERE a.organization_id=${input.organizationId}::uuid AND a.school_id=${input.schoolId}::uuid
     AND a.id=ANY(${[...input.assignmentIds]}::uuid[]) AND s.status IN ('OPEN','SUBMITTED')`;
  return rows.map(row=>row.assignment_id);
 }
}
