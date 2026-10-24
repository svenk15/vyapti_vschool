import type {AttendanceSessionRecord} from '@/shared/contracts/attendance';
export function validDay(value:string):boolean {return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
export function shiftDay(value:string,days:number){if(!validDay(value))throw new Error('Invalid calendar date');const date=new Date(value+'T00:00:00Z');date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10);}
export function shortDay(value:string){return new Date(value+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});}
export function registerState(row:AttendanceSessionRecord,asOf:string){return row.status==='SCHEDULED'?(row.startsAt<=asOf?'Not started':'Upcoming'):row.status==='OPEN'?'Open':row.status==='SUBMITTED'?'Submitted':'Cancelled';}
export function registerSummary(rows:readonly AttendanceSessionRecord[],asOf:string){const due=rows.filter(r=>r.status!=='CANCELLED'&&r.startsAt<=asOf),submitted=due.filter(r=>r.status==='SUBMITTED').length;return {due:due.length,submitted,missing:due.length-submitted,upcoming:rows.filter(r=>r.status==='SCHEDULED'&&r.startsAt>asOf).length};}
export function safeAttendanceReturn(value:string|undefined){if(!value||!value.startsWith('/admin/'))return '/admin/attendance/sessions?view=monitor';try{const u=new URL(value,'https://vschool.invalid');return u.origin==='https://vschool.invalid'&&['/admin/attendance/sessions','/admin/reports/attendance','/admin/attendance/requests'].includes(u.pathname)?u.pathname+u.search:'/admin/attendance/sessions?view=monitor';}catch{return '/admin/attendance/sessions?view=monitor';}}
/** Serialize a school-local wall time without using the browser's timezone. */
export function schoolTimeInstant(day:string,time:string,timezone:string){
 if(!validDay(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new Error('Enter a valid date and time.');
 const target=Date.parse(`${day}T${time}:00Z`),format=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const parts=(stamp:number)=>Object.fromEntries(format.formatToParts(new Date(stamp)).map(p=>[p.type,p.value]));
 const matches=new Set<number>();for(let hours=-36;hours<=36;hours+=6){const sample=target+hours*3600000,p=parts(sample),offset=Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`)-sample,candidate=target-offset,c=parts(candidate);if(`${c.year}-${c.month}-${c.day}`===day&&`${c.hour}:${c.minute}`===time)matches.add(candidate);}
 if(matches.size!==1)throw new Error(matches.size?'This time occurs twice in the school timezone. Choose an unambiguous time.':'This time does not exist in the school timezone. Choose another time.');return new Date([...matches][0]).toISOString();
}
