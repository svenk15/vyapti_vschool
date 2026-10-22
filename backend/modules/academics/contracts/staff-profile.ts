import type {Identity} from '../../../../shared/contracts/access';
import type {StaffProfileAcademics} from '../../../../shared/contracts/people';
export interface StaffAcademicsProfilePort { read(actor:Identity,input:{organizationId:string;schoolId:string;employeeId:string}):Promise<StaffProfileAcademics>; }
