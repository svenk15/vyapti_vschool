import 'server-only';
import {join} from 'node:path';
import {AccessError} from '../../backend/modules/access/contracts/index';
import {createDocumentsServices} from '../../backend/composition/documents';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';

type Services=ReturnType<typeof createDocumentsServices>;let services:Services|undefined;
try{if(process.env.VSCHOOL_DOCUMENTS_MODE==='synthetic')services=createDocumentsServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),localStorageRoot:process.env.VSCHOOL_DOCUMENTS_STORAGE_ROOT??join(process.cwd(),'artifacts/documents-private'),clamAvExecutable:process.env.VSCHOOL_CLAMAV_EXECUTABLE??null,clamAvDatabaseDirectory:process.env.VSCHOOL_CLAMAV_DATABASE_DIRECTORY??null,maxDefinitionsAgeMs:Number(process.env.VSCHOOL_CLAMAV_MAX_SIGNATURE_AGE_MS??24*60*60*1000)});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;},required=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
async function scope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const documentsGateway={
 async ingest(identity:Identity|null,input:Record<string,unknown>,bytes:Uint8Array){const {actor,organizationId,schoolId}=await scope(identity);return service().ingest(actor,{...input,organizationId,schoolId},bytes);},
 async status(identity:Identity|null,uploadId:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().status(actor,{organizationId,schoolId,uploadId});},
 async retryScan(identity:Identity|null,uploadId:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().retryScan(actor,{organizationId,schoolId,uploadId});},
 async promote(identity:Identity|null,uploadId:unknown,input:Record<string,unknown>,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().promote(actor,{...input,organizationId,schoolId,uploadId},requestId);},
 async open(identity:Identity|null,versionId:unknown,grantId:unknown){return service().open(required(identity),{versionId,grantId});},
 async revokeGrant(identity:Identity|null,grantId:unknown,input:Record<string,unknown>,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().revokeGrant(actor,{...input,organizationId,schoolId,grantId},requestId);},
};
