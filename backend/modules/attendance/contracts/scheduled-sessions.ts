export interface ScheduledSessionQuery {
 hasAny(organizationId:string,schoolId:string):Promise<boolean>;
 calendarPublicationAffectsSessions?(input:{organizationId:string;schoolId:string;yearId:string;startsOn:string;endsOn:string;teachingWeekdays:readonly number[];exceptions:readonly {date:string;campusId:string|null;isTeachingDay:boolean;label:string}[]}):Promise<boolean>;
 hasPendingSessions?(input:{organizationId:string;schoolId:string;yearId:string;onOrAfter:string}):Promise<boolean>;
 hasFutureAssignmentSessions?(input:{organizationId:string;schoolId:string;assignmentId:string;onOrAfter:string}):Promise<boolean>;
}
