export type AssessmentAcademicSources=Readonly<{
 years:readonly Readonly<{id:string;code:string;name:string;startsOn:string;endsOn:string;sections:readonly Readonly<{id:string;code:string;name:string;gradeName:string}>[]}>[];
 subjects:readonly Readonly<{id:string;code:string;name:string}>[];
}>;
export interface AssessmentAcademicPlanningPort{
 list(transaction:object,input:{organizationId:string;schoolId:string}):Promise<AssessmentAcademicSources>;
 assertPlan(transaction:object,input:{organizationId:string;schoolId:string;academicYearId:string;sectionId:string;subjectIds:readonly string[];sourceCutoffDate:string}):Promise<void>;
}
