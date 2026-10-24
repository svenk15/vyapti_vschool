export type StudentAttendanceRosterEntry=Readonly<{studentId:string;studentVersion:number;enrollmentVersion:number;displayName:string;rollNumber:string|null}>;
export interface StudentAttendanceRosterPort {
  identifiersForFrozenRoster(transaction:object,actor:{accountId:string;tokenVersion:number},organizationId:string,schoolId:string,studentIds:readonly string[]):Promise<readonly {studentId:string;admissionNumber:string}[]>;
  listForSession(transaction:object,actor:{accountId:string;tokenVersion:number},organizationId:string,schoolId:string,sectionId:string,schoolDate:string):Promise<readonly StudentAttendanceRosterEntry[]>;
}
