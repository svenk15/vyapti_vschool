import type {Identity} from '../../../../shared/contracts/access';
import type {AssistantSource} from '../../../../shared/contracts/assistant';

export interface AssistantSourcePort {
 list(actor:Identity,organizationId:string,schoolId:string):Promise<readonly AssistantSource[]>;
 get(actor:Identity,organizationId:string,schoolId:string,id:string):Promise<AssistantSource>;
}
