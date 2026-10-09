# People — concrete engineering LLD

## Responsibility and aggregate boundary
Institution person and branch employment. Aggregates/owned records: Person, Employee. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Person is institution scoped; employment is branch scoped. Verified account binding is Access-owned. Never collapse contact email and identity.

## Input facades and cross-owner ports
- `backend/modules/people/application/employees.ts`
- `backend/modules/people/application/person-identity.ts`
- `backend/modules/people/contracts/index.ts`
- `backend/modules/people/contracts/person-identity.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/people/application/employees.ts

```ts
import type {Identity} from '../../../../shared/contracts/access';
import type {EmployeeProfile,PeopleWorkspace} from '../../../../shared/contracts/people';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {employeeInput,type EmployeeInput} from '../domain/employee';

export interface PeopleRepository {
 listEmployees(actor:Identity,organizationId:string,schoolId:string,query:{search:string;cursor:string|null;limit:number}):Promise<PeopleWorkspace>;
 createEmployee(actor:Identity,organizationId:string,schoolId:string,input:EmployeeInput&{key:string}):Promise<EmployeeProfile&{replayed:boolean}>;
 enableTeacher(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:{expectedVersion:number;key:string}):Promise<EmployeeProfile&{replayed:boolean}>;
 bindAccount(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:{accountId:string;verificationReference:string;reason:string;key:string}):Promise<EmployeeProfile&{replayed:boolean}>;
 endEmployment(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:{expectedVersion:number;effectiveDate:string;reason:string;key:string}):Promise<EmployeeProfile&{replayed:boolean}>;
}
export type PeopleFacade=ReturnType<typeof createPeopleUseCases>;
function currentActor(value:Identity|null):Identity{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function identifier(value:unknown):string{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
function reason(value:unknown):string{if(typeof value!=='string')throw new AccessError('VALIDATION');const normalized=value.normalize('NFC').trim();if(normalized.length<5||normalized.length>500||/[\u0000-\u001f\u007f]/.test(normalized))throw new AccessError('VALIDATION');return normalized;}
function version(value:unknown):number{if(!Number.isSafeInteger(value)||Number(value)<1)throw new AccessError('VALIDATION');return Number(value);}
function scope(actorValue:Identity|null,organization:unknown,school:unknown){return {actor:currentActor(actorValue),organizationId:identifier(organization),schoolId:identifier(school)};}
function listQuery(raw:{search?:unknown;cursor?:unknown;limit?:unknown}){if(raw.search!==undefined&&typeof raw.search!=='string')throw new AccessError('VALIDATION');const search=typeof raw.search==='string'?raw.search.normalize('NFC').trim():'';if(search.length>100||/[\u0000-\u001f]/.test(search))throw new AccessError('VALIDATION');const limit=raw.limit===undefined?50:Number(raw.limit);if(!Number.isInteger(limit)||limit<1||limit>100)throw new AccessError('VALIDATION');const cursor=raw.cursor==null||raw.cursor===''?null:raw.cursor;if(cursor!==null&&(typeof cursor!=='string'||cursor.length>2048))throw new AccessError('INVALID_CURSOR');return {search,cursor:cursor as string|null,limit};}
export function createPeopleUseCases(repository:PeopleRepository){return {
 workspace(identity:Identity|null,organization:unknown,school:unknown,query:{search?:unknown;cursor?:unknown;limit?:unknown}={}){const s=scope(identity,organization,school);return repository.listEmployees(s.actor,s.organizationId,s.schoolId,listQuery(query));},
 createEmployee(identity:Identity|null,organization:unknown,school:unknown,input:{firstName:unknown;lastName?:unknown;contactEmail?:unknown;staffNumber:unknown;employedFrom:unknown;key:unknown}){const s=scope(identity,organization,school),normalized=employeeInput(input),key=identifier(input.key);return repository.createEmployee(s.actor,s.organizationId,s.schoolId,{...normalized,key});},
 enableTeacher(identity:Identity|null,organization:unknown,school:unknown,employee:unknown,input:{expectedVersion:unknown;key:unknown}){const s=scope(identity,organization,school);return repository.enableTeacher(s.actor,s.organizationId,s.schoolId,identifier(employee),{expectedVersion:version(input.expectedVersion),key:identifier(input.key)});},
 bindAccount(identity:Identity|null,organization:unknown,school:unknown,employee:unknown,input:{accountId:unknown;verificationReference:unknown;reason:unknown;key:unknown}){const s=scope(identity,organization,school);if(typeof input.verificationReference!=='string')throw new AccessError('VALIDATION');const verificationReference=input.verificationReference.normalize('NFC').trim();if(verificationReference.length<3||verificationReference.length>80||/[\u0000-\u001f\u007f]/.test(verificationReference))throw new AccessError('VALIDATION');return repository.bindAccount(s.actor,s.organizationId,s.schoolId,identifier(employee),{accountId:identifier(input.accountId),verificationReference,reason:reason(input.reason),key:identifier(input.key)});},
 endEmployment(identity:Identity|null,organization:unknown,school:unknown,employee:unknown,input:{expectedVersion:unknown;effectiveDate:unknown;reason:unknown;key:unknown}){const s=scope(identity,organization,school);if(typeof input.effectiveDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.effectiveDate)||!Number.isFinite(Date.parse(`${input.effectiveDate}T00:00:00Z`)))throw new AccessError('VALIDATION');return repository.endEmployment(s.actor,s.organizationId,s.schoolId,identifier(employee),{expectedVersion:version(input.expectedVersion),effectiveDate:input.effectiveDate,reason:reason(input.reason),key:identifier(input.key)});},
};}

```

### backend/modules/people/application/person-identity.ts

```ts
import { AccessError, uuidPattern } from "../../access/contracts/index";
import type { PersonIdentityPort, PersonIdentityRepository, PersonTransaction } from "../contracts/person-identity";
import { exactPersonName, personIdentityInput } from "../domain/person-identity";

export function createPersonIdentityUseCases(repository: PersonIdentityRepository): PersonIdentityPort {
  return {
    create(transaction: PersonTransaction, input: { organizationId: unknown; firstName: unknown; lastName?: unknown }) {
      if (!transaction || typeof transaction !== "object") throw new AccessError("UNAVAILABLE");
      return repository.create(transaction, personIdentityInput(input));
    },
    findById(transaction: PersonTransaction, organizationId: unknown, personId: unknown) {
      if (!transaction || typeof transaction !== "object" || typeof organizationId !== "string" || !uuidPattern.test(organizationId) || typeof personId !== "string" || !uuidPattern.test(personId)) throw new AccessError("VALIDATION");
      return repository.findById(transaction, organizationId.toLowerCase(), personId.toLowerCase());
    },
    findExactName(transaction: PersonTransaction, organizationId: unknown, value: unknown) {
      if (!transaction || typeof transaction !== "object" || typeof organizationId !== "string" || !uuidPattern.test(organizationId)) throw new AccessError("VALIDATION");
      return repository.findExactName(transaction, organizationId.toLowerCase(), exactPersonName(value));
    },
  };
}

```

### backend/modules/people/contracts/index.ts

```ts
export type {EmployeeProfile,PeopleWorkspace} from '../../../../shared/contracts/people';
export type {PeopleRepository,PeopleFacade} from '../application/employees';

```

### backend/modules/people/contracts/person-identity.ts

```ts
export type PersonTransaction = object;
export type PersonIdentity = Readonly<{ id: string; firstName: string; lastName: string }>;
export type PersonIdentityInput = Readonly<{ organizationId: string; firstName: string; lastName: string }>;

export interface PersonIdentityPort {
  create(transaction: PersonTransaction, input: { organizationId: unknown; firstName: unknown; lastName?: unknown }): Promise<PersonIdentity>;
  findById(transaction: PersonTransaction, organizationId: unknown, personId: unknown): Promise<PersonIdentity | null>;
  findExactName(transaction: PersonTransaction, organizationId: unknown, exactName: unknown): Promise<readonly PersonIdentity[]>;
}

export interface PersonIdentityRepository {
  create(transaction: PersonTransaction, input: PersonIdentityInput): Promise<PersonIdentity>;
  findById(transaction: PersonTransaction, organizationId: string, personId: string): Promise<PersonIdentity | null>;
  findExactName(transaction: PersonTransaction, organizationId: string, exactName: string): Promise<readonly PersonIdentity[]>;
}

```

## Output adapters

- `backend/modules/people/infrastructure/employees.ts`
- `backend/modules/people/infrastructure/person-identity.ts`

## Pure domain rules

- `backend/modules/people/domain/employee.ts`
- `backend/modules/people/domain/person-identity.ts`

## Physical data

- `vs_people_person` — Canonical name/contact; email contact is not verified login ownership. Minimal pilot PII, no health/document fields.; see database/tables/vs_people_person.md
- `vs_people_employee` — School institutional profile; links rather than duplicates identity.; see database/tables/vs_people_employee.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/people/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
