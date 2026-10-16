import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {ImportConfirmation,ImportJobPage,ImportJobStatus,ImportOptions,ImportPreview,ImportProcessResult,ImportRowPage} from '../../../../shared/contracts/imports';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {parseRosterCsv,validCivilDate,type ParsedRosterRow} from '../domain/csv';
export type PreviewCommand=Readonly<{yearId:string;campusId:string|null;namespace:string;validFrom:string;schemaVersion:'STUDENT_ROSTER_V1';fileName:string;idempotencyKey:string;sourceBytes:Uint8Array;rows:readonly ParsedRosterRow[]}>;
export interface ImportsRepository{
 authorize(identity:Identity,organizationId:string,schoolId:string):Promise<void>;
 options(identity:Identity,organizationId:string,schoolId:string):Promise<ImportOptions>;
 list(identity:Identity,organizationId:string,schoolId:string,cursor:string|null):Promise<ImportJobPage>;
 preview(identity:Identity,organizationId:string,schoolId:string,command:PreviewCommand):Promise<ImportPreview>;
 rows(identity:Identity,organizationId:string,schoolId:string,jobId:string,cursor:string|null):Promise<ImportRowPage>;
 confirm(identity:Identity,organizationId:string,schoolId:string,input:{jobId:string;expectedVersion:number;previewRevision:number;fileHash:string;skipInvalid:boolean;key:string}):Promise<ImportConfirmation>;
 process(identity:Identity,organizationId:string,schoolId:string,input:{jobId:string;key:string}):Promise<ImportProcessResult>;
 status(identity:Identity,organizationId:string,schoolId:string,jobId:string):Promise<ImportJobStatus>;
 cancel(identity:Identity,organizationId:string,schoolId:string,input:{jobId:string;expectedVersion:number;reason:string;key:string}):Promise<ImportJobStatus>;
 errorsCsv(identity:Identity,organizationId:string,schoolId:string,jobId:string):Promise<string>;
 purgeExpired(operator:OperatorPrincipal):Promise<{sourcesPurged:number;detailsPurged:number}>;
}
function actor(identity:Identity|null):Identity{if(!identity||!uuidPattern.test(identity.accountId)||!Number.isSafeInteger(identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');return identity;}
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
function text(value:unknown,max:number,required=true){if(typeof value!=='string')throw new AccessError('VALIDATION');const result=value.normalize('NFC').trim();if((required&&!result)||result.length>max||/[\u0000-\u001f\u007f]/.test(result))throw new AccessError('VALIDATION');return result;}
function command(input:{yearId:unknown;campusId?:unknown;namespace:unknown;validFrom:unknown;schemaVersion:unknown;fileName:unknown;idempotencyKey:unknown;sourceBytes:Uint8Array}):Omit<PreviewCommand,'rows'>{
 if(input.schemaVersion!=='STUDENT_ROSTER_V1'||!validCivilDate(String(input.validFrom)))throw new AccessError('VALIDATION');
 if(!(input.sourceBytes instanceof Uint8Array))throw new AccessError('VALIDATION');
 if(typeof input.idempotencyKey!=='string'||!/^[A-Za-z0-9_-]{16,100}$/.test(input.idempotencyKey))throw new AccessError('VALIDATION');
 const name=typeof input.fileName==='string'?input.fileName.normalize('NFC').replace(/[\\/]/g,'_').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,255):'';
 return {yearId:id(input.yearId),campusId:input.campusId==null||input.campusId===''?null:id(input.campusId),namespace:text(input.namespace,40),validFrom:String(input.validFrom),schemaVersion:'STUDENT_ROSTER_V1',fileName:name,idempotencyKey:input.idempotencyKey,sourceBytes:input.sourceBytes};
}
export function createImportsUseCases(repository:ImportsRepository){return {
 authorize(identity:Identity|null,organizationId:unknown,schoolId:unknown){return repository.authorize(actor(identity),id(organizationId),id(schoolId));},
 options(identity:Identity|null,organizationId:unknown,schoolId:unknown){return repository.options(actor(identity),id(organizationId),id(schoolId));},
 list(identity:Identity|null,organizationId:unknown,schoolId:unknown,cursor:unknown){if(cursor!==undefined&&cursor!==null&&typeof cursor!=='string')throw new AccessError('INVALID_CURSOR');return repository.list(actor(identity),id(organizationId),id(schoolId),cursor as string|null??null);},
 async preview(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Parameters<typeof command>[0]){const a=actor(identity),org=id(organizationId),school=id(schoolId),checked=command(input),rows=parseRosterCsv(checked.sourceBytes);return repository.preview(a,org,school,{...checked,rows});},
 rows(identity:Identity|null,organizationId:unknown,schoolId:unknown,jobId:unknown,cursor:unknown){if(cursor!==undefined&&cursor!==null&&typeof cursor!=='string')throw new AccessError('INVALID_CURSOR');return repository.rows(actor(identity),id(organizationId),id(schoolId),id(jobId),cursor as string|null??null);},
 confirm(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:{jobId:unknown;expectedVersion:unknown;previewRevision:unknown;fileHash:unknown;skipInvalid:unknown;key:unknown}){if(!Number.isSafeInteger(input.expectedVersion)||!Number.isSafeInteger(input.previewRevision)||typeof input.fileHash!=='string'||!/^[0-9a-f]{64}$/.test(input.fileHash)||typeof input.skipInvalid!=='boolean'||typeof input.key!=='string'||!/^[A-Za-z0-9_-]{16,100}$/.test(input.key))throw new AccessError('VALIDATION');return repository.confirm(actor(identity),id(organizationId),id(schoolId),{jobId:id(input.jobId),expectedVersion:input.expectedVersion as number,previewRevision:input.previewRevision as number,fileHash:input.fileHash,skipInvalid:input.skipInvalid,key:input.key});},
 process(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:{jobId:unknown;key:unknown}){if(typeof input.key!=='string'||!/^[A-Za-z0-9_-]{16,100}$/.test(input.key))throw new AccessError('VALIDATION');return repository.process(actor(identity),id(organizationId),id(schoolId),{jobId:id(input.jobId),key:input.key});},
 status(identity:Identity|null,organizationId:unknown,schoolId:unknown,jobId:unknown){return repository.status(actor(identity),id(organizationId),id(schoolId),id(jobId));},
 cancel(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:{jobId:unknown;expectedVersion:unknown;reason:unknown;key:unknown}){if(!Number.isSafeInteger(input.expectedVersion)||typeof input.reason!=='string'||!input.reason.trim()||input.reason.length>160||/[\u0000-\u001f\u007f]/.test(input.reason)||typeof input.key!=='string'||!/^[A-Za-z0-9_-]{16,100}$/.test(input.key))throw new AccessError('VALIDATION');return repository.cancel(actor(identity),id(organizationId),id(schoolId),{jobId:id(input.jobId),expectedVersion:input.expectedVersion as number,reason:input.reason.normalize('NFC').trim(),key:input.key});},
 errorsCsv(identity:Identity|null,organizationId:unknown,schoolId:unknown,jobId:unknown){return repository.errorsCsv(actor(identity),id(organizationId),id(schoolId),id(jobId));},
 purgeExpired(operator:OperatorPrincipal){if(operator?.verified!==true||!uuidPattern.test(operator.operatorId))throw new AccessError('UNAUTHENTICATED');return repository.purgeExpired(operator);},
};}
export type ImportsFacade=ReturnType<typeof createImportsUseCases>;
