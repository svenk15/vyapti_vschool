# Branding — concrete engineering LLD

## Responsibility and aggregate boundary
Versioned school brand and published public entry. Aggregates/owned records: BrandProfile, BrandRevision, BrandAsset, VerifiedBrandHost. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Public slug/host identifies branding, not access. Draft changes never leak as published values. Use controlled tokens/assets, no arbitrary client CSS.

## Input facades and cross-owner ports
- `backend/modules/branding/application/brands.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/branding/application/brands.ts

```ts
import type {Identity} from '../../../../shared/contracts/access';
import type {BrandFields,BrandingCommandResult,BrandingWorkspace,PublicBrandRecord} from '../../../../shared/contracts/branding-management';
import type {BrandPalette} from '../../../../shared/contracts/branding';
import {BrandingError,normalizeBrandFields,normalizeHost,normalizeSlug} from '../domain/brand';
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type SanitizedBrandImage=Readonly<{bytes:Uint8Array;sha256:string;width:number;height:number}>;
export interface BrandAssetSanitizer{sanitize(input:Uint8Array):SanitizedBrandImage}
export interface BrandingSecurity{issueToken():{token:string;hash:string};hashToken(value:string):string}
export interface BrandingRepository{
 workspace(actor:Identity,organizationId:string,schoolId:string):Promise<BrandingWorkspace>;
 effectivePalette(organizationId:string,schoolId:string):Promise<BrandPalette|null>;
 createProfile(actor:Identity,organizationId:string,schoolId:string,slug:string,fields:BrandFields,key:string,reason:string):Promise<BrandingCommandResult>;
 saveDraft(actor:Identity,organizationId:string,schoolId:string,profileId:string,version:number,fields:BrandFields,key:string,reason:string):Promise<BrandingCommandResult>;
 uploadLogo(actor:Identity,organizationId:string,schoolId:string,profileId:string,version:number,asset:{bytes:Uint8Array;sha256:string;width:number;height:number},key:string,reason:string):Promise<{assetId:string;sha256:string;version:number}>;
 publish(actor:Identity,organizationId:string,schoolId:string,profileId:string,version:number,key:string,reason:string):Promise<BrandingCommandResult>;
 rollback(actor:Identity,organizationId:string,schoolId:string,profileId:string,targetRevision:string,version:number,key:string,reason:string):Promise<BrandingCommandResult>;
 startHostChallenge(actor:Identity,organizationId:string,schoolId:string,profileId:string,hostname:string,tokenHash:string,token:string):Promise<{hostname:string;txtName:string;txtValue:string;state:'PENDING'}>;
 verifyHost(actor:Identity,organizationId:string,schoolId:string,profileId:string,hostname:string,tokenHash:string,txtValues:string[]):Promise<boolean>;
 publicBrand(slug:string,host:string,canonicalHost:string):Promise<PublicBrandRecord|null>;
 publicAsset(assetId:string,sha256:string):Promise<Uint8Array|null>;
}
export interface CurrentBrandPermission{assertBrandingManage(actor:Identity,organizationId:string,schoolId:string):Promise<void>;assertCurrentMember(actor:Identity,organizationId:string,schoolId:string):Promise<void>}
export interface BrandHostChallengePort{txt(name:string):Promise<string[]>}
export type BrandingFacade=ReturnType<typeof createBrandingUseCases>;
const id=(v:unknown)=>{if(typeof v!=='string'||!uuidPattern.test(v))throw new BrandingError('VALIDATION');return v;};
function reason(v:unknown){if(typeof v!=='string'||v.trim().length<5||v.trim().length>500||/[\u0000-\u001f]/.test(v))throw new BrandingError('VALIDATION');return v.normalize('NFC').trim();}
function key(v:unknown){return id(v);}
function version(v:unknown){if(!Number.isSafeInteger(v)||Number(v)<1)throw new BrandingError('VALIDATION');return Number(v);}
function identity(v:Identity|null):Identity{if(!v||!uuidPattern.test(v.accountId)||!Number.isSafeInteger(v.tokenVersion))throw new BrandingError('UNAUTHENTICATED');return v;}
export function createBrandingUseCases(repo:BrandingRepository,permission:CurrentBrandPermission,hosts:BrandHostChallengePort,images:BrandAssetSanitizer,security:BrandingSecurity){
 const authorized=async(actorRaw:Identity|null,orgRaw:unknown,schoolRaw:unknown)=>{const actor=identity(actorRaw),organizationId=id(orgRaw),schoolId=id(schoolRaw);await permission.assertBrandingManage(actor,organizationId,schoolId);return {actor,organizationId,schoolId};};
 return {
  async workspace(actor:Identity|null,org:unknown,school:unknown){const a=await authorized(actor,org,school);return repo.workspace(a.actor,a.organizationId,a.schoolId);},
  async effectivePalette(actorRaw:Identity|null,orgRaw:unknown,schoolRaw:unknown){const actor=identity(actorRaw),organizationId=id(orgRaw),schoolId=id(schoolRaw);await permission.assertCurrentMember(actor,organizationId,schoolId);return repo.effectivePalette(organizationId,schoolId);},
  async createProfile(actor:Identity|null,org:unknown,school:unknown,raw:{slug:unknown;fields:unknown;key:unknown;reason:unknown}){const a=await authorized(actor,org,school);return repo.createProfile(a.actor,a.organizationId,a.schoolId,normalizeSlug(raw.slug),normalizeBrandFields(raw.fields),key(raw.key),reason(raw.reason));},
  async preview(actor:Identity|null,org:unknown,school:unknown,raw:unknown){const a=await authorized(actor,org,school);return {fields:normalizeBrandFields(raw),scope:{organizationId:a.organizationId,schoolId:a.schoolId}};},
  async saveDraft(actor:Identity|null,org:unknown,school:unknown,profile:unknown,raw:{version:unknown;fields:unknown;key:unknown;reason:unknown}){const a=await authorized(actor,org,school);return repo.saveDraft(a.actor,a.organizationId,a.schoolId,id(profile),version(raw.version),normalizeBrandFields(raw.fields),key(raw.key),reason(raw.reason));},
  async uploadLogo(actor:Identity|null,org:unknown,school:unknown,profile:unknown,raw:{version:unknown;key:unknown;reason:unknown},input:Uint8Array){const a=await authorized(actor,org,school);if(!(input instanceof Uint8Array))throw new BrandingError('VALIDATION');const png=images.sanitize(input);return repo.uploadLogo(a.actor,a.organizationId,a.schoolId,id(profile),version(raw.version),png,key(raw.key),reason(raw.reason));},
  async publish(actor:Identity|null,org:unknown,school:unknown,profile:unknown,raw:{version:unknown;key:unknown;reason:unknown}){const a=await authorized(actor,org,school);return repo.publish(a.actor,a.organizationId,a.schoolId,id(profile),version(raw.version),key(raw.key),reason(raw.reason));},
  async rollback(actor:Identity|null,org:unknown,school:unknown,profile:unknown,raw:{targetRevision:unknown;version:unknown;key:unknown;reason:unknown}){const a=await authorized(actor,org,school);return repo.rollback(a.actor,a.organizationId,a.schoolId,id(profile),id(raw.targetRevision),version(raw.version),key(raw.key),reason(raw.reason));},
  async startHostChallenge(actor:Identity|null,org:unknown,school:unknown,profile:unknown,raw:{hostname:unknown}){const a=await authorized(actor,org,school),hostname=normalizeHost(raw.hostname),{token,hash}=security.issueToken();return repo.startHostChallenge(a.actor,a.organizationId,a.schoolId,id(profile),hostname,hash,token);},
  async verifyHost(actor:Identity|null,org:unknown,school:unknown,profile:unknown,raw:{hostname:unknown;token:unknown}){const a=await authorized(actor,org,school),hostname=normalizeHost(raw.hostname);if(typeof raw.token!=='string'||raw.token.length<16||raw.token.length>100)throw new BrandingError('VALIDATION');const token=raw.token,txtName=`_vschool-verify.${hostname}`;let values:string[];try{values=await hosts.txt(txtName);}catch{throw new BrandingError('UNAVAILABLE');}if(!values.includes(token))return {verified:false};const tokenHash=security.hashToken(token);return {verified:await repo.verifyHost(a.actor,a.organizationId,a.schoolId,id(profile),hostname,tokenHash,values)};},
  async publicBrand(slug:unknown,hostRaw:unknown,canonicalRaw:unknown){const authority=(raw:unknown)=>{if(typeof raw!=='string'||/[\r\n\s/@]/.test(raw))throw new BrandingError('VALIDATION');try{const u=new URL(`http://${raw}`);if(u.pathname!=='/'||u.search||u.hash||u.username||u.password)return '';return u.hostname.toLowerCase();}catch{return '';}};const safeSlug=normalizeSlug(slug),host=authority(hostRaw),canonical=authority(canonicalRaw);if(!host||!canonical)return null;if(host!==canonical)normalizeHost(host);return repo.publicBrand(safeSlug,host,canonical);},
  async publicAsset(asset:unknown,hash:unknown){if(typeof asset!=='string'||!uuidPattern.test(asset)||typeof hash!=='string'||!/^[a-f0-9]{64}$/.test(hash))return null;return repo.publicAsset(asset,hash);},
 };
}

```

## Output adapters

- `backend/modules/branding/infrastructure/brands.ts`
- `backend/modules/branding/infrastructure/png.ts`
- `backend/modules/branding/infrastructure/security.ts`

## Pure domain rules

- `backend/modules/branding/domain/brand.ts`
- `backend/modules/branding/domain/theme.ts`

## Physical data

- `vs_branding_brand_profile` — Owns one editable draft and append-only published identity revisions.; see database/tables/vs_branding_brand_profile.md
- `vs_branding_brand_revision` — Private draft or immutable published sign-in identity.; see database/tables/vs_branding_brand_revision.md
- `vs_branding_brand_asset` — Sanitized canonical PNG derivative, submitted source discarded.; see database/tables/vs_branding_brand_asset.md
- `vs_branding_verified_brand_host` — Exact DNS TXT ownership proof for one published profile host mapping.; see database/tables/vs_branding_verified_brand_host.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/branding/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
