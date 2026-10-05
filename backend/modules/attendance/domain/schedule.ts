import {AccessError} from '../../access/contracts/index';

export function schoolDate(value:Date,timezone:string):string {
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(value).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
 return `${parts.year}-${parts.month}-${parts.day}`;
}
export function validateSchedule(input:{schoolDate:string;startsAt:string;endsAt:string;timezone:string;today:string}) {
 const date=input.schoolDate;
 const dateValue=new Date(`${date}T00:00:00Z`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(dateValue.getTime())||dateValue.toISOString().slice(0,10)!==date)throw new AccessError('VALIDATION');
 const starts=new Date(input.startsAt),ends=new Date(input.endsAt);
 if(!Number.isFinite(starts.getTime())||!Number.isFinite(ends.getTime())||!/(?:[zZ]|[+-]\d{2}:\d{2})$/.test(input.startsAt)||!/(?:[zZ]|[+-]\d{2}:\d{2})$/.test(input.endsAt)||ends<=starts)throw new AccessError('VALIDATION');
 if(schoolDate(starts,input.timezone)!==date||schoolDate(new Date(ends.getTime()-1),input.timezone)!==date)throw new AccessError('VALIDATION');
 if(date<input.today)throw new AccessError('VALIDATION');
 return {schoolDate:date,startsAt:starts,endsAt:ends};
}
