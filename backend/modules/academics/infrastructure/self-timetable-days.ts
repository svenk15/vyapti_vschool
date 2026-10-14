import type {Prisma} from '../../../../generated/prisma/client';

type ScopedEnrollment=Readonly<{yearId:string;validFrom:Date;validTo:Date;placements:readonly {validFrom:Date;validTo:Date}[]}>;
type DisplayPeriod=Readonly<{periodKey:string;label:string;kind:'LESSON'|'BREAK';startLocal:string;endLocal:string;position:number}>;
export type DisplayDay=Readonly<{date:string;periods:readonly DisplayPeriod[]}>;

const at=(value:string)=>new Date(`${value}T00:00:00.000Z`);
const date=(value:Date)=>value.toISOString().slice(0,10);
const localTime=(value:Date)=>value.toISOString().slice(11,16);

/** Resolve the effective immutable publication independently for every local day.
 * This keeps mixed-revision weeks correct and exposes configured teaching days
 * even when a particular day has no materialized lesson occurrence.
 */
export async function effectiveTimetableDays(tx:Prisma.TransactionClient,scope:{organizationId:string;schoolId:string},weekStart:string,weekEndExclusive:string,enrollments:readonly ScopedEnrollment[]):Promise<readonly DisplayDay[]>{
 const years=[...new Set(enrollments.map(item=>item.yearId))];if(!years.length)return [];
 const revisions=await tx.timetableRevision.findMany({where:{...scope,academicYearId:{in:years},state:'PUBLISHED',effectiveFrom:{lt:at(weekEndExclusive)},OR:[{effectiveUntil:null},{effectiveUntil:{gt:at(weekStart)}}]},orderBy:[{effectiveFrom:'desc'},{revisionNo:'desc'},{id:'desc'}],include:{dayPattern:{include:{periods:{orderBy:[{position:'asc'},{id:'asc'}]}}}}});
 const days:DisplayDay[]=[];
 for(let offset=0;offset<7;offset++){const current=new Date(at(weekStart));current.setUTCDate(current.getUTCDate()+offset);const currentDate=date(current),next=new Date(current);next.setUTCDate(next.getUTCDate()+1);const enrollment=enrollments.find(item=>item.validFrom<next&&item.validTo>current&&item.placements.some(placement=>placement.validFrom<next&&placement.validTo>current));if(!enrollment)continue;const revision=revisions.find(item=>item.academicYearId===enrollment.yearId&&item.effectiveFrom<=current&&(!item.effectiveUntil||item.effectiveUntil>current));if(!revision||!revision.dayPattern.teachingDays.includes(current.getUTCDay()))continue;days.push({date:currentDate,periods:revision.dayPattern.periods.map(period=>({periodKey:period.periodKey,label:period.label,kind:period.kind as 'LESSON'|'BREAK',startLocal:localTime(period.startLocal),endLocal:localTime(period.endLocal),position:period.position}))});}
 return days;
}
