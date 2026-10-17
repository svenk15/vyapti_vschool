import {expect, test, type Page} from '@playwright/test';
import {randomBytes, randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAccessServices} from '../../backend/composition/access';
import {createCommunicationServices} from '../../backend/composition/communication';
import {createGuardiansServices} from '../../backend/composition/guardians';
import {BcryptPasswords} from '../../backend/modules/access/infrastructure/passwords';
import {schoolInput} from '../fixtures/access-management';

const url = process.env.TEST_DATABASE_URL ?? '';
if (new URL(url).pathname !== '/vyapti_vschool_test') throw new Error('Dedicated Communication attachment E2E database required');
const modules = ['academic_core', 'communication', 'family', 'student_core'] as const;
const db = new PrismaClient({adapter: new PrismaPg({connectionString: url, max: 3}), log: []});
const access = createAccessServices({databaseUrl: url});
const communication = createCommunicationServices({databaseUrl: url, releasedModules: modules});
let invite = '';
const guardians = createGuardiansServices({databaseUrl: url, releasedModules: modules, emailSender: {sendFamilyInvite: async input => { invite = input.token; return {ok: true}; }}});
const operator = {operatorId: randomUUID(), verified: true as const};
const evidence = 'docs/evidence/principal-lea-32-attachments-2026-10-18';
let fixture: {schoolId: string; adminEmail: string; adminPassword: string; reviewerEmail: string; reviewerPassword: string; parentEmail: string; parentPassword: string};

async function signIn(page: Page, email: string, password: string, workspace: 'administration' | 'leadership' | 'family') {
  await page.context().clearCookies();
  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel(/^Password/).fill(password);
  await page.getByRole('button', {name: 'Sign in', exact: true}).click();
  if (workspace === 'family') { await page.waitForURL(/\/family(?:\/|$)/); return; }
  await page.waitForURL(/\/(?:choose-workspace|admin|leadership)(?:\/|$)/);
  if (page.url().includes('/choose-workspace')) {
    const chooser = page.getByRole('combobox', {name: 'Branch'});
    const destination = workspace === 'leadership' ? /\/leadership(?:\/|$)/ : /\/admin(?:\/|$)/;
    await expect.poll(async () => destination.test(new URL(page.url()).pathname) || await chooser.count() > 0).toBeTruthy();
    if (!destination.test(new URL(page.url()).pathname)) {
      await chooser.selectOption(`${fixture.schoolId}:${workspace}`);
      await page.getByRole('button', {name: /Continue/}).click();
      await page.getByRole('button', {name: /Confirm/}).click();
    }
  }
  await expect(page).toHaveURL(workspace === 'leadership' ? /\/leadership(?:\/|$)/ : /\/admin(?:\/|$)/);
}

test.beforeAll(async () => {
  mkdirSync(evidence, {recursive: true});
  const label = randomUUID().slice(0, 5).toUpperCase();
  const input = {...schoolInput(), organizationName: `Harbour Trust ${label}`, schoolName: `Willow School ${label}`};
  const school = await access.provisionSchool(input, operator), admin = {accountId: school.accountId, tokenVersion: 1}, now = new Date(), from = new Date(now), until = new Date(now);
  from.setUTCFullYear(from.getUTCFullYear() - 1); until.setUTCFullYear(until.getUTCFullYear() + 1);
  await db.organization.update({where: {id: school.organizationId}, data: {trustMode: 'EMAIL'}});
  for (const moduleId of modules) {
    await db.organizationEntitlement.create({data: {id: randomUUID(), organizationId: school.organizationId, moduleId, state: 'ACTIVE', startsAt: from, limits: {}, manifestVersion: 1, version: 1}});
    await db.branchActivation.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, moduleId, state: 'ACTIVE', version: 1, enabledAt: now}});
  }
  await guardians.grantManager(operator, {organizationId: school.organizationId, schoolId: school.schoolId, accountId: school.accountId});
  await communication.grantPublisher(operator, {organizationId: school.organizationId, schoolId: school.schoolId, accountId: school.accountId});
  await communication.grantNoticeWorkflow(operator, {organizationId: school.organizationId, schoolId: school.schoolId, accountId: school.accountId, action: 'AUTHOR'});
  await communication.grantNoticeWorkflow(operator, {organizationId: school.organizationId, schoolId: school.schoolId, accountId: school.accountId, action: 'PUBLISH'});
  const reviewerEmail = `reviewer-${randomUUID()}@example.test`, reviewerPassword = randomBytes(24).toString('base64url'), reviewerId = randomUUID(), reviewerMembershipId = randomUUID();
  await db.userAccount.create({data: {id: reviewerId, normalizedEmail: reviewerEmail, passwordHash: await new BcryptPasswords().hash(reviewerPassword), emailVerifiedAt: now, status: 'ACTIVE', tokenVersion: 1, failedAttempts: 0, version: 1, createdAt: now}});
  await db.schoolMembership.create({data: {id: reviewerMembershipId, organizationId: school.organizationId, schoolId: school.schoolId, accountId: reviewerId, status: 'ACTIVE', version: 1}});
  await db.roleGrant.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, membershipId: reviewerMembershipId, code: 'PRINCIPAL'}});
  await communication.grantNoticeWorkflow(operator, {organizationId: school.organizationId, schoolId: school.schoolId, accountId: reviewerId, action: 'REVIEW'});
  const person = await db.person.create({data: {id: randomUUID(), organizationId: school.organizationId, firstName: 'Ira', lastName: 'Example', version: 1, createdAt: now}}), student = await db.student.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, personId: person.id, admissionNumber: `DOC-${label}`, admittedOn: from, status: 'ACTIVE', version: 1, createdAt: now}}), year = await db.academicYear.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, code: `Y${label}`, name: 'Current year', startsOn: from, endsOn: until, status: 'OPEN', version: 1}}), grade = await db.gradeLevel.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, code: `G${label}`, name: 'Grade 5', sortOrder: 5, active: true, version: 1}}), section = await db.section.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, yearId: year.id, gradeId: grade.id, code: 'A', name: 'Section A', active: true, version: 1}}), enrollment = await db.enrollment.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, studentId: student.id, yearId: year.id, validFrom: from, validTo: until, version: 1}});
  await db.sectionPlacement.create({data: {id: randomUUID(), organizationId: school.organizationId, schoolId: school.schoolId, enrollmentId: enrollment.id, yearId: year.id, sectionId: section.id, validFrom: from, validTo: until}});
  const parentEmail = `parent-${randomUUID()}@example.test`, parentPassword = randomBytes(24).toString('base64url'); invite = '';
  await guardians.authorize(admin, {organizationId: school.organizationId, schoolId: school.schoolId, studentId: student.id, displayName: 'Mina Example', email: parentEmail, noticeRead: true, confirmed: true, key: randomUUID(), requestId: randomUUID()});
  await guardians.accept(null, {token: invite, initialPassword: parentPassword, confirmation: parentPassword, requestId: randomUUID()});
  fixture = {schoolId: school.schoolId, adminEmail: input.adminEmail, adminPassword: input.password, reviewerEmail, reviewerPassword, parentEmail, parentPassword};
});

