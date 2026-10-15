import {expect,test,type Page} from '@playwright/test';
import {randomBytes,randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAccessServices} from '../../backend/composition/access';
import {createEventsServices} from '../../backend/composition/events';
import {createGuardiansServices} from '../../backend/composition/guardians';
import {createStudentPortalServices} from '../../backend/composition/student-portal';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Events E2E database required');
const modules=['academic_core','communication','family','staff_core','student_core','timetable'] as const;
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const access=createAccessServices({databaseUrl:url});
const events=createEventsServices({databaseUrl:url,releasedModules:modules});
const operator={operatorId:randomUUID(),verified:true as const};
let parentToken='',studentToken='';
const guardians=createGuardiansServices({databaseUrl:url,releasedModules:modules,emailSender:{sendFamilyInvite:async input=>{parentToken=input.token;return {ok:true};}}});
const students=createStudentPortalServices({databaseUrl:url,releasedModules:modules,emailSender:{sendStudentInvite:async input=>{studentToken=input.token;return {ok:true};}}});
let fixture:{adminEmail:string;adminPassword:string;parentEmail:string;parentPassword:string;studentEmail:string;studentPassword:string;sectionLabel:string};

async function signIn(page:Page,email:string,password:string){
 await page.context().clearCookies();
 await page.goto('/sign-in');
 await page.getByLabel('Email address').fill(email);
 await page.getByLabel(/^Password/).fill(password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page).toHaveURL(/\/(?:admin|family|student)(?:\/|$)/,{timeout:15000});
}

