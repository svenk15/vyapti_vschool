import type {Identity} from '../../../../shared/contracts/access';
import type {DocumentUploadResult} from '../../../../shared/contracts/documents';
import {AccessError} from '../../access/contracts/index';
import {documentHash,documentId,documentKey,documentMediaType,documentSize,displayFilename,filenameMatches,type DocumentMediaType} from '../domain/documents';
import type {DocumentOwnerReference} from '../contracts/index';

export type BeginDocumentUpload=Readonly<{organizationId:string;schoolId:string;owner:DocumentOwnerReference;filename:string;declaredMediaType:DocumentMediaType;expectedSize:number;expectedSha256:string;key:string}>;
export interface DocumentsRepository{
 ingest(actor:Identity,input:BeginDocumentUpload,bytes:Uint8Array):Promise<DocumentUploadResult>;
 status(actor:Identity,input:{organizationId:string;schoolId:string;uploadId:string}):Promise<DocumentUploadResult>;
 retryScan(actor:Identity,input:{organizationId:string;schoolId:string;uploadId:string}):Promise<DocumentUploadResult>;
}
export function createDocumentsUseCases(repository:DocumentsRepository){
 const actor=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
 return {
  ingest:(identity:Identity|null,input:Record<string,unknown>,bytes:Uint8Array)=>{const owner=input.owner;if(!owner||typeof owner!=='object'||Array.isArray(owner))throw new AccessError('VALIDATION');const candidate=owner as Record<string,unknown>,filename=displayFilename(input.filename),declaredMediaType=documentMediaType(input.declaredMediaType);if(!filenameMatches(filename,declaredMediaType)||typeof candidate.module!=='string'||typeof candidate.resourceType!=='string'||typeof candidate.purpose!=='string'||candidate.module.length>40||candidate.resourceType.length>80||candidate.purpose.length>80)throw new AccessError('VALIDATION');return repository.ingest(actor(identity),{organizationId:documentId(input.organizationId),schoolId:documentId(input.schoolId),owner:{module:candidate.module,resourceType:candidate.resourceType,resourceId:documentId(candidate.resourceId),purpose:candidate.purpose},filename,declaredMediaType,expectedSize:documentSize(input.expectedSize),expectedSha256:documentHash(input.expectedSha256),key:documentKey(input.key)},bytes);},
  status:(identity:Identity|null,input:Record<string,unknown>)=>repository.status(actor(identity),{organizationId:documentId(input.organizationId),schoolId:documentId(input.schoolId),uploadId:documentId(input.uploadId)}),
  retryScan:(identity:Identity|null,input:Record<string,unknown>)=>repository.retryScan(actor(identity),{organizationId:documentId(input.organizationId),schoolId:documentId(input.schoolId),uploadId:documentId(input.uploadId)}),
 };
}
export type DocumentsFacade=ReturnType<typeof createDocumentsUseCases>;
