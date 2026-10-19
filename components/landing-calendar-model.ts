export type LandingCalendarRange=Readonly<{from:string;to:string;complete:boolean}>;

export const addCivilDays=(value:string,days:number)=>{const date=new Date(`${value}T12:00:00.000Z`);date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10);};

export function calendarWeek(value:string){const date=new Date(`${value}T12:00:00.000Z`),weekday=date.getUTCDay()||7,from=addCivilDays(value,-(weekday-1));return {from,to:addCivilDays(from,6)};}

export function civilDateInTimezone(value:string,timezone:string){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value)),read=(type:string)=>parts.find(part=>part.type===type)?.value??'';return `${read('year')}-${read('month')}-${read('day')}`;}

export function calendarEntryRange(schedule:{kind:'ALL_DAY';startsOn:string;endsOn:string}|{kind:'TIMED';startsAt:string;endsAt:string},timezone:string){return schedule.kind==='ALL_DAY'?{startsOn:schedule.startsOn,endsOn:schedule.endsOn}:{startsOn:civilDateInTimezone(schedule.startsAt,timezone),endsOn:civilDateInTimezone(schedule.endsAt,timezone)};}

export const isCalendarDateComplete=(selected:string,range:LandingCalendarRange)=>range.complete&&selected>=range.from&&selected<=range.to;
