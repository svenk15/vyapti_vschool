export type AssessmentMarkAuthority=Readonly<{offeringId:string;teacherAssignmentId:string;teacherId:string}>;
export interface AssessmentMarkAuthorityPort{
 resolve(transaction:object,input:{organizationId:string;schoolId:string;accountId:string;academicYearId:string;sectionId:string;subjectId:string;schoolDate:string}):Promise<AssessmentMarkAuthority|null>;
}
