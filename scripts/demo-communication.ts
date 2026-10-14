import {config} from 'dotenv';
import {chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {randomBytes, randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {PrismaClient} from '../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createCommunicationServices} from '../backend/composition/communication';
import {createGuardiansServices} from '../backend/composition/guardians';
import {createTenancyServices} from '../backend/composition/tenancy';
import {BcryptPasswords} from '../backend/modules/access/infrastructure/passwords';
import {localAccessConfig} from './access-local-config';

config({path: '.env.local', quiet: true});
config({quiet: true});

const directory = 'artifacts/communication-01';
const path = join(directory, 'private-demo.json');
const peoplePath = 'artifacts/people-02/private-demo.json';
const guardiansPath = 'artifacts/guardians-01/private-demo.json';
const modules = ['academic_core', 'admissions', 'attendance', 'communication', 'family', 'staff_core', 'student_core', 'timetable'] as const;

type Demo = {
  parentEmail: string;
  parentPassword: string;
  authorizeKey: string;
  entitlementKey: string;
  activationKey: string;
  publishKey: string;
  accessId?: string;
  parentAccountId?: string;
  studentId?: string;
  noticeId?: string;
};

function save(value: Demo) {
  mkdirSync(directory, {recursive: true, mode: 0o700});
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, {mode: 0o600});
  chmodSync(path, 0o600);
}

function load(): Demo {
  mkdirSync(directory, {recursive: true, mode: 0o700});
  if (existsSync(path)) return JSON.parse(readFileSync(path, 'utf8')) as Demo;
  const value: Demo = {
    parentEmail: `notices.parent-${randomUUID().slice(0, 8)}@example.test`,
    parentPassword: randomBytes(24).toString('base64url'),
    authorizeKey: randomUUID(),
    entitlementKey: randomUUID(),
    activationKey: randomUUID(),
    publishKey: randomUUID(),
  };
  save(value);
  return value;
}

async function main() {
  const local = localAccessConfig();
  const demo = load();
  const people = JSON.parse(readFileSync(peoplePath, 'utf8')) as {adminEmail: string; password: string; organizationId: string; schoolId: string};
  const guardianFixture = JSON.parse(readFileSync(guardiansPath, 'utf8')) as {studentId?: string};
  const db = new PrismaClient({adapter: new PrismaPg({connectionString: local.databaseUrl}), log: []});
  const tenancy = createTenancyServices({databaseUrl: local.databaseUrl, releasedModules: modules});
  let invitationToken = '';
  const guardians = createGuardiansServices({
    databaseUrl: local.databaseUrl,
    releasedModules: modules,
    emailSender: {sendFamilyInvite: async input => { invitationToken = input.token; return {ok: true}; }},
  });
  const communication = createCommunicationServices({databaseUrl: local.databaseUrl, releasedModules: modules});
  let stage = 'authenticate';
  try {
    const account = await db.userAccount.findUnique({where: {normalizedEmail: people.adminEmail.toLowerCase()}});
    if (!account || account.status !== 'ACTIVE' || !await new BcryptPasswords().verify(people.password, account.passwordHash)) throw new Error('SYNTHETIC_ADMIN_REQUIRED');
    const admin = {accountId: account.id, tokenVersion: account.tokenVersion};

    stage = 'entitlement';
    const entitlement = await db.organizationEntitlement.findUnique({where: {organizationId_moduleId: {organizationId: people.organizationId, moduleId: 'communication'}}});
    if (entitlement && entitlement.state !== 'ACTIVE') throw new Error('SYNTHETIC_COMMUNICATION_CONTRACT_INACTIVE');
    if (!entitlement) await tenancy.setEntitlement(local.operator, {kind: 'SetOrganizationEntitlement', organizationId: people.organizationId, actorAccountId: admin.accountId, moduleId: 'communication', state: 'ACTIVE', startsAt: new Date().toISOString(), endsAt: null, expectedVersion: 0, manifestVersion: 1, limits: {}, key: demo.entitlementKey, reason: 'Synthetic Parent notice local demo contract'});

    stage = 'activation';
    const branch = await tenancy.getBranch(admin, people.organizationId, people.schoolId);
    const enabled = branch.modules.filter(item => item.activationState === 'ACTIVE').map(item => item.moduleId);
    const desired = [...new Set([...enabled, ...modules])];
    if (modules.some(moduleId => branch.modules.find(item => item.moduleId === moduleId)?.activationState !== 'ACTIVE')) {
      const preview = await tenancy.preview(admin, people.organizationId, people.schoolId, desired);
      if (preview.blockers.length) throw new Error('SYNTHETIC_COMMUNICATION_ACTIVATION_BLOCKED');
      await tenancy.confirm(admin, people.organizationId, people.schoolId, {enabled: desired, expectedVersions: preview.expectedVersions, previewHash: preview.previewHash, expectedInstitutionRevision: preview.institutionRevision, expectedBranchRevision: preview.branchRevision, key: demo.activationKey, reason: 'Activate synthetic Parent notice demo'});
    }

    stage = 'authority';
    await guardians.grantManager(local.operator, {organizationId: people.organizationId, schoolId: people.schoolId, accountId: admin.accountId});
    await communication.grantPublisher(local.operator, {organizationId: people.organizationId, schoolId: people.schoolId, accountId: admin.accountId});

    stage = 'audience';
    demo.studentId ??= guardianFixture.studentId;
    if (!demo.studentId) throw new Error('SYNTHETIC_GUARDIAN_STUDENT_REQUIRED');
    const placement = await db.sectionPlacement.findFirst({
      where: {organizationId: people.organizationId, schoolId: people.schoolId, enrollment: {studentId: demo.studentId}},
      orderBy: [{validFrom: 'desc'}, {id: 'asc'}],
      select: {sectionId: true},
    });
    if (!placement) throw new Error('SYNTHETIC_CURRENT_PLACEMENT_REQUIRED');

    stage = 'parent';
    let access = demo.accessId ? await db.guardianChildAccess.findUnique({where: {id: demo.accessId}, include: {purposes: true}}) : null;
    if (!access) {
      invitationToken = '';
      const issued = await guardians.authorize(admin, {organizationId: people.organizationId, schoolId: people.schoolId, studentId: demo.studentId, displayName: 'Anika Sharma', email: demo.parentEmail, noticeRead: true, confirmed: true, key: demo.authorizeKey, requestId: randomUUID()});
      if (!invitationToken) throw new Error('SYNTHETIC_NOTICE_INVITATION_REQUIRED');
      const accepted = await guardians.accept(null, {token: invitationToken, initialPassword: demo.parentPassword, confirmation: demo.parentPassword, requestId: randomUUID()});
      demo.accessId = issued.accessId;
      demo.parentAccountId = accepted.accountId;
      access = await db.guardianChildAccess.findUnique({where: {id: issued.accessId}, include: {purposes: true}});
    }
    if (!access || access.revokedAt || !access.acceptedAt || !access.purposes.some(item => item.purpose === 'communication.notice.read')) throw new Error('SYNTHETIC_NOTICE_ACCESS_CONFLICT');
    const parent = await db.userAccount.findUnique({where: {normalizedEmail: demo.parentEmail}});
    if (!parent || parent.status !== 'ACTIVE' || !await new BcryptPasswords().verify(demo.parentPassword, parent.passwordHash ?? '')) throw new Error('SYNTHETIC_NOTICE_PARENT_CREDENTIAL_CONFLICT');
    demo.parentAccountId = parent.id;

    stage = 'notice';
    const existing = demo.noticeId ? await db.communicationNotice.findFirst({where: {id: demo.noticeId, organizationId: people.organizationId, schoolId: people.schoolId}}) : null;
    if (!existing) {
      const published = await communication.publish(admin, people.organizationId, people.schoolId, {sectionId: placement.sectionId, title: 'Family learning evening', body: 'Please review the family learning evening arrangements and acknowledge this notice.', requiresAcknowledgement: true, key: demo.publishKey}, randomUUID());
      demo.noticeId = published.noticeId;
    }
    save(demo);
    console.log(`Prepared or preserved an immutable school notice and a separately authorized Parent recipient. Private credentials: ${path}`);
  } catch (error) {
    const code = error instanceof Error && /^[A-Z0-9_]+$/.test(error.message) ? error.message : 'LOCAL_DEMO_ERROR';
    throw new Error(`${stage.toUpperCase()}_${code}`);
  } finally {
    await communication.disconnect();
    await guardians.disconnect();
    await tenancy.disconnect();
    await db.$disconnect();
  }
}

main().catch(error => {
  console.error(`COMMUNICATION_DEMO_SEED_FAILED (${error instanceof Error ? error.message : 'LOCAL_DEMO_ERROR'}): credentials were not printed.`);
  process.exitCode = 1;
});
