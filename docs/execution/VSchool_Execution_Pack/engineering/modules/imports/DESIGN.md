# Imports — concrete engineering LLD

## Responsibility and aggregate boundary
Source ingestion, preview, confirmation and row processing. Aggregates/owned records: ImportJob, ImportRow, SourceStudentMap. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Preview is not commit. Pin preview revision/hash; row processing invokes Students owner port in its transaction. Preserve partial outcomes, bounds and private source retention.

## Input facades and cross-owner ports
- `backend/modules/imports/application/imports.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/imports/application/imports.ts

```ts
import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {ImportConfirmation,ImportJobStatus,ImportOptions,ImportPreview,ImportProcessResult,ImportRowPage} from '../../../../shared/contracts/imports';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {parseRosterCsv,validCivilDate,type ParsedRosterRow} from '../domain/csv';
export type PreviewCommand=Readonly<{yearId:string;campusId:string|null;namespace:string;validFrom:string;schemaVersion:'STUDENT_ROSTER_V1';fileName:string;idempotencyKey:string;sourceBytes:Uint8Array;rows:readonly ParsedRosterRow[]}>;
export interface ImportsRepository{
 authorize(identity:Identity,organizationId:string,schoolId:string):Promise<void>;
 options(identity:Identity,organizationId:string,schoolId:string):Promise<ImportOptions>;
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

```

## Output adapters

- `backend/modules/imports/infrastructure/imports.ts`

## Pure domain rules

- `backend/modules/imports/domain/csv.ts`

## Physical data

- `vs_imports_import_job` — Imports-owned job stores immutable source and SHA-256; source bytes expire after 7 days; terminal row details expire after 30 days. Audit excludes source hash/content and row data.; see database/tables/vs_imports_import_job.md
- `vs_imports_import_row` — Normalized bounded row and column-safe preview errors stay in owned ImportRow until terminal retention expiry; status changes in a School-guard transaction.; see database/tables/vs_imports_import_row.md
- `vs_imports_source_student_map` — Stable cross-job source key; no name/email matching.; see database/tables/vs_imports_source_student_map.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/imports/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
