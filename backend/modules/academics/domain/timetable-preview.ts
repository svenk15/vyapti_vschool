import type {TimetableDraftPreview,TimetablePreviewIssue} from '../../../../shared/contracts/timetable';
import {evaluateCalendar,type CalendarExceptionInput} from './calendar';

export type PreviewSlot=Readonly<{slotKey:string;sectionId:string;sectionLabel:string;campusId:string|null;teacherPersonId:string;teacherName:string;dayOfWeek:number;periodKey:string;periodLabel:string;startLocal:string;endLocal:string;assignmentValidFrom:string;assignmentValidTo:string}>;
export type PreviewInput=Readonly<{draftId:string;draftVersion:number;effectiveFrom:string;yearEndsOn:string;slots:readonly PreviewSlot[];calendar:null|{revisionId:string;revisionNumber:number;teachingWeekdays:readonly number[];exceptions:readonly CalendarExceptionInput[]};protectedAttendanceSessions:number}>;
const day=(value:string)=>new Date(`${value}T00:00:00.000Z`);
const text=(value:Date)=>value.toISOString().slice(0,10);
const overlaps=(a:PreviewSlot,b:PreviewSlot)=>a.startLocal<b.endLocal&&b.startLocal<a.endLocal;
const unique=(values:readonly string[])=>[...new Set(values)].sort();

export function previewTimetable(input:PreviewInput):Omit<TimetableDraftPreview,'previewHash'>{
 const limit=day(input.effectiveFrom);limit.setUTCDate(limit.getUTCDate()+42);const horizonUntil=[text(limit),input.yearEndsOn].sort()[0]!;
 const issues:TimetablePreviewIssue[]=[];
 if(!input.calendar)issues.push({code:'CALENDAR_UNAVAILABLE',message:'Publish the academic calendar before reviewing this timetable.',slotKeys:[],sectionLabels:[],dayOfWeek:null,periodLabels:[]});
 const occurrences=new Map<string,string[]>();let candidateOccurrences=0;
 if(input.calendar){for(const slot of input.slots){const dates:string[]=[];for(let cursor=day(input.effectiveFrom);text(cursor)<horizonUntil;cursor.setUTCDate(cursor.getUTCDate()+1)){const date=text(cursor),weekday=cursor.getUTCDay()||7;if(weekday!==slot.dayOfWeek)continue;const result=evaluateCalendar({date,campusId:slot.campusId,year:{startsOn:input.effectiveFrom,endsOn:horizonUntil},revisionId:input.calendar.revisionId,revisionNumber:input.calendar.revisionNumber,teachingWeekdays:input.calendar.teachingWeekdays,exceptions:input.calendar.exceptions.filter(row=>row.date>=input.effectiveFrom&&row.date<horizonUntil)});if(result.isTeachingDay)dates.push(date);}occurrences.set(slot.slotKey,dates);candidateOccurrences+=dates.length;if(dates.some(date=>date<slot.assignmentValidFrom||date>=slot.assignmentValidTo))issues.push({code:'ASSIGNMENT_INELIGIBLE',message:`${slot.teacherName} is not assigned for every generated ${slot.sectionLabel} lesson.`,slotKeys:[slot.slotKey],sectionLabels:[slot.sectionLabel],dayOfWeek:slot.dayOfWeek,periodLabels:[slot.periodLabel]});}}
 for(let i=0;i<input.slots.length;i++)for(let j=i+1;j<input.slots.length;j++){const a=input.slots[i]!,b=input.slots[j]!;if(a.dayOfWeek!==b.dayOfWeek||!overlaps(a,b))continue;if(a.sectionId===b.sectionId)issues.push({code:'CLASS_CONFLICT',message:`${a.sectionLabel} has overlapping lesson times.`,slotKeys:unique([a.slotKey,b.slotKey]),sectionLabels:[a.sectionLabel],dayOfWeek:a.dayOfWeek,periodLabels:unique([a.periodLabel,b.periodLabel])});if(a.teacherPersonId===b.teacherPersonId)issues.push({code:'TEACHER_CONFLICT',message:`${a.teacherName} is assigned to overlapping classes.`,slotKeys:unique([a.slotKey,b.slotKey]),sectionLabels:unique([a.sectionLabel,b.sectionLabel]),dayOfWeek:a.dayOfWeek,periodLabels:unique([a.periodLabel,b.periodLabel])});}
 issues.sort((a,b)=>a.code.localeCompare(b.code)||a.slotKeys.join(':').localeCompare(b.slotKeys.join(':')));
 const counts={draftSlots:input.slots.length,candidateOccurrences,addedSlots:input.slots.length,changedSlots:0,removedSlots:0,protectedAttendanceSessions:input.protectedAttendanceSessions},base={draftId:input.draftId,draftVersion:input.draftVersion,effectiveFrom:input.effectiveFrom,horizonUntil,ready:issues.length===0,issues,counts,roomValidation:'NOT_APPLICABLE' as const};
 return base;
}
