import {config} from 'dotenv';
import {chmodSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../generated/prisma/client';
import {localAccessConfig} from './access-local-config';

config({path: '.env.local', quiet: true});
config({quiet: true});

const outputDirectory = 'artifacts/must-have-presentation';
const outputPath = `${outputDirectory}/private-demo.json`;
const read = <T>(path: string) => JSON.parse(readFileSync(path, 'utf8')) as T;

async function main() {
  const local = localAccessConfig();
  const people = read<{organizationId: string; schoolId: string; adminEmail: string; teacherEmail: string}>('artifacts/people-02/private-demo.json');
  const guardians = read<{studentId?: string; parentEmail: string}>('artifacts/guardians-01/private-demo.json');
  const student = read<{studentId?: string; studentEmail: string}>('artifacts/students-portal/private-demo.json');
  const attendance = read<{teacherTwoEmail?: string; teacherTwoAccountId?: string; reportByDate?: Record<string, {sessionId?: string}>}>('artifacts/attendance-01/private-demo.json');
  if (!guardians.studentId || guardians.studentId !== student.studentId || !attendance.teacherTwoEmail || !attendance.teacherTwoAccountId) throw new Error('CONNECTED_PRESENTATION_IDENTITIES_REQUIRED');

  const db = new PrismaClient({adapter: new PrismaPg({connectionString: local.databaseUrl}), log: []});
  try {
    const accounts = await db.userAccount.findMany({where: {normalizedEmail: {in: [people.adminEmail, people.teacherEmail, guardians.parentEmail, student.studentEmail, attendance.teacherTwoEmail].map(value => value.toLowerCase())}, status: 'ACTIVE'}, select: {id: true, normalizedEmail: true}});
    if (accounts.length !== 5 || new Set(accounts.map(item => item.id)).size !== 5) throw new Error('FIVE_SEPARATE_PRESENTATION_ACCOUNTS_REQUIRED');
    const parentAccount = accounts.find(item => item.normalizedEmail === guardians.parentEmail.toLowerCase());
    const studentAccount = accounts.find(item => item.normalizedEmail === student.studentEmail.toLowerCase());
    const reviewerAccount = accounts.find(item => item.normalizedEmail === attendance.teacherTwoEmail!.toLowerCase());
    const reviewerMembership = reviewerAccount ? await db.schoolMembership.findFirst({where: {organizationId: people.organizationId, schoolId: people.schoolId, accountId: reviewerAccount.id, status: 'ACTIVE'}}) : null;
    const reviewerGrant = reviewerAccount ? await db.coordinationCapabilityGrant.findFirst({where: {organizationId: people.organizationId, schoolId: people.schoolId, accountId: reviewerAccount.id, capability: 'coordination.verify', revokedAt: null}}) : null;
    if (!reviewerMembership || !reviewerGrant) throw new Error('NARROW_REVIEWER_AUTHORITY_REQUIRED');
    const parentAccess = parentAccount ? await db.guardianChildAccess.findFirst({where: {organizationId: people.organizationId, schoolId: people.schoolId, studentId: student.studentId, accountId: parentAccount.id, acceptedAt: {not: null}, revokedAt: null, purposes: {some: {purpose: 'learning.assignment.read_child'}}}, select: {id: true}}) : null;
    const studentAccess = studentAccount ? await db.studentPortalAccess.findFirst({where: {organizationId: people.organizationId, schoolId: people.schoolId, studentId: student.studentId, accountId: studentAccount.id, acceptedAt: {not: null}, revokedAt: null, purposes: {some: {purpose: 'learning.assignment.read_self'}}}, select: {id: true}}) : null;
    if (!parentAccess || !studentAccess) throw new Error('CONNECTED_LEARNING_PURPOSES_REQUIRED');

    const placement = await db.sectionPlacement.findFirst({where: {organizationId: people.organizationId, schoolId: people.schoolId, enrollment: {studentId: student.studentId}}, orderBy: [{validFrom: 'desc'}, {id: 'asc'}], select: {sectionId: true}});
    const normalSessionIds = Object.values(attendance.reportByDate ?? {}).flatMap(item => item.sessionId ? [item.sessionId] : []);
    const session = await db.attendanceSession.findFirst({where: {id: {in: normalSessionIds}, organizationId: people.organizationId, schoolId: people.schoolId}, orderBy: {schoolDate: 'desc'}, select: {id: true, schoolDate: true, startsAt: true, endsAt: true}});
    if (!placement || !session) throw new Error('CONNECTED_CLASS_AND_NORMAL_SESSION_REQUIRED');
    const startHour = Number(new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23'}).format(session.startsAt));
    const endHour = Number(new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23'}).format(session.endsAt));
    if (startHour < 8 || endHour > 17) throw new Error('NORMAL_SCHOOL_HOURS_REQUIRED');

    const accountByEmail = new Map(accounts.map(item => [item.normalizedEmail, item.id]));
    const output = {
      organizationId: people.organizationId,
      schoolId: people.schoolId,
      studentId: student.studentId,
      sectionId: placement.sectionId,
      attendanceSessionId: session.id,
      attendanceDate: session.schoolDate.toISOString().slice(0, 10),
      credentialFiles: {
        administratorAndTeacher: 'artifacts/people-02/private-demo.json',
        parent: 'artifacts/guardians-01/private-demo.json',
        student: 'artifacts/students-portal/private-demo.json',
        independentReviewer: 'artifacts/attendance-01/private-demo.json',
      },
      accountIds: {
        administrator: accountByEmail.get(people.adminEmail.toLowerCase()),
        teacher: accountByEmail.get(people.teacherEmail.toLowerCase()),
        parent: accountByEmail.get(guardians.parentEmail.toLowerCase()),
        student: accountByEmail.get(student.studentEmail.toLowerCase()),
        independentReviewer: reviewerAccount!.id,
      },
    };
    mkdirSync(outputDirectory, {recursive: true, mode: 0o700});
    writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, {mode: 0o600});
    chmodSync(outputPath, 0o600);
    console.log(`Validated the connected five-persona synthetic presentation scenario. Private manifest: ${outputPath}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch(error => {
  const code = error instanceof Error && /^[A-Z0-9_]+$/.test(error.message) ? error.message : 'LOCAL_DEMO_ERROR';
  console.error(`MUST_HAVE_PRESENTATION_SEED_FAILED (${code}); no credentials were printed.`);
  process.exitCode = 1;
});
