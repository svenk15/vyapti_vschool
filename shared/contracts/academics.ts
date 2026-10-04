export type AcademicYearStatus='DRAFT'|'OPEN'|'CLOSED';
export type AcademicTermRecord=Readonly<{id:string;code:string;name:string;startsOn:string;endsOn:string}>;
export type AcademicYearRecord=Readonly<{id:string;version:number;code:string;name:string;startsOn:string;endsOn:string;status:AcademicYearStatus;terms:readonly AcademicTermRecord[];calendarId:string}>;
export type AcademicReference=Readonly<{id:string;code:string;name:string;active:boolean}>;
export type AcademicSectionRecord=Readonly<{id:string;code:string;name:string;yearId:string;gradeId:string;gradeName:string;campusId:string|null;campusName:string|null;active:boolean}>;
export type AcademicsWorkspace=Readonly<{years:readonly AcademicYearRecord[];grades:readonly AcademicReference[];subjects:readonly AcademicReference[];campuses:readonly AcademicReference[];sections:readonly AcademicSectionRecord[]}>;
export type AcademicCommandResult=Readonly<{id:string;version:number;code:string;name:string;replayed:boolean}>;
