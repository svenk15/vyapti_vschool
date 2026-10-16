import {AccessError} from '../../access/contracts/index';
import type {SaveTimetablePattern,TimetablePeriodKind} from '../../../../shared/contracts/timetable';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,time=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
const minutes=(value:string)=>Number(value.slice(0,2))*60+Number(value.slice(3));
function text(value:unknown,max:number){if(typeof value!=='string')throw new AccessError('VALIDATION');const result=value.normalize('NFC').trim();if(!result||result.length>max||/[\u0000-\u001f]/.test(result))throw new AccessError('VALIDATION');return result;}
export function validateTimetablePattern(input:SaveTimetablePattern):SaveTimetablePattern{
 if(!uuid.test(input.academicYearId)||!Number.isSafeInteger(input.expectedVersion)||input.expectedVersion<0||!Array.isArray(input.teachingDays)||input.teachingDays.length<1||input.teachingDays.length>7||!Array.isArray(input.periods)||input.periods.length<1||input.periods.length>32)throw new AccessError('VALIDATION');
 const teachingDays=[...new Set(input.teachingDays)];if(teachingDays.length!==input.teachingDays.length||teachingDays.some(day=>!Number.isSafeInteger(day)||day<1||day>7))throw new AccessError('VALIDATION');teachingDays.sort((a,b)=>a-b);
 const periods=input.periods.map((period,index)=>{if(!uuid.test(period.periodKey)||!['LESSON','BREAK'].includes(period.kind)||!time.test(period.startLocal)||!time.test(period.endLocal)||minutes(period.startLocal)>=minutes(period.endLocal)||!Number.isSafeInteger(period.position)||period.position!==index+1)throw new AccessError('VALIDATION');return {...period,label:text(period.label,60),kind:period.kind as TimetablePeriodKind};});
 if(!periods.some(period=>period.kind==='LESSON'))throw new AccessError('VALIDATION');
 const keys=new Set(periods.map(period=>period.periodKey));if(keys.size!==periods.length)throw new AccessError('VALIDATION');
 const ordered=[...periods].sort((a,b)=>minutes(a.startLocal)-minutes(b.startLocal));for(let i=1;i<ordered.length;i++)if(minutes(ordered[i].startLocal)<minutes(ordered[i-1].endLocal))throw new AccessError('PERIOD_OVERLAP');
 return {...input,name:text(input.name,80),reason:text(input.reason,500),teachingDays,periods};
}
