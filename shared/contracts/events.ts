export type EventStatus='DRAFT'|'PUBLISHED'|'CANCELED';
export type EventScheduleKind='ALL_DAY'|'TIMED';
export type EventAudienceKind='BRANCH'|'SECTION';
export type EventSchedule=Readonly<{kind:'ALL_DAY';startsOn:string;endsOn:string}|{kind:'TIMED';startsAt:string;endsAt:string}>;
export type EventAudience=Readonly<{kind:'BRANCH';sectionId:null;label:string}|{kind:'SECTION';sectionId:string;label:string}>;
export type EventSummary=Readonly<{id:string;status:EventStatus;revision:number;version:number|null;title:string;description:string;schedule:EventSchedule;audience:EventAudience;publishedAt:string|null;canceledAt:string|null;recipientCount:number}>;
export type EventDetail=EventSummary&Readonly<{schoolName:string;timezone:string}>;
export type EventCommandResult=Readonly<{eventId:string;status:EventStatus;revision:number;version:number|null;recipientCount:number;replayed:boolean}>;
