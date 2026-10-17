import {randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {expect,test,type Page} from '@playwright/test';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createAcademicServices} from '../../backend/composition/academics';
import {createCoordinationServices} from '../../backend/composition/coordination';
import {createReportingServices} from '../../backend/composition/reporting';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {schoolDate} from '../../backend/modules/attendance/domain/schedule';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated weekly-review browser database required');
const released=['academic_core','attendance','staff_core','student_core'] as const;
const operator={operatorId:randomUUID(),verified:true as const};
const access=createAccessServices({databaseUrl:url});
const academics=createAcademicServices({databaseUrl:url,releasedModules:released});
const coordination=createCoordinationServices({databaseUrl:url,releasedModules:released,mode:'synthetic'});
const reporting=createReportingServices({databaseUrl:url,releasedModules:released,snapshotMode:'synthetic'});
const tenancy=createTenancyServices({databaseUrl:url,releasedModules:released});
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const school={...schoolInput(),organizationName:`Weekly review ${randomUUID().slice(0,6)}`,schoolName:'Riverside School'};
const evidence='docs/evidence/principal-lea-07-weekly-review-2026-10-17';
let scope:Awaited<ReturnType<typeof access.provisionSchool>>;
let principal:{accountId:string;tokenVersion:number};
let coordinator:Awaited<ReturnType<typeof activeStaffFixture>>;
let requestId='';
let snapshotId='';
let date='';

const localInstant=(day:string,time:string,timezone='Asia/Kolkata')=>{
 const [year,month,dateValue]=day.split('-').map(Number),[hour,minute]=time.split(':').map(Number),target=Date.UTC(year!,month!-1,dateValue!,hour!,minute!);
 let guess=target;
 for(let index=0;index<3;index++){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(guess)).filter(part=>part.type!=='literal').map(part=>[part.type,Number(part.value)])),seen=Date.UTC(parts.year!,parts.month!-1,parts.day!,parts.hour!,parts.minute!);guess+=target-seen;}
 return new Date(guess);
};

