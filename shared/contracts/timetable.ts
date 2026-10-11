export type TimetablePeriodKind='LESSON'|'BREAK';
export type TimetablePeriod=Readonly<{id:string;periodKey:string;label:string;kind:TimetablePeriodKind;startLocal:string;endLocal:string;position:number}>;
export type TimetableDayPattern=Readonly<{id:string;academicYearId:string;name:string;teachingDays:readonly number[];state:'DRAFT'|'PUBLISHED';version:number;periods:readonly TimetablePeriod[]}>;
export type TimetablePatternContext=Readonly<{years:readonly {id:string;code:string;name:string;status:'DRAFT'|'OPEN'}[];pattern:TimetableDayPattern|null;timezone:string}>;
export type SaveTimetablePattern=Readonly<{academicYearId:string;expectedVersion:number;name:string;teachingDays:readonly number[];periods:readonly {periodKey:string;label:string;kind:TimetablePeriodKind;startLocal:string;endLocal:string;position:number}[];key:string;reason:string}>;
export type TimetablePatternResult=TimetableDayPattern&Readonly<{replayed:boolean}>;
