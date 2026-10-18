import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { PrismaClient } from '../generated/prisma/client';
import { createAccessServices } from '../backend/composition/access';
import { createAttendanceServices } from '../backend/composition/attendance';
import { createReportingServices } from '../backend/composition/reporting';
import { localAccessConfig } from './access-local-config';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const path = 'artifacts/leadership-01/private-demo.json';
type Demo = {
  adminEmail: string;
  password: string;
  organizationId: string;
  schoolId: string;
  coverageDate?: string;
  coverageCounts?: { scheduled: number; due: number; received: number; awaiting: number; notDue: number; cancelled: number };
  snapshotId?: string;
  comparisonBranchIds?: string[];
  leadershipBriefId?: string;
};
const deterministicKey = (value: string) => {
  const hash = createHash('sha256').update(value).digest('hex').slice(0, 32);
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20)}`;
};

async function main() {
  const local = localAccessConfig();
  if (!existsSync(path)) throw new Error('PRINCIPAL_DEMO_REQUIRED');
  const demo = JSON.parse(readFileSync(path, 'utf8')) as Demo;
  const access = createAccessServices(local);
  const released = ['academic_core', 'attendance', 'staff_core', 'student_core'] as const;
  const attendance = createAttendanceServices({ databaseUrl: local.databaseUrl, releasedModules: released });
  const reporting = createReportingServices({ databaseUrl: local.databaseUrl, releasedModules: released, snapshotMode: 'synthetic' });
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: local.databaseUrl }), log: [] });
  try {
    const identity = await access.authenticate(demo.adminEmail, demo.password);
    if (!identity) throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');
    let coverage = await attendance.get(identity, demo.organizationId, demo.schoolId, {});
    let complete = coverage.counts.awaiting >= 1 && coverage.counts.received >= 1 && coverage.counts.notDue >= 1;
    for (let offset = 1; !complete && offset <= 14; offset++) {
      const candidate = new Date(`${coverage.schoolDate}T00:00:00.000Z`);
      candidate.setUTCDate(candidate.getUTCDate() - offset);
      const historical = await attendance.get(identity, demo.organizationId, demo.schoolId, { date: candidate.toISOString().slice(0, 10) });
      if (historical.counts.awaiting >= 1 && historical.counts.received >= 1 && historical.counts.notDue >= 1) {
        coverage = historical;
        complete = true;
      }
    }
    if (!complete) throw new Error('PRINCIPAL_ATTENDANCE_SCENARIO_REQUIRED');
    await reporting.grantExporter(local.operator, { organizationId: demo.organizationId, schoolId: demo.schoolId, accountId: identity.accountId });
    await reporting.grantSnapshotManager(local.operator, { organizationId: demo.organizationId, schoolId: demo.schoolId, accountId: identity.accountId });
    const exported = await reporting.exportLeadershipAttendance(identity, demo.organizationId, demo.schoolId, { date: coverage.schoolDate });
    if (!exported.csv.includes('"SUMMARY","register-coverage.v1"') || exported.rowCount !== coverage.awaiting.total + 1) throw new Error('PRINCIPAL_REPORT_EXPORT_REQUIRED');

    const retainedSnapshot = demo.snapshotId ? await db.reportingSnapshot.findFirst({
      where: {
        id: demo.snapshotId,
        organizationId: demo.organizationId,
        schoolId: demo.schoolId,
        actorAccountId: identity.accountId,
        reportType: 'attendance-register-coverage.v1',
        removedAt: null,
      },
      select: { id: true },
    }) : null;
    const snapshot = retainedSnapshot ?? await reporting.captureAttendanceSnapshot(identity, demo.organizationId, demo.schoolId, {
      query: { date: coverage.schoolDate },
      key: deterministicKey(`principal-snapshot:${demo.organizationId}:${demo.schoolId}:${coverage.schoolDate}`),
    });

    await reporting.grantLeadershipComparison(local.operator, { organizationId: demo.organizationId, schoolId: demo.schoolId, accountId: identity.accountId });
    const comparison = await reporting.compareLeadershipBranches(identity, demo.organizationId, demo.schoolId, { branchIds: [demo.schoolId], fromDate: coverage.schoolDate, toDate: coverage.schoolDate });
    const branch = comparison.branches[0];
    if (comparison.branches.length !== 1 || !branch || comparison.combined.numerator !== branch.counts.received || comparison.combined.denominator !== branch.counts.due || !branch.dates.includes(coverage.schoolDate)) throw new Error('PRINCIPAL_COMPARISON_REQUIRED');
    await reporting.grantBriefCapability(local.operator, { organizationId: demo.organizationId, accountId: identity.accountId, capability: 'GENERATE' });
    await reporting.grantBriefCapability(local.operator, { organizationId: demo.organizationId, accountId: identity.accountId, capability: 'SHARE' });

    let shared: { briefId: string; state: string } | null = demo.leadershipBriefId ? await reporting.getBrief(identity, demo.organizationId, demo.schoolId, demo.leadershipBriefId).catch(() => null) : null;
    if (!shared) {
      const briefInput = {
        title: 'Synthetic attendance review',
        purpose: 'Review the retained branch attendance evidence.',
        interpretation: `${coverage.counts.received} of ${coverage.counts.due} due registers are received.`,
        nextActions: 'Review the remaining register through the authorized Attendance workspace.',
        snapshotIds: [snapshot.id],
        recipientAccountIds: [identity.accountId],
        key: deterministicKey(`principal-brief-create:${snapshot.id}`),
      };
      const brief = await reporting.createBrief(identity, demo.organizationId, demo.schoolId, briefInput);
      const finalized = await reporting.finalizeBrief(identity, demo.organizationId, demo.schoolId, brief.briefId, { expectedVersion: brief.version, key: deterministicKey(`principal-brief-finalize:${brief.briefId}`) });
      shared = await reporting.shareBrief(identity, demo.organizationId, demo.schoolId, brief.briefId, { expectedVersion: finalized.version, key: deterministicKey(`principal-brief-share:${brief.briefId}`) });
    }
    if (shared.state !== 'FINALIZED') throw new Error('PRINCIPAL_BRIEF_REQUIRED');
    demo.coverageDate = coverage.schoolDate;
    demo.coverageCounts = coverage.counts;
    demo.snapshotId = snapshot.id;
    demo.comparisonBranchIds = [demo.schoolId];
    demo.leadershipBriefId = shared.briefId;
    writeFileSync(path, `${JSON.stringify(demo, null, 2)}\n`, { mode: 0o600 });
    console.log(`Verified and preserved the connected Principal Attendance/export/snapshot/comparison/brief scenario. Private credentials and date: ${path}`);
  } finally {
    await db.$disconnect();
    await reporting.disconnect();
    await attendance.disconnect();
    await access.disconnect();
  }
}

main().catch(error => {
  const safeCode = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : null;
  const safeName = error instanceof Error && /^[A-Za-z]+Error$/.test(error.name) ? error.name : null;
  console.error(error instanceof Error && /^[A-Z0-9_]+$/.test(error.message) ? error.message : safeCode ?? safeName ?? 'PRINCIPAL_ATTENDANCE_DEMO_ERROR');
  process.exitCode = 1;
});
