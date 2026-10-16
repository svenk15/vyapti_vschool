import type {PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianAttendanceHistory,GuardianAttendanceItem} from '../../../../shared/contracts/guardians';
import type {GuardianChildAccessVerifier} from '../../guardians/contracts/access-verification';
import type {GuardianAttendancePort} from '../contracts/guardian-history';
const day=(value:Date)=>value.toISOString().slice(0,10);
export class PrismaGuardianAttendanceHistory implements GuardianAttendancePort{
 constructor(private readonly db:PrismaClient,private readonly verifier:GuardianChildAccessVerifier){}
 history(identity:Identity,studentId:string,from:string,until:string):Promise<GuardianAttendanceHistory>{return this.db.$transaction(async tx=>{const access=await this.verifier.verify(tx,identity,{studentId,purpose:'attendance.read_child',moduleId:'attendance'}),start=[from,access.accessFrom].sort().at(-1)!;const rows=await tx.attendanceSession.findMany({where:{organizationId:access.organizationId,schoolId:access.schoolId,schoolDate:{gte:new Date(`${start}T00:00:00.000Z`),lte:new Date(`${until}T00:00:00.000Z`)},status:{in:['SUBMITTED','CANCELLED']},submittedAt:{not:null},rosterEntries:{some:{studentId}}},orderBy:[{schoolDate:'desc'},{startsAt:'desc'},{id:'desc'}],take:200,include:{offering:{include:{subject:{select:{name:true}},section:{select:{name:true}}}},attendanceRecords:{where:{studentId},take:1}}});const items:GuardianAttendanceItem[]=rows.flatMap(row=>{const record=row.attendanceRecords[0];return record?[{sessionId:row.id,date:day(row.schoolDate),startsAt:row.startsAt.toISOString(),subjectName:row.offering.subject.name,sectionName:row.offering.section.name,status:record.status as GuardianAttendanceItem['status'],lateMinutes:record.lateMinutes,sessionState:row.status as 'SUBMITTED'|'CANCELLED'}]:[];});return {studentId,timezone:access.timezone,from:start,until,items};},{isolationLevel:'RepeatableRead'});}
}
