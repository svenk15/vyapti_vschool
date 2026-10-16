export type TeacherSessionReadinessTransaction=object;
export interface TeacherSessionReadinessPort{
 hasCurrentSession(transaction:TeacherSessionReadinessTransaction,input:{organizationId:string;schoolId:string;offeringIds:readonly string[];schoolDate:string}):Promise<boolean>;
}
