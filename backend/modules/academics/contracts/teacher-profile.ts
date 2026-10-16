export type TeacherTransaction=object;
export type TeacherProfileInput=Readonly<{organizationId:string;schoolId:string;employeeId:string;actorAccountId:string;occurredAt:string;employmentEndExclusive?:string}>;
export interface TeacherProfilePort {
 enable(transaction:TeacherTransaction,input:TeacherProfileInput):Promise<{teacherId:string;version:number}>;
 disable(transaction:TeacherTransaction,input:TeacherProfileInput&{employmentEndExclusive:string}):Promise<{teacherId:string;version:number}|null>;
}
