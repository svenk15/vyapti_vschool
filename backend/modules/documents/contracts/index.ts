import type {Identity} from '../../../../shared/contracts/access';
import type {DocumentMediaType,ScanVerdict} from '../domain/documents';

export type DocumentOwnerReference=Readonly<{module:string;resourceType:string;resourceId:string;purpose:string}>;
export type StoredDocumentObject=Readonly<{storageKey:string;bytes:Uint8Array;size:number;sha256:string;detectedMediaType:DocumentMediaType|null}>;
export type ScanEvidence=Readonly<{verdict:ScanVerdict;engine:string;engineVersion:string;definitionsVersion:string|null;errorCode:string|null}>;
export interface ObjectStoragePort{
 putQuarantined(storageKey:string,bytes:Uint8Array):Promise<void>;
 inspect(storageKey:string):Promise<StoredDocumentObject>;
 openPrivate(storageKey:string):Promise<Uint8Array>;
}
export interface MalwareScanPort{scan(input:{storageKey:string;sha256:string;bytes:Uint8Array}):Promise<ScanEvidence>;}
export interface DocumentOwnerAuthorizationPort{authorizeUpload(transaction:object,actor:Identity,scope:{organizationId:string;schoolId:string},owner:DocumentOwnerReference):Promise<void>;}