test.beforeAll(async()=>{
 const label=randomUUID().slice(0,6).toUpperCase(),input={...schoolInput(),organizationName:`Calendar Trust ${label}`,schoolName:`Calendar School ${label}`},school=await access.provisionSchool(input,operator),admin={accountId:school.accountId,tokenVersion:1},now=new Date(),from=new Date(now),until=new Date(now);
 from.setUTCFullYear(from.getUTCFullYear()-1);until.setUTCFullYear(until.getUTCFullYear()+1);
 await db.organization.update({where:{id:school.organizationId},data:{trustMode:'EMAIL'}});
 for(const moduleId of modules){
  await db.organizationEntitlement.create({data:{id:randomUUID(),organizationId:school.organizationId,moduleId,state:'ACTIVE',startsAt:from,endsAt:null,limits:{},manifestVersion:1,version:1}});
  await db.branchActivation.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,moduleId,state:'ACTIVE',version:1,enabledAt:now}});
 }
 await guardians.grantManager(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId});
 await students.grantManager(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId});
 await events.grantPublisher(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId});
 const person=await db.person.create({data:{id:randomUUID(),organizationId:school.organizationId,firstName:'Asha',lastName:'Calendar',version:1,createdAt:now}}),student=await db.student.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,personId:person.id,admissionNumber:`CAL-${label}`,admittedOn:from,status:'ACTIVE',version:1,createdAt:now}}),year=await db.academicYear.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,code:`CY${label}`,name:'Calendar year',startsOn:from,endsOn:until,status:'OPEN',version:1}}),grade=await db.gradeLevel.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,code:`CG${label}`,name:'Grade 6',sortOrder:6,active:true,version:1}}),section=await db.section.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,yearId:year.id,gradeId:grade.id,code:`CA${label}`,name:'Section A',active:true,version:1}}),enrollment=await db.enrollment.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,studentId:student.id,yearId:year.id,validFrom:from,validTo:until,version:1}});
 await db.sectionPlacement.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,enrollmentId:enrollment.id,yearId:year.id,sectionId:section.id,validFrom:from,validTo:until}});
 const weekDate=new Date(now),weekDay=weekDate.getUTCDay()||7;weekDate.setUTCHours(0,0,0,0);weekDate.setUTCDate(weekDate.getUTCDate()-(weekDay-1));const friday=new Date(weekDate),saturday=new Date(weekDate);friday.setUTCDate(friday.getUTCDate()+4);saturday.setUTCDate(saturday.getUTCDate()+5);
 const periodKey=randomUUID(),pattern=await db.academicDayPattern.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,academicYearId:year.id,name:'Calendar teaching week',teachingDays:[1,2,3,4,5,6],state:'PUBLISHED',version:1,createdAt:now,createdByAccountId:school.accountId,updatedAt:now,periods:{create:{id:randomUUID(),periodKey,label:'Morning lesson',kind:'LESSON',startLocal:new Date('1970-01-01T09:00:00.000Z'),endLocal:new Date('1970-01-01T09:40:00.000Z'),position:1}}}}),calendarId=randomUUID(),calendarRevisionId=randomUUID(),draftId=randomUUID();
 await db.schoolCalendar.create({data:{id:calendarId,organizationId:school.organizationId,schoolId:school.schoolId,yearId:year.id,version:1}});
 await db.calendarRevision.create({data:{id:calendarRevisionId,organizationId:school.organizationId,schoolId:school.schoolId,calendarId,number:1,teachingWeekdays:[1,2,3,4,5],publishedAt:now,publishedBy:school.accountId}});
 await db.calendarException.createMany({data:[{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,revisionId:calendarRevisionId,campusId:null,onDate:friday,isTeachingDay:false,label:'Local closure'},{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,revisionId:calendarRevisionId,campusId:null,onDate:saturday,isTeachingDay:true,label:'Extra teaching day'}]});
 await db.schoolCalendar.update({where:{id:calendarId},data:{currentRevisionId:calendarRevisionId}});
 await db.timetableRevision.create({data:{id:draftId,organizationId:school.organizationId,schoolId:school.schoolId,academicYearId:year.id,dayPatternId:pattern.id,revisionNo:1,state:'DRAFT',effectiveFrom:from,version:1,createdAt:now,createdByAccountId:school.accountId,updatedAt:now}});
 await db.timetableRevision.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,academicYearId:year.id,dayPatternId:pattern.id,revisionNo:2,state:'PUBLISHED',effectiveFrom:from,effectiveUntil:null,validatedUntil:until,publishedAt:now,publishedByAccountId:school.accountId,basedOnRevisionId:draftId,basedOnDraftVersion:1,sourceCommandId:randomUUID(),calendarRevisionId,contentSnapshot:{schemaVersion:1},version:1,createdAt:now,createdByAccountId:school.accountId,updatedAt:now}});
 const parentEmail=`parent-${randomUUID()}@example.test`,parentPassword=randomBytes(24).toString('base64url'),studentEmail=`student-${randomUUID()}@example.test`,studentPassword=randomBytes(24).toString('base64url');
 parentToken='';
 const parentAccess=await guardians.authorize(admin,{organizationId:school.organizationId,schoolId:school.schoolId,studentId:student.id,displayName:'Kavya Calendar',email:parentEmail,noticeRead:false,confirmed:true,key:randomUUID(),requestId:randomUUID()});
 await guardians.accept(null,{token:parentToken,initialPassword:parentPassword,confirmation:parentPassword,requestId:randomUUID()});
 await guardians.setCalendarPurpose(admin,{organizationId:school.organizationId,schoolId:school.schoolId,accessId:parentAccess.accessId,expectedVersion:parentAccess.version+1,enabled:true,key:randomUUID(),requestId:randomUUID()});
 studentToken='';
 const studentAccess=await students.authorize(admin,{organizationId:school.organizationId,schoolId:school.schoolId,studentId:student.id,email:studentEmail,noticeRead:false,confirmed:true,key:randomUUID(),requestId:randomUUID()});
 await students.accept(null,{token:studentToken,initialPassword:studentPassword,confirmation:studentPassword,requestId:randomUUID()});
 await students.setCalendarPurpose(admin,{organizationId:school.organizationId,schoolId:school.schoolId,accessId:studentAccess.accessId,expectedVersion:studentAccess.version+1,enabled:true,key:randomUUID(),requestId:randomUUID()});
 fixture={adminEmail:input.adminEmail,adminPassword:input.password,parentEmail,parentPassword,studentEmail,studentPassword,sectionLabel:'Grade 6 · Section A'};
 mkdirSync('docs/evidence/events-student-agenda-stw-31-2026-10-16',{recursive:true});
 mkdirSync('docs/evidence/parent-combined-calendar-par-18-2026-10-16',{recursive:true});
 mkdirSync('docs/evidence/parent-calendar-closures-par-18-2026-10-16',{recursive:true});
});

test.afterAll(async()=>{await students.disconnect();await guardians.disconnect();await events.disconnect();await access.disconnect();await db.$disconnect();});