test.afterAll(async () => { await communication.disconnect(); await guardians.disconnect(); await access.disconnect(); await db.$disconnect(); });

test('author, independent reviewer and recipient complete a scanned attachment publication', async ({page}, testInfo) => {
  if (testInfo.project.name === 'chromium') await page.setViewportSize({width: 1440, height: 1000});
  const title = `Scanned trip information ${randomUUID().slice(0, 5)}`;
  await signIn(page, fixture.adminEmail, fixture.adminPassword, 'administration');
  await page.goto('/admin/communication/new');
  await page.getByLabel('Subject').fill(title);
  await page.getByLabel('Message').fill('Review the attached fictional trip information.');
  await page.getByRole('button', {name: 'Save draft'}).click();
  await expect(page.getByText('Save this draft to establish its protected owner')).toHaveCount(0);
  await page.locator('input[type=file]').setInputFiles({name: 'fictional-trip-information.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7\nSynthetic VSchool attachment only.')});
  await expect(page.getByText(/passed the configured scanner and is linked/)).toBeVisible({timeout: 30000});
  await expect(page.getByText('fictional-trip-information.pdf', {exact: true})).toBeVisible();
  await page.screenshot({path: `${evidence}/author-ready-${testInfo.project.name}.png`, fullPage: true});
  await page.getByRole('button', {name: /Save and continue/}).click();
  await expect(page.getByRole('heading', {name: 'Review exact revision'})).toBeFocused();
  await page.getByRole('button', {name: /Continue/}).click();
  await page.getByRole('button', {name: 'Submit for review'}).click();
  await expect(page.getByRole('heading', {name: 'Notice awaiting review'})).toBeVisible();

  await signIn(page, fixture.reviewerEmail, fixture.reviewerPassword, 'leadership');
  await page.goto('/leadership/notices/review');
  await page.getByRole('row').filter({hasText: title}).getByRole('link', {name: 'Review'}).click();
  await expect(page.getByText('fictional-trip-information.pdf', {exact: true})).toBeVisible();
  await page.screenshot({path: `${evidence}/review-${testInfo.project.name}.png`, fullPage: true});
  await page.getByRole('button', {name: /Continue/}).click();
  await page.getByRole('button', {name: /Continue/}).click();
  await page.getByRole('button', {name: 'Confirm approve'}).click();
  await expect(page.getByText('The exact revision is approved.')).toBeVisible();

  await signIn(page, fixture.adminEmail, fixture.adminPassword, 'administration');
  await page.goto('/admin/communication');
  await page.getByRole('row').filter({hasText: title}).getByRole('link', {name: 'Publish'}).click();
  await page.getByRole('button', {name: 'Publish approved revision'}).click();
  await expect(page.getByRole('heading', {name: 'Notice published'})).toBeVisible();

  await signIn(page, fixture.parentEmail, fixture.parentPassword, 'family');
  await page.goto('/family/notices');
  await page.locator('.family-notice-row').filter({hasText: title}).getByRole('link', {name: 'Read notice'}).click();
  const download = page.waitForEvent('download');
  await page.getByRole('link', {name: 'Download'}).click();
  expect((await download).suggestedFilename()).toBe('fictional-trip-information.pdf');
  await page.screenshot({path: `${evidence}/recipient-${testInfo.project.name}.png`, fullPage: true});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto(pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href);
  await page.evaluate(() => {(window as unknown as {WorkflowReview: {read: (id: string) => void}}).WorkflowReview.read('LEA-32');});
  await expect(page.getByRole('heading', {name: 'Prepare a targeted school notice'})).toBeVisible();
  await page.screenshot({path: `${evidence}/reference-${testInfo.project.name}.png`, fullPage: true});
});
