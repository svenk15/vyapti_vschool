export type AssessmentCohortCandidate=Readonly<{studentId:string;enrollmentId:string;placementId:string;yearId:string}>;
export type AssessmentCohortPupil=Readonly<{studentId:string;displayName:string;admissionNumber:string}>;
export interface AssessmentCohortPort{
 listAtCutoff(transaction:object,input:{organizationId:string;schoolId:string;academicYearId:string;sectionId:string;cutoffDate:string}):Promise<readonly AssessmentCohortCandidate[]>;
 describe(transaction:object,input:{organizationId:string;schoolId:string;studentIds:readonly string[]}):Promise<readonly AssessmentCohortPupil[]>;
}