test('publisher creates an exact class event and Parent and Student read the frozen publication',async({page},testInfo)=>{
 if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
 await signIn(page,fixture.adminEmail,fixture.adminPassword);
 await page.goto('/admin/events');
 await expect(page.getByRole('heading',{name:'Calendar & events'})).toBeVisible();
 await page.getByRole('link',{name:'Create event'}).click();
 await expect(page.getByRole('heading',{name:'Create calendar event'})).toBeVisible();
 await page.getByLabel('Title').fill('Class learning showcase');
 await page.getByLabel('Short description').fill('Families and Students can review this term’s project displays.');
 await page.getByLabel('Category').selectOption('CLASS_EVENT');
 await page.getByLabel('Starts on').fill('2026-10-22');
 await page.getByLabel('Ends on').fill('2026-10-22');
 await page.getByLabel('Audience').selectOption('SECTION');
 await page.getByLabel('Class').selectOption({label:fixture.sectionLabel});
 await page.screenshot({path:`docs/evidence/events-student-agenda-stw-31-2026-10-16/admin-compose-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:/Continue/}).click();
 await expect(page.getByRole('heading',{name:'Review the event'})).toBeFocused();
 await page.getByRole('button',{name:/Continue/}).click();
 await expect(page.getByRole('heading',{name:'Confirm publication'})).toBeFocused();
 await page.getByRole('button',{name:'Publish event'}).click();
 await expect(page).toHaveURL(/\/admin\/events$/);
 const row=page.getByRole('row').filter({hasText:'Class learning showcase'});
 await expect(row).toContainText('PUBLISHED');
 await page.screenshot({path:`docs/evidence/events-student-agenda-stw-31-2026-10-16/admin-published-${testInfo.project.name}.png`,fullPage:true});

 await signIn(page,fixture.parentEmail,fixture.parentPassword);
 if((page.viewportSize()?.width??0)<700)await page.getByRole('button',{name:'Open parent navigation'}).click();
 await page.getByRole('navigation',{name:'Family navigation'}).getByRole('link',{name:'School calendar'}).click();
 await expect(page.getByRole('heading',{name:'School calendar'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Teaching week'})).toBeVisible();
 await expect(page.locator('.family-calendar-day')).toHaveCount(5);
 await expect(page.getByText('Sat',{exact:false})).toBeVisible();
 await expect(page.getByRole('link',{name:'View full timetable'})).toHaveAttribute('href',/week=/);
 await expect(page.getByText('Class learning showcase',{exact:true})).toBeVisible();
 await page.getByLabel('Category').selectOption('CLASS_EVENT');
 await page.getByRole('button',{name:'Apply'}).click();
 await expect(page).toHaveURL(/category=CLASS_EVENT/);
 await expect(page.getByText('Class learning showcase',{exact:true})).toBeVisible();
 const exportResponse=await page.request.get(await page.getByRole('link',{name:'Export permitted calendar'}).getAttribute('href')??'');
 expect(exportResponse.ok()).toBeTruthy();
 expect(exportResponse.headers()['content-type']).toContain('text/calendar');
 const calendar=await exportResponse.text();expect(calendar).toContain('SUMMARY:Class learning showcase');expect(calendar).not.toContain('Kavya Calendar');
 await page.screenshot({path:`docs/evidence/events-student-agenda-stw-31-2026-10-16/parent-calendar-${testInfo.project.name}.png`,fullPage:true});
 await page.screenshot({path:`docs/evidence/parent-combined-calendar-par-18-2026-10-16/application-${testInfo.project.name}.png`,fullPage:true});
 await page.screenshot({path:`docs/evidence/parent-calendar-closures-par-18-2026-10-16/application-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('link',{name:/View event/}).click();
 await expect(page.getByRole('heading',{name:'Class learning showcase'})).toBeVisible();
 await expect(page.getByText(fixture.sectionLabel,{exact:true})).toBeVisible();

 await signIn(page,fixture.studentEmail,fixture.studentPassword);
 if((page.viewportSize()?.width??0)<700)await page.getByRole('button',{name:'Open Student navigation'}).click();
 await page.getByRole('navigation',{name:'Student navigation'}).getByRole('link',{name:'School calendar'}).click();
 await expect(page.getByRole('heading',{name:'School calendar'})).toBeVisible();
 await expect(page.getByText('Class learning showcase',{exact:true})).toBeVisible();
 await expect(page.getByText('Class event',{exact:true})).toBeVisible();
 await page.screenshot({path:`docs/evidence/events-student-agenda-stw-31-2026-10-16/student-calendar-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('link',{name:/View event/}).click();
 await expect(page.getByRole('heading',{name:'Class learning showcase'})).toBeVisible();
 await expect(page.getByText(fixture.sectionLabel,{exact:true})).toBeVisible();
});
