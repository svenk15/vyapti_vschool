import type {Identity} from '../../../../shared/contracts/access';
import type {ImportOptions,ImportPreview,ImportRowPage} from '../../../../shared/contracts/imports';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {parseRosterCsv,validCivilDate,type ParsedRosterRow} from '../domain/csv';
export type PreviewCommand=Readonly<{yearId:string;campusId:string|null;namespace:string;validFrom:string;schemaVersion:'STUDENT_ROSTER_V1';fileName:string;idempotencyKey:string;sourceBytes:Uint8Array;rows:readonly ParsedRosterRow[]}>;
export interface ImportsRepository{
 authorize(identity:Identity,organizationId:string,schoolId:string):Promise<void>;
 options(identity:Identity,organizationId:string,schoolId:string):Promise<ImportOptions>;
 preview(identity:Identity,organizationId:string,schoolId:string,command:PreviewCommand):Promise<ImportPreview>;
 rows(identity:Identity,organizationId:string,schoolId:string,jobId:string,cursor:string|null):Promise<ImportRowPage>;
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
 async preview(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Parameters<typeof command>[0]){const a=actor(identity),org=id(organizationId),school=id(schoolId),checked=command(input),rows=parseRosterCsv(checked.sourceBytes);return repository.preview(a,org,school,{...checked,rows});},
 rows(identity:Identity|null,organizationId:unknown,schoolId:unknown,jobId:unknown,cursor:unknown){if(cursor!==undefined&&cursor!==null&&typeof cursor!=='string')throw new AccessError('INVALID_CURSOR');return repository.rows(actor(identity),id(organizationId),id(schoolId),id(jobId),cursor as string|null??null);},
};}
export type ImportsFacade=ReturnType<typeof createImportsUseCases>;
