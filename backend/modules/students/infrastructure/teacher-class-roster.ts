import type {Prisma} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherRosterStudent} from '../../../../shared/contracts/teacher-classes';
import {AccessError} from '../../access/contracts/index';
import type {TeacherClassRosterPort} from '../../academics/contracts/teacher-class-roster';

export class PrismaTeacherClassRoster implements TeacherClassRosterPort{
 async list(transaction:object,_actor:Identity,input:{organizationId:string;schoolId:string;sectionId:string;schoolDate:string}):Promise<readonly TeacherRosterStudent[]>{
  if(!transaction||typeof transaction!=='object')throw new AccessError('UNAVAILABLE');
  const tx=transaction as Prisma.TransactionClient;
  const rows=await tx.$queryRaw<TeacherRosterStudent[]>`SELECT st.id::text AS "studentId", btrim(concat_ws(' ',p.first_name,p.last_name)) AS "displayName", st.admission_number AS "schoolReference", pl.roll_number AS "rollNumber"
    FROM vs_students_section_placement pl
    JOIN vs_students_enrollment e ON e.organization_id=pl.organization_id AND e.school_id=pl.school_id AND e.id=pl.enrollment_id AND e.year_id=pl.year_id
    JOIN vs_students_student st ON st.organization_id=e.organization_id AND st.school_id=e.school_id AND st.id=e.student_id
    JOIN vs_people_person p ON p.organization_id=st.organization_id AND p.id=st.person_id
    WHERE pl.organization_id=${input.organizationId}::uuid AND pl.school_id=${input.schoolId}::uuid AND pl.section_id=${input.sectionId}::uuid
      AND pl.valid_from<=${input.schoolDate}::date AND pl.valid_to>${input.schoolDate}::date
      AND e.valid_from<=${input.schoolDate}::date AND e.valid_to>${input.schoolDate}::date AND st.status='ACTIVE'
    ORDER BY lower(p.first_name),lower(coalesce(p.last_name,'')),st.id LIMIT 201`;
  if(rows.length>200)throw new AccessError('ROSTER_TOO_LARGE');
  return rows;
 }
}