test.describe.configure({mode:'serial'});
test.setTimeout(300000);
test.beforeAll(async()=>{
 mkdirSync(evidence,{recursive:true});
 scope=await access.provisionSchool(school,operator);principal={accountId:scope.accountId,tokenVersion:1};
 await access.institutionOperation({kind:'SetBranchMembership',organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN','PRINCIPAL'],expectedVersion:1,key:randomUUID(),reason:'Synthetic weekly-review Principal authority'},operator);
 await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:scope.organizationId,accountId:scope.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic weekly-review module setup'},operator);
 for(const moduleId of released)await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:scope.organizationId,actorAccountId:scope.accountId,moduleId,state:'ACTIVE',startsAt:'2026-01-01T00:00:00.000Z',endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic weekly-review entitlement'});
 const preview=await tenancy.preview(principal,scope.organizationId,scope.schoolId,['attendance']);
 await tenancy.confirm(principal,scope.organizationId,scope.schoolId,{enabled:['attendance'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Synthetic weekly-review activation'});
 date=schoolDate(new Date(Date.now()-86_400_000),'Asia/Kolkata');
 const year=await academics.createYear(principal,scope.organizationId,scope.schoolId,{code:`WR${randomUUID().slice(0,6)}`,name:'Weekly review year',startsOn:'2026-04-01',endsOn:'2027-04-01',key:randomUUID(),reason:'Synthetic weekly review'});
 await academics.publishCalendar(principal,scope.organizationId,scope.schoolId,year.calendarId,{expectedVersion:1,teachingWeekdays:[1,2,3,4,5,6,7],exceptions:[],key:randomUUID(),reason:'Synthetic weekly review'});
 await academics.transitionYear(principal,scope.organizationId,scope.schoolId,year.id,{expectedVersion:1,target:'OPEN',key:randomUUID(),reason:'Synthetic weekly review'});
 const grade=await academics.createGrade(principal,scope.organizationId,scope.schoolId,{code:`WR${randomUUID().slice(0,5)}`,name:'Grade 6',key:randomUUID(),reason:'Synthetic weekly review'}),subject=await academics.createSubject(principal,scope.organizationId,scope.schoolId,{code:`WR${randomUUID().slice(0,5)}`,name:'Mathematics',key:randomUUID(),reason:'Synthetic weekly review'}),section=await academics.createSection(principal,scope.organizationId,scope.schoolId,{yearId:year.id,gradeId:grade.id,campusId:null,code:'A',name:'Grade 6 A',key:randomUUID(),reason:'Synthetic weekly review'}),offering=await academics.create(principal,scope.organizationId,scope.schoolId,{yearId:year.id,sectionId:section.id,subjectId:subject.id,code:'WR-MATH',key:randomUUID(),reason:'Synthetic weekly review'}),calendarRevisionId=(await db.schoolCalendar.findUniqueOrThrow({where:{id:year.calendarId},select:{currentRevisionId:true}})).currentRevisionId!;
 coordinator=await activeStaffFixture(db,scope,['SCHOOL_ADMIN']);
 const person=await db.person.create({data:{id:randomUUID(),organizationId:scope.organizationId,firstName:'Maya',lastName:'Coordinator',version:1,createdAt:new Date()}});
 await db.accountPersonBinding.create({data:{id:randomUUID(),organizationId:scope.organizationId,accountId:coordinator.accountId,personId:person.id,verifiedAt:new Date(),verifiedBy:scope.accountId}});
 for(const capability of ['coordination.create','coordination.assign','coordination.manage'] as const)await coordination.grant(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId,capability});
 await coordination.grant(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:coordinator.accountId,capability:'coordination.work'});
 const session=await db.attendanceSession.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,offeringId:offering.id,schoolDate:new Date(`${date}T00:00:00.000Z`),startsAt:localInstant(date,'00:05'),endsAt:localInstant(date,'00:25'),occurrenceKey:`WEEKLY-${randomUUID()}`,calendarRevisionId,status:'SCHEDULED',version:1,stateUpdatedAt:localInstant(date,'00:05')}});
 requestId=(await coordination.create(principal,scope.organizationId,scope.schoolId,{sessionId:session.id,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Confirm the fictional register with the teaching team.',dueLocal:null,assigneeAccountId:coordinator.accountId,assignmentReason:'Carry this owned follow-up into the weekly review.',key:randomUUID()})).requestId;
 await reporting.grantLeadershipComparison(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId});
 for(const capability of ['GENERATE','SHARE'] as const)await reporting.grantBriefCapability(operator,{organizationId:scope.organizationId,accountId:scope.accountId,capability});
 const now=new Date();snapshotId=(await db.reportingSnapshot.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,actorAccountId:scope.accountId,reportType:'attendance-register-coverage.v1',definitionVersion:'register-coverage.v1',query:{date},schoolDate:new Date(`${date}T00:00:00.000Z`),sourceAsOf:now,capturedAt:now,payload:{asOf:now.toISOString(),schoolDate:date,timezone:'Asia/Kolkata',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',counts:{scheduled:2,due:2,received:1,awaiting:1,notDue:0,cancelled:0},query:{classId:null,status:null,teacherId:null,sort:'due',order:'asc'},filters:{classes:[],teachers:[]},awaiting:{items:[],total:1,nextCursor:null}},payloadHash:'7'.repeat(64),rowCount:1,idempotencyKey:randomUUID(),inputHash:'8'.repeat(64),version:1}})).id;
});
test.afterAll(async()=>{await db.$disconnect();await reporting.disconnect();await coordination.disconnect();await academics.disconnect();await tenancy.disconnect();await access.disconnect();});

async function signIn(page:Page){page.setDefaultTimeout(30000);await page.goto('/sign-in');await page.getByLabel('Email address').fill(school.adminEmail);await page.getByLabel(/^Password/).fill(school.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForURL(url=>url.pathname==='/choose-workspace'||url.pathname==='/leadership');if(new URL(page.url()).pathname==='/choose-workspace'){await page.getByRole('combobox',{name:'Branch'}).selectOption(`${scope.schoolId}:leadership`);await page.getByRole('button',{name:/Continue/}).click();await page.getByRole('button',{name:/Confirm/}).click();}await expect(page).toHaveURL(/\/leadership$/);}

test('saves a source-backed weekly review and recovers the same receipt',async({page},testInfo)=>{
 if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
 await signIn(page);await page.goto('/leadership/reviews/new');
 await expect(page.getByRole('heading',{name:'Run the weekly leadership review'})).toBeVisible();
 await page.getByLabel('Evidence interpretation').fill('One of two due fictional registers is received; the open follow-up remains Coordination-owned.');
 await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByRole('heading',{name:'Evidence and owned actions'})).toBeFocused();
 await page.getByRole('group',{name:'Retained source evidence'}).getByRole('checkbox').check();
 await page.getByRole('group',{name:'Existing owned follow-ups'}).getByRole('checkbox').check();
 await page.getByRole('group',{name:'Explicit portal recipients'}).getByRole('checkbox').check();
 await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByRole('heading',{name:'Review and save'})).toBeFocused();
 await page.screenshot({path:`${evidence}/application-review-${testInfo.project.name}.png`,fullPage:true});
 await page.route('**/api/v1/leadership/briefs',async route=>{if(route.request().method()!=='POST')return route.continue();const committed=await route.fetch();expect(committed.ok()).toBe(true);await committed.body();await route.abort('connectionrefused');},{times:1});
 await page.getByRole('button',{name:'Save weekly review draft'}).click();await expect(page.getByText(/outcome is unknown/i)).toBeVisible();await page.unroute('**/api/v1/leadership/briefs');await page.getByRole('button',{name:'Retry same save'}).click();
 await expect(page).toHaveURL(/\/leadership\/briefs\/[0-9a-f-]+$/);await expect(page.getByRole('heading',{name:'Weekly leadership review'})).toBeVisible();await expect(page.getByRole('heading',{name:'Brief actions'})).toBeVisible();await expect(page.getByRole('link',{name:'Open action'})).toHaveAttribute('href',`/leadership/coordination/${requestId}`);
 await page.getByRole('button',{name:'Finalize revision'}).click();await expect(page.locator('.badge').filter({hasText:'FINALIZED'})).toBeVisible();expect((await db.coordinationRequest.findUniqueOrThrow({where:{id:requestId}})).status).toBe('OPEN');expect(await db.reportingBriefAction.count({where:{requestId}})).toBe(1);
 await page.reload();await expect(page.getByRole('link',{name:'Open action'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`${evidence}/application-result-${testInfo.project.name}.png`,fullPage:true});
 const reference=pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href;await page.goto(reference);await page.evaluate(()=>(window as unknown as {WorkflowReview:{read:(id:string)=>void}}).WorkflowReview.read('LEA-07'));await expect(page.getByRole('heading',{name:'Run the weekly leadership review'})).toBeVisible();await page.screenshot({path:`${evidence}/reference-${testInfo.project.name}.png`,fullPage:true});
 expect(snapshotId).toMatch(/^[0-9a-f-]{36}$/);
});
