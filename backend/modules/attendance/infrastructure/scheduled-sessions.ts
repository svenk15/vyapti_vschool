import type { Prisma } from "../../../../generated/prisma/client";
import type { ScheduledSessionQuery } from "../contracts/scheduled-sessions";
export class PrismaScheduledSessions implements ScheduledSessionQuery {
 constructor(private readonly tx:Prisma.TransactionClient){}
 async hasAny(organizationId:string,schoolId:string){
  const relation=await this.tx.$queryRaw<{present:boolean}[]>`SELECT to_regclass('public.vs_attendance_session') IS NOT NULL AS present`;
  if(!relation[0].present)return false;
  const rows=await this.tx.$queryRaw<{present:boolean}[]>`SELECT EXISTS(SELECT 1 FROM public.vs_attendance_session WHERE organization_id=${organizationId}::uuid AND school_id=${schoolId}::uuid) AS present`;
  return rows[0].present;
 }
 async calendarPublicationAffectsSessions(input:{organizationId:string;schoolId:string;yearId:string;startsOn:string;endsOn:string;teachingWeekdays:readonly number[];exceptions:readonly {date:string;campusId:string|null;isTeachingDay:boolean;label:string}[]}){
  const rows=await this.tx.$queryRaw<{school_date:string;campus_id:string|null}[]>`
   SELECT s.school_date::text, sec.campus_id
   FROM vs_attendance_session s
   JOIN vs_academics_course_offering o ON o.organization_id=s.organization_id AND o.school_id=s.school_id AND o.id=s.offering_id
   JOIN vs_academics_section sec ON sec.organization_id=o.organization_id AND sec.school_id=o.school_id AND sec.id=o.section_id
   WHERE s.organization_id=${input.organizationId}::uuid AND s.school_id=${input.schoolId}::uuid AND o.year_id=${input.yearId}::uuid AND s.school_date >= ${input.startsOn}::date AND s.school_date < ${input.endsOn}::date AND s.status IN ('SCHEDULED','OPEN')`;
  return rows.some(row=>{
   const date=row.school_date,exception=input.exceptions.find(e=>e.date===date&&(e.campusId===null||e.campusId===row.campus_id));
   const weekday=new Date(`${date}T00:00:00.000Z`).getUTCDay()||7;
   const wouldTeach=exception?.isTeachingDay??input.teachingWeekdays.includes(weekday);
   return !wouldTeach;
  });
 }
 async hasPendingSessions(input:{organizationId:string;schoolId:string;yearId:string;onOrAfter:string}){
  const rows=await this.tx.$queryRaw<{present:boolean}[]>`SELECT EXISTS(SELECT 1 FROM vs_attendance_session s JOIN vs_academics_course_offering o ON o.organization_id=s.organization_id AND o.school_id=s.school_id AND o.id=s.offering_id WHERE s.organization_id=${input.organizationId}::uuid AND s.school_id=${input.schoolId}::uuid AND o.year_id=${input.yearId}::uuid AND s.school_date >= ${input.onOrAfter}::date AND s.status IN ('SCHEDULED','OPEN')) AS present`;
  return rows[0]?.present===true;
 }
 async hasFutureAssignmentSessions(input:{organizationId:string;schoolId:string;assignmentId:string;onOrAfter:string}){
  const rows=await this.tx.$queryRaw<{present:boolean}[]>`SELECT EXISTS(SELECT 1 FROM vs_attendance_session s JOIN vs_academics_course_offering o ON o.organization_id=s.organization_id AND o.school_id=s.school_id AND o.id=s.offering_id JOIN vs_academics_teacher_assignment a ON a.organization_id=o.organization_id AND a.school_id=o.school_id AND a.offering_id=o.id WHERE s.organization_id=${input.organizationId}::uuid AND s.school_id=${input.schoolId}::uuid AND a.id=${input.assignmentId}::uuid AND s.school_date >= ${input.onOrAfter}::date AND s.status IN ('SCHEDULED','OPEN')) AS present`;
  return rows[0]?.present===true;
 }
 async hasFrozenSessions(input:{organizationId:string;schoolId:string;sectionIds:readonly string[];fromDate:string;toDate:string}){
  const rows=await this.tx.$queryRaw<{present:boolean}[]>`SELECT EXISTS(SELECT 1 FROM vs_attendance_session s JOIN vs_academics_course_offering o ON o.organization_id=s.organization_id AND o.school_id=s.school_id AND o.id=s.offering_id JOIN vs_academics_section sec ON sec.organization_id=o.organization_id AND sec.school_id=o.school_id AND sec.id=o.section_id WHERE s.organization_id=${input.organizationId}::uuid AND s.school_id=${input.schoolId}::uuid AND sec.id=ANY(${[...input.sectionIds]}::uuid[]) AND s.school_date>=${input.fromDate}::date AND s.school_date<${input.toDate}::date AND s.status IN ('OPEN','SUBMITTED')) AS present`;
  return rows[0]?.present===true;
 }
}
