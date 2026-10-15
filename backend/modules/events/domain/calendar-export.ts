import type {EventCalendarExport,EventSummary} from '../../../../shared/contracts/events';

const escape=(value:string)=>value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const compactDate=(value:string)=>value.replaceAll('-','');
const compactInstant=(value:string)=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const nextDay=(value:string)=>{const day=new Date(`${value}T00:00:00.000Z`);day.setUTCDate(day.getUTCDate()+1);return day.toISOString().slice(0,10);};
const fold=(line:string)=>{const chunks:string[]=[];let rest=line;while(rest.length>73){chunks.push(rest.slice(0,73));rest=rest.slice(73);}chunks.push(rest);return chunks.join('\r\n ');};
const label:Record<EventSummary['category'],string>={GENERAL:'School event',HOLIDAY:'Holiday',MEETING:'Meeting',CLASS_EVENT:'Class event'};

export function calendarExport(events:readonly EventSummary[],schoolName:string,from:string):EventCalendarExport{
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//VSchool//Permitted school calendar//EN','CALSCALE:GREGORIAN',`X-WR-CALNAME:${escape(schoolName)} permitted calendar`];
 for(const event of events){lines.push('BEGIN:VEVENT',`UID:${event.id}@vschool.local`,`SEQUENCE:${event.version??0}`,`SUMMARY:${escape(event.title)}`,`DESCRIPTION:${escape(`${label[event.category]} · ${event.description}`)}`);if(event.publishedAt)lines.push(`DTSTAMP:${compactInstant(event.publishedAt)}`);if(event.schedule.kind==='ALL_DAY')lines.push(`DTSTART;VALUE=DATE:${compactDate(event.schedule.startsOn)}`,`DTEND;VALUE=DATE:${compactDate(nextDay(event.schedule.endsOn))}`);else lines.push(`DTSTART:${compactInstant(event.schedule.startsAt)}`,`DTEND:${compactInstant(event.schedule.endsAt)}`);if(event.status==='CANCELED')lines.push('STATUS:CANCELLED');lines.push('END:VEVENT');}
 lines.push('END:VCALENDAR');
 return {filename:`school-calendar-${from}.ics`,body:`${lines.map(fold).join('\r\n')}\r\n`};
}
