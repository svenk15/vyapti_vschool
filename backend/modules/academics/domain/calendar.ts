import {AccessError} from '../../access/contracts/index';
import {civilDate,identifier,name} from './setup';

export type CalendarExceptionInput={date:string;campusId:string|null;isTeachingDay:boolean;label:string};
export type CalendarEvaluation={date:string;campusId:string|null;isTeachingDay:boolean;source:'CAMPUS_EXCEPTION'|'SCHOOL_EXCEPTION'|'WEEKLY_RULE';revisionId:string;revisionNumber:number;label:string|null};
export function weekdays(raw:unknown):number[]{
 if(!Array.isArray(raw)||raw.length<1||raw.length>7||raw.some(x=>!Number.isInteger(x)||Number(x)<1||Number(x)>7)||new Set(raw).size!==raw.length)throw new AccessError('VALIDATION');
 return [...raw as number[]].sort((a,b)=>a-b);
}
export function calendarExceptions(raw:unknown,year:{startsOn:string;endsOn:string}):CalendarExceptionInput[]{
 if(!Array.isArray(raw)||raw.length>500)throw new AccessError('VALIDATION');
 const rows=raw.map(value=>{
  if(!value||typeof value!=='object')throw new AccessError('VALIDATION');const row=value as Record<string,unknown>,date=civilDate(row.date);
  if(date<year.startsOn||date>=year.endsOn||typeof row.isTeachingDay!=='boolean')throw new AccessError('VALIDATION');
  return {date,campusId:row.campusId==null?null:identifier(row.campusId),isTeachingDay:row.isTeachingDay,label:name(row.label)};
 });
 const keys=rows.map(row=>`${row.date}:${row.campusId??'school'}`);if(new Set(keys).size!==keys.length)throw new AccessError('CONFLICT');return rows;
}
export function evaluateCalendar(input:{date:unknown;campusId:unknown;year:{startsOn:string;endsOn:string};revisionId:string;revisionNumber:number;teachingWeekdays:readonly number[];exceptions:readonly CalendarExceptionInput[]}):CalendarEvaluation{
 const date=civilDate(input.date),campusId=input.campusId==null?null:identifier(input.campusId);
 if(date<input.year.startsOn||date>=input.year.endsOn)throw new AccessError('VALIDATION');
 const chosen=(campusId===null?undefined:input.exceptions.find(row=>row.date===date&&row.campusId===campusId))??input.exceptions.find(row=>row.date===date&&row.campusId===null);
 if(chosen)return {date,campusId,isTeachingDay:chosen.isTeachingDay,source:chosen.campusId?'CAMPUS_EXCEPTION':'SCHOOL_EXCEPTION',revisionId:input.revisionId,revisionNumber:input.revisionNumber,label:chosen.label};
 const weekday=new Date(`${date}T00:00:00.000Z`).getUTCDay()||7;
 return {date,campusId,isTeachingDay:input.teachingWeekdays.includes(weekday),source:'WEEKLY_RULE',revisionId:input.revisionId,revisionNumber:input.revisionNumber,label:null};
}
export function schoolCivilDate(now:Date,timezone:string):string{
 let parts:Record<string,string>;try{parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));}catch{throw new AccessError('UNAVAILABLE');}
 return `${parts.year}-${parts.month}-${parts.day}`;
}
