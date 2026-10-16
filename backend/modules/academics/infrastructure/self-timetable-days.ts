import type {Prisma} from '../../../../generated/prisma/client';
import {evaluateCalendar} from '../domain/calendar';

type ScopedPlacement=Readonly<{sectionId:string;validFrom:Date;validTo:Date}>;
type ScopedEnrollment=Readonly<{yearId:string;validFrom:Date;validTo:Date;placements:readonly ScopedPlacement[]}>;
type DisplayPeriod=Readonly<{periodKey:string;label:string;kind:'LESSON'|'BREAK';startLocal:string;endLocal:string;position:number}>;
export type DisplayDay=Readonly<{date:string;periods:readonly DisplayPeriod[]}>;

const at=(value:string)=>new Date(`${value}T00:00:00.000Z`);
const date=(value:Date)=>value.toISOString().slice(0,10);
const localTime=(value:Date)=>value.toISOString().slice(11,16);

/** Resolve the effective immutable publication and its pinned calendar per day.
 * This keeps mixed-revision weeks correct, respects scoped calendar exceptions,
 * and exposes configured teaching days without requiring a materialized lesson.
 */
export async function effectiveTimetableDays(tx:Prisma.TransactionClient,scope:{organizationId:string;schoolId:string},weekStart:string,weekEndExclusive:string,enrollments:readonly ScopedEnrollment[]):Promise<readonly DisplayDay[]>{
 const years=[...new Set(enrollments.map(item=>item.yearId))];
 if(!years.length)return [];
 const revisions=await tx.timetableRevision.findMany({
  where:{...scope,academicYearId:{in:years},state:'PUBLISHED',effectiveFrom:{lt:at(weekEndExclusive)},OR:[{effectiveUntil:null},{effectiveUntil:{gt:at(weekStart)}}]},
  orderBy:[{effectiveFrom:'desc'},{revisionNo:'desc'},{id:'desc'}],
  include:{academicYear:{select:{startsOn:true,endsOn:true}},dayPattern:{include:{periods:{orderBy:[{position:'asc'},{id:'asc'}]}}}}
 });
 const calendarIds=[...new Set(revisions.flatMap(item=>item.calendarRevisionId?[item.calendarRevisionId]:[]))];
 const calendars=new Map((await tx.calendarRevision.findMany({
  where:{...scope,id:{in:calendarIds}},
  include:{exceptions:{orderBy:[{onDate:'asc'},{campusId:'asc'},{id:'asc'}]}}
 })).map(item=>[item.id,item]));
 const sectionIds=[...new Set(enrollments.flatMap(item=>item.placements.map(placement=>placement.sectionId)))];
 const campusBySection=new Map((await tx.section.findMany({where:{...scope,id:{in:sectionIds}},select:{id:true,campusId:true}})).map(item=>[item.id,item.campusId]));
 const days:DisplayDay[]=[];
 for(let offset=0;offset<7;offset++){
  const current=new Date(at(weekStart));
  current.setUTCDate(current.getUTCDate()+offset);
  const currentDate=date(current),next=new Date(current);
  next.setUTCDate(next.getUTCDate()+1);
  const enrollment=enrollments.find(item=>item.validFrom<next&&item.validTo>current);
  const placement=enrollment?.placements.find(item=>item.validFrom<next&&item.validTo>current);
  if(!enrollment||!placement)continue;
  const revision=revisions.find(item=>item.academicYearId===enrollment.yearId&&item.effectiveFrom<=current&&(!item.effectiveUntil||item.effectiveUntil>current));
  const isoWeekday=current.getUTCDay()||7;
  if(!revision||!revision.dayPattern.teachingDays.includes(isoWeekday))continue;
  if(revision.calendarRevisionId){
   const calendar=calendars.get(revision.calendarRevisionId);
   if(!calendar)continue;
   const evaluation=evaluateCalendar({
    date:currentDate,
    campusId:campusBySection.get(placement.sectionId)??null,
    year:{startsOn:date(revision.academicYear.startsOn),endsOn:date(revision.academicYear.endsOn)},
    revisionId:calendar.id,
    revisionNumber:calendar.number,
    teachingWeekdays:calendar.teachingWeekdays,
    exceptions:calendar.exceptions.map(item=>({date:date(item.onDate),campusId:item.campusId,isTeachingDay:item.isTeachingDay,label:item.label}))
   });
   if(!evaluation.isTeachingDay)continue;
  }
  days.push({date:currentDate,periods:revision.dayPattern.periods.map(period=>({periodKey:period.periodKey,label:period.label,kind:period.kind as 'LESSON'|'BREAK',startLocal:localTime(period.startLocal),endLocal:localTime(period.endLocal),position:period.position}))});
 }
 return days;
}
