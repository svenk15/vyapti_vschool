import { config } from 'dotenv';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { createAccessServices } from '../backend/composition/access';
import { createPeopleServices } from '../backend/composition/people';
import { createTenancyServices } from '../backend/composition/tenancy';
import { DevelopmentMailSink } from '../backend/modules/access/infrastructure/development-mail-sink';
import { localAccessConfig } from './access-local-config';
import type { ProvisionInput, ProvisionResult } from '../shared/contracts/access';

config({ path: '.env.local', quiet: true }); config({ quiet: true });
const dir = 'artifacts/people-02';
const path = join(dir, 'private-demo.json');
type Demo = ProvisionInput & ProvisionResult & {
  teacherEmail: string; teacherPassword: string; inviteRequestId: string;
  grantKey: string; entitlementKey: string; branchActivationKey: string;
  startsAt: string; profileKeys: [string, string];
  employeeIds?: [string, string]; teacherAccountId?: string;
  schoolProfileKey?: string;
};
function save(value: Demo) {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}
function load(): Demo {
  if (existsSync(path)) {
    const value = JSON.parse(readFileSync(path, 'utf8')) as Demo;
    if (typeof value.adminEmail === 'string') return value;
  }
  const suffix = randomUUID().slice(0, 8);
  const value: Demo = {
    organizationName: `Synthetic People demo ${suffix}`, schoolCode: 'MAIN', schoolName: `VSchool People ${suffix}`, timezone: 'Asia/Kolkata',
    adminEmail: `admin-${suffix}@vschool.example`, password: randomBytes(24).toString('base64url'),
    teacherEmail: `teacher-${suffix}@vschool.example`, teacherPassword: randomBytes(24).toString('base64url'),
    inviteRequestId: randomUUID(), grantKey: randomUUID(), entitlementKey: randomUUID(), branchActivationKey: randomUUID(),
    startsAt: new Date().toISOString(), profileKeys: [randomUUID(), randomUUID()],
    organizationId: '', schoolId: '', accountId: '', membershipId: '',
  };
  save(value);
  return value;
}
function invitationToken(email: string): string | null {
  const directory = 'artifacts/mail-sink';
  if (!existsSync(directory)) return null;
  for (const name of readdirSync(directory).filter(file => file.endsWith('.json')).reverse()) {
    try {
      const message = JSON.parse(readFileSync(join(directory, name), 'utf8')) as { recipient?: string; link?: string };
      if (message.recipient?.toLowerCase() !== email.toLowerCase() || typeof message.link !== 'string') continue;
      const token = new URL(message.link).hash.slice(1); if (token.length >= 32) return token;
    } catch { /* Ignore unrelated or incomplete sink files. */ }
  }
  return null;
}
async function main() {
  const local = localAccessConfig();
  let demo = load();
  const sink = new DevelopmentMailSink('http://127.0.0.1:3400', join(process.cwd(), 'artifacts/mail-sink'), true);
  const access = createAccessServices({ ...local, emailSender: sink });
  let admin;
  let teacher;
  try {
    admin = await access.authenticate(demo.adminEmail, demo.password);
    if (!admin) {
      const provisioned = await access.provisionSchool(demo, local.operator);
      demo = { ...demo, ...provisioned }; save(demo);
      admin = await access.authenticate(demo.adminEmail, demo.password);
    }
    if (!admin) throw new Error('SYNTHETIC_ADMIN_UNAVAILABLE');
    if (!demo.organizationId || !demo.schoolId || !demo.accountId || !demo.membershipId) {
      const home = await access.getAccountHome(admin);
      demo = { ...demo, organizationId: home.scope.organizationId, schoolId: home.scope.schoolId, accountId: home.accountId, membershipId: home.membershipId }; save(demo);
    }
    if (!demo.schoolProfileKey) { demo = { ...demo, schoolProfileKey: randomUUID() }; save(demo); }
    const schoolProfileKey = demo.schoolProfileKey;
    if (!schoolProfileKey) throw new Error('SYNTHETIC_SCHOOL_PROFILE_KEY_REQUIRED');
    const settings = await access.getSettings(admin, demo.schoolId);
    if (!settings.officeEmail && !settings.officePhone && !settings.officeAddress) {
      await access.command(admin, 'UpdateSchool', { payload: { name: settings.name, timezone: settings.timezone, officeEmail: 'office@vschool.example', officePhone: '+91 80 5555 0101', officeAddress: '1 Fictional Learning Road, Bengaluru', reason: 'Prepare fictional branch office demo details' }, expectedVersion: settings.version }, schoolProfileKey, demo.schoolId);
    }
    await access.institutionOperation({ kind: 'SetInstitutionGrant', organizationId: demo.organizationId, accountId: demo.accountId, status: 'ACTIVE', expectedVersion: 0, key: demo.grantKey, reason: 'Synthetic PER-02 demo authority' }, local.operator);
    const current = await access.getAccountHome(admin, demo.schoolId);
    if (current.scope.organizationId !== demo.organizationId) throw new Error('SYNTHETIC_SCOPE_MISMATCH');
    teacher = await access.authenticate(demo.teacherEmail, demo.teacherPassword);
    if (!teacher) {
      let token = invitationToken(demo.teacherEmail);
      if (!token) {
        const invite = await access.inviteStaff({ email: demo.teacherEmail, organizationId: demo.organizationId, schoolId: demo.schoolId, roles: ['TEACHER'], inviterAccountId: admin.accountId, inviterTokenVersion: admin.tokenVersion, requestId: demo.inviteRequestId });
        if (invite.deliveryStatus !== 'SENT') throw new Error('DEVELOPMENT_MAIL_SINK_UNAVAILABLE');
        token = invitationToken(demo.teacherEmail);
      }
      if (!token) throw new Error('SYNTHETIC_INVITATION_MISSING');
      await access.acceptStaffInvite({ token, initialPassword: demo.teacherPassword, confirmation: demo.teacherPassword, requestId: randomUUID() });
      teacher = await access.authenticate(demo.teacherEmail, demo.teacherPassword);
    }
    if (!teacher) throw new Error('SYNTHETIC_TEACHER_UNAVAILABLE');
    demo = { ...demo, teacherAccountId: teacher.accountId }; save(demo);
  } finally { await access.disconnect(); }

  const tenancy = createTenancyServices({ databaseUrl: local.databaseUrl, releasedModules: ['academic_core'] });
  try {
    await tenancy.setEntitlement(local.operator, { kind: 'SetOrganizationEntitlement', organizationId: demo.organizationId, actorAccountId: demo.accountId, moduleId: 'academic_core', state: 'ACTIVE', startsAt: demo.startsAt, endsAt: null, expectedVersion: 0, manifestVersion: 1, limits: {}, key: demo.entitlementKey, reason: 'Synthetic PER-02 academic module entitlement' });
    const preview = await tenancy.preview(admin!, demo.organizationId, demo.schoolId, ['academic_core']);
    if (preview.blockers.length) throw new Error('SYNTHETIC_MODULE_BLOCKED');
    const branch = await tenancy.getBranch(admin!, demo.organizationId, demo.schoolId);
    if (branch.modules.find(item => item.moduleId === 'academic_core')?.activationState !== 'ACTIVE') {
      await tenancy.confirm(admin!, demo.organizationId, demo.schoolId, { enabled: ['academic_core'], expectedVersions: preview.expectedVersions, previewHash: preview.previewHash, expectedInstitutionRevision: preview.institutionRevision, expectedBranchRevision: preview.branchRevision, key: demo.branchActivationKey, reason: 'Activate synthetic PER-02 academic demo' });
    }
  } finally { await tenancy.disconnect(); }

  const people = createPeopleServices({ databaseUrl: local.databaseUrl, releasedModules: ['academic_core'] });
  try {
    const profiles = [];
    for (const [index, staffNumber] of ['DEMO-TEACHER-01', 'DEMO-TEACHER-02'].entries()) {
      profiles.push(await people.createEmployee(admin!, demo.organizationId, demo.schoolId, {
        firstName: index === 0 ? 'Avery' : 'Jordan', lastName: 'Example', contactEmail: null, staffNumber,
        employedFrom: '2026-04-01', key: demo.profileKeys[index]!,
      }));
    }
    demo = { ...demo, employeeIds: [profiles[0]!.employeeId, profiles[1]!.employeeId] }; save(demo);
  } finally { await people.disconnect(); }
  console.log(`Prepared an isolated synthetic People school, two unbound staff profiles and an active verified teacher account. Private credentials: ${path}`);
}
main().catch(error => {
  const code = error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'LOCAL_DEMO_ERROR';
  console.error(`PEOPLE_DEMO_SEED_FAILED (${code}): private credentials and tokens were not printed.`);
  process.exitCode = 1;
});
