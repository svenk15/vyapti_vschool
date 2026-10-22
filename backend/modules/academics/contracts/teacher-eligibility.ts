export type TeacherEligibilityTransaction=object;
export type TeacherEligibilityEmployeeFacts=Readonly<{employeeId:string;status:'ACTIVE'|'ENDED';employedFrom:string;employedTo:string|null}>;
export interface TeacherEligibilityEmployeeFactsPort {
 read(transaction:TeacherEligibilityTransaction,input:{organizationId:string;schoolId:string;employeeId:string}):Promise<TeacherEligibilityEmployeeFacts|null>;
}
export interface TeacherEligibilityAttendanceImpactPort {
 frozenAssignmentIds(transaction:TeacherEligibilityTransaction,input:{organizationId:string;schoolId:string;assignmentIds:readonly string[]}):Promise<readonly string[]>;
}
