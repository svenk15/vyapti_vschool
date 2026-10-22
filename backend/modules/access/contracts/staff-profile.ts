import type {Identity} from '../../../../shared/contracts/access';
import type {StaffProfileAccess} from '../../../../shared/contracts/people';
export interface StaffAccessProfilePort { read(actor:Identity,input:{organizationId:string;schoolId:string;personId:string}):Promise<StaffProfileAccess>; }
