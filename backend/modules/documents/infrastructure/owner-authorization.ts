import type {Identity} from '../../../../shared/contracts/access';
import {AccessError} from '../../access/contracts/index';
import type {DocumentGrantReference,DocumentOwnerAuthorizationPort,DocumentOwnerReference} from '../contracts/index';

export class RoutedDocumentOwnerAuthorization implements DocumentOwnerAuthorizationPort{
 constructor(private readonly owners:Readonly<Record<string,DocumentOwnerAuthorizationPort>>){}
 private resolve(owner:DocumentOwnerReference){const port=this.owners[owner.module];if(!port)throw new AccessError('NOT_FOUND');return port;}
 authorizeUpload(transaction:object,actor:Identity,scope:{organizationId:string;schoolId:string},owner:DocumentOwnerReference){return this.resolve(owner).authorizeUpload(transaction,actor,scope,owner);}
 authorizeLink(transaction:object,actor:Identity,scope:{organizationId:string;schoolId:string},owner:DocumentOwnerReference){return this.resolve(owner).authorizeLink(transaction,actor,scope,owner);}
 authorizeDownload(transaction:object,actor:Identity,scope:{organizationId:string;schoolId:string},grant:DocumentGrantReference){return this.resolve(grant.owner).authorizeDownload(transaction,actor,scope,grant);}
}
