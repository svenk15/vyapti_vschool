import {beforeAll,afterAll,describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {randomBytes,randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaVerifiedDatabaseContext,setVerifiedAccountDatabaseContext,setVerifiedBranchDatabaseContext} from '../../backend/modules/tenancy/infrastructure/verified-db-context';
import {createAccessServices} from '../../backend/composition/access';
import {schoolInput} from '../fixtures/access-management';

const configured=process.env.TEST_DATABASE_URL??'';
const target=new URL(configured);
if(!['127.0.0.1','localhost','[::1]'].includes(target.hostname)||target.pathname!=='/vyapti_vschool_test'||target.search)throw new Error('Dedicated local PostgreSQL test database required');
const credentials=JSON.parse(readFileSync('artifacts/tenancy-03/private-runtime.json','utf8')) as {test:{role:string;password:string}};
const runtimeUrl=new URL(configured);runtimeUrl.username=credentials.test.role;runtimeUrl.password=credentials.test.password;
const db=new PrismaClient({adapter:new PrismaPg({connectionString:runtimeUrl.toString(),connectionTimeoutMillis:5000,max:1}),log:[]});
const ownerDb=new PrismaClient({adapter:new PrismaPg({connectionString:configured,connectionTimeoutMillis:5000,max:2}),log:[]});
const access=createAccessServices({databaseUrl:configured}),operator={operatorId:randomUUID(),verified:true as const};
let scopeA!:{accountId:string;organizationId:string;branchId:string;tokenVersion:number};let scopeB!:{accountId:string;organizationId:string;branchId:string;tokenVersion:number};let emailA='';
type ContextRow={pid:number;account:string|null;organization:string|null;school:string|null};
const context=()=>db.$queryRaw<ContextRow[]>`SELECT pg_backend_pid() AS pid,current_setting('app.account_id',true) AS account,current_setting('app.organization_id',true) AS organization,current_setting('app.school_id',true) AS school`;
beforeAll(async()=>{await db.$connect();const inputA=schoolInput(),a=await access.provisionSchool(inputA,operator),b=await access.provisionSchool(schoolInput(),operator);scopeA={accountId:a.accountId,organizationId:a.organizationId,branchId:a.schoolId,tokenVersion:1};scopeB={accountId:b.accountId,organizationId:b.organizationId,branchId:b.schoolId,tokenVersion:1};emailA=inputA.adminEmail;});
afterAll(async()=>{await db.$disconnect();await ownerDb.$disconnect();await access.disconnect();});

describe('verified tenant context on restricted pooled runtime',()=>{
 it('resolves an exact login email into account-only transaction context and verifies token version',async()=>{
  const found=await db.$transaction(async tx=>{const accountId=await tx.$queryRaw<{account_id:string|null}[]>`SELECT public.vs_find_account_context_by_email(${emailA}) AS account_id`;expect(accountId[0]?.account_id).toBe(scopeA.accountId);expect((await tx.$queryRaw<{account:string|null}[]>`SELECT current_setting('app.account_id',true) AS account`)[0]?.account).toBe(scopeA.accountId);expect(await setVerifiedAccountDatabaseContext(tx,scopeA.accountId,scopeA.tokenVersion)).toBe(true);return (await tx.$queryRaw<{account:string|null;organization:string|null;school:string|null}[]>`SELECT current_setting('app.account_id',true) AS account,current_setting('app.organization_id',true) AS organization,current_setting('app.school_id',true) AS school`)[0];});
  expect(found).toEqual({account:scopeA.accountId,organization:'',school:''});const after=(await context())[0];expect([null,'']).toContain(after.account);
  const denied=await db.$transaction(async tx=>{expect(await setVerifiedAccountDatabaseContext(tx,scopeA.accountId,scopeA.tokenVersion+1)).toBe(false);return tx.$queryRaw<{account:string|null}[]>`SELECT current_setting('app.account_id',true) AS account`;});expect([null,'']).toContain(denied[0]?.account);
  const absent=await db.$transaction(tx=>tx.$queryRaw<{account_id:string|null}[]>`SELECT public.vs_find_account_context_by_email(${'missing-ten03@vschool.example'}) AS account_id`);expect(absent[0]?.account_id).toBeNull();expect([null,'']).toContain((await context())[0]?.account);
 });
 it('binds password-reset lookup to one opaque token without granting token-table reads',async()=>{
  const tokenHash=randomBytes(32).toString('hex'),now=new Date();await ownerDb.passwordResetToken.create({data:{id:randomUUID(),accountId:scopeA.accountId,issuingOrganizationId:null,tokenHash,deliveryStatus:'SENT',policySnapshot:{},organizationConfigurationVersions:[],createdAt:now,expiresAt:new Date(now.getTime()+60000)}});
  const databaseContext=new PrismaVerifiedDatabaseContext(),accountId=await db.$transaction(async tx=>{const id=await databaseContext.findAccountForPasswordReset(tx,tokenHash);expect(id).toBe(scopeA.accountId);return (await tx.$queryRaw<{account:string|null}[]>`SELECT current_setting('app.account_id',true) AS account`)[0]?.account;});expect(accountId).toBe(scopeA.accountId);
  const denied=await db.$transaction(async tx=>{expect(await databaseContext.findAccountForPasswordReset(tx,'malformed')).toBeNull();return tx.$queryRaw<{account:string|null}[]>`SELECT current_setting('app.account_id',true) AS account`;});expect([null,'']).toContain(denied[0]?.account);
  await expect(db.passwordResetToken.count()).rejects.toBeDefined();
 });
 it('binds invitation context to one live sent token and its exact pending scope',async()=>{
  const tokenHash=randomBytes(32).toString('hex'),now=new Date(),invite=await ownerDb.accessInvite.create({data:{id:randomUUID(),accountId:scopeA.accountId,organizationId:scopeA.organizationId,schoolId:scopeA.branchId,inviterAccountId:scopeA.accountId,tokenHash,proposedRoles:['TEACHER'],membershipVersion:1,organizationConfigurationVersion:1,schoolConfigurationVersion:1,deliveryStatus:'SENT',createdAt:now,expiresAt:new Date(now.getTime()+10*365*24*60*60*1000)}}),contextPort=new PrismaVerifiedDatabaseContext();
  const bound=await db.$transaction(async tx=>{expect(await contextPort.findStaffInviteByToken(tx,tokenHash)).toMatchObject({inviteId:invite.id,accountId:scopeA.accountId,organizationId:scopeA.organizationId,schoolId:scopeA.branchId});return tx.$queryRaw<{account:string|null;organization:string|null;school:string|null;invite:string|null}[]>`SELECT current_setting('app.account_id',true) AS account,current_setting('app.organization_id',true) AS organization,current_setting('app.school_id',true) AS school,current_setting('app.invite_id',true) AS invite`;});expect(bound[0]).toEqual({account:scopeA.accountId,organization:scopeA.organizationId,school:scopeA.branchId,invite:invite.id});
  await expect(db.accessInvite.count()).rejects.toBeDefined();
 });
 it('sets trusted scope transaction-locally and clears it after commit and rollback on pool size one',async()=>{
  const role=(await db.$queryRaw<{name:string;unsafe:boolean;schemaCreate:boolean;dmlTables:number;ownedRelations:number;memberships:number;databaseOwner:boolean}[]>`SELECT current_user AS name,(SELECT rolsuper OR rolbypassrls OR rolinherit OR rolcreatedb OR rolcreaterole FROM pg_catalog.pg_roles WHERE rolname=current_user) AS unsafe,has_schema_privilege(current_user,'public','CREATE') AS "schemaCreate",(SELECT count(*)::int FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p') AND (has_table_privilege(current_user,c.oid,'SELECT') OR has_table_privilege(current_user,c.oid,'INSERT') OR has_table_privilege(current_user,c.oid,'UPDATE') OR has_table_privilege(current_user,c.oid,'DELETE'))) AS "dmlTables",(SELECT count(*)::int FROM pg_catalog.pg_class WHERE relowner=(SELECT oid FROM pg_catalog.pg_roles WHERE rolname=current_user)) AS "ownedRelations",(SELECT count(*)::int FROM pg_catalog.pg_auth_members WHERE member=(SELECT oid FROM pg_catalog.pg_roles WHERE rolname=current_user)) AS memberships,(SELECT pg_catalog.pg_get_userbyid(datdba)=current_user FROM pg_catalog.pg_database WHERE datname=current_database()) AS "databaseOwner"`)[0];
  expect(role).toMatchObject({name:credentials.test.role,unsafe:false,schemaCreate:false,dmlTables:0,ownedRelations:0,memberships:0,databaseOwner:false});
  await expect(db.$executeRawUnsafe('SET ROLE "vyapti_vschool_test"')).rejects.toBeDefined();
  expect((await db.$queryRaw<{name:string}[]>`SELECT current_user AS name`)[0]?.name).toBe(credentials.test.role);
  const absent=(await context())[0];expect([null,'']).toContain(absent.account);expect([null,'']).toContain(absent.organization);expect([null,'']).toContain(absent.school);
  const first=await db.$transaction(async tx=>{expect(await setVerifiedBranchDatabaseContext(tx,{accountId:scopeA.accountId,organizationId:scopeA.organizationId,branchId:scopeA.branchId},scopeA.tokenVersion)).toBe(true);return (await tx.$queryRaw<ContextRow[]>`SELECT pg_backend_pid() AS pid,current_setting('app.account_id',true) AS account,current_setting('app.organization_id',true) AS organization,current_setting('app.school_id',true) AS school`)[0];});
  expect(first).toMatchObject({account:scopeA.accountId,organization:scopeA.organizationId,school:scopeA.branchId});
  const afterCommit=(await context())[0];expect(afterCommit.pid).toBe(first.pid);expect([null,'']).toContain(afterCommit.account);expect([null,'']).toContain(afterCommit.organization);expect([null,'']).toContain(afterCommit.school);
  const second=await db.$transaction(async tx=>{expect(await setVerifiedBranchDatabaseContext(tx,{accountId:scopeB.accountId,organizationId:scopeB.organizationId,branchId:scopeB.branchId},scopeB.tokenVersion)).toBe(true);return (await tx.$queryRaw<ContextRow[]>`SELECT pg_backend_pid() AS pid,current_setting('app.account_id',true) AS account,current_setting('app.organization_id',true) AS organization,current_setting('app.school_id',true) AS school`)[0];});expect(second.pid).toBe(first.pid);expect(second).toMatchObject({account:scopeB.accountId,organization:scopeB.organizationId,school:scopeB.branchId});
  await expect(db.$transaction(async tx=>{expect(await setVerifiedBranchDatabaseContext(tx,{accountId:scopeA.accountId,organizationId:scopeA.organizationId,branchId:scopeA.branchId},scopeA.tokenVersion)).toBe(true);throw new Error('rollback probe');})).rejects.toThrow('rollback probe');
  const afterRollback=(await context())[0];expect(afterRollback.pid).toBe(first.pid);expect([null,'']).toContain(afterRollback.account);expect([null,'']).toContain(afterRollback.organization);expect([null,'']).toContain(afterRollback.school);
  const denied=await db.$transaction(tx=>setVerifiedBranchDatabaseContext(tx,{accountId:randomUUID(),organizationId:scopeA.organizationId,branchId:scopeA.branchId},1));expect(denied).toBe(false);const afterDenied=(await context())[0];expect([null,'']).toContain(afterDenied.account);expect([null,'']).toContain(afterDenied.organization);expect([null,'']).toContain(afterDenied.school);
 });
});
