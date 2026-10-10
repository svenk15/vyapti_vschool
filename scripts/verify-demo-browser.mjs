import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const people=JSON.parse(readFileSync('artifacts/people-02/private-demo.json','utf8'));
const attendance=JSON.parse(readFileSync('artifacts/attendance-01/private-demo.json','utf8'));
const required=(value,name)=>{if(typeof value!=='string'||!value)throw new Error(`Missing ${name} in private demo fixtures.`);return value;};
const recommendedDate=required(attendance.recommendedDate,'recommendedDate');
const recommendedSessionIds=attendance.recommendedSessionIds;
if(!Array.isArray(recommendedSessionIds)||recommendedSessionIds.some(value=>typeof value!=='string')||recommendedSessionIds.length===0)throw new Error('Missing recommendedSessionIds in private demo fixtures.');
const tomorrow=new Date(`${recommendedDate}T00:00:00.000Z`);tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
const toDate=tomorrow.toISOString().slice(0,10);

async function signIn(page,email,password,expected){
 await page.goto(`${baseURL}/sign-in`);
 await page.getByRole('textbox',{name:'Email address',exact:true}).fill(email);
 await page.getByLabel(/^Password/).fill(password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(expected,{timeout:20_000});
}

const browser=await chromium.launch({headless:true});
const observations=[];
try{
 const adminContext=await browser.newContext({viewport:{width:1440,height:1000}}),admin=await adminContext.newPage();
 await signIn(admin,required(people.adminEmail,'adminEmail'),required(people.password,'password'),/\/admin$/);
 for(const [path,heading] of [['/admin',''],['/admin/teachers',''],['/admin/students',''],['/admin/classes',''],['/admin/attendance/sessions','']]){
  const response=await admin.goto(`${baseURL}${path}`);if(!response?.ok())throw new Error(`Admin route ${path} returned ${response?.status()}.`);
  await admin.locator('#main-content').waitFor();
  const titleLocator=admin.locator('h1').first();
  if(await titleLocator.count()===0){
   const diagnostic=path==='/admin/students'?await admin.request.get(`${baseURL}/api/v1/students`):null;
   throw new Error(`Admin route ${path} rendered without a page title at ${admin.url()}: ${(await admin.locator('body').innerText()).slice(0,1000)}${diagnostic?` API ${diagnostic.status()} ${(await diagnostic.text()).slice(0,500)}`:''}`);
  }
  const title=(await titleLocator.textContent())?.trim()??heading;
  observations.push({persona:'administrator',path,title,status:response.status()});
 }
 const reportPath=`/admin/reports/attendance?fromDate=${recommendedDate}&toDate=${toDate}`;
 const reportResponse=await admin.goto(`${baseURL}${reportPath}`);if(!reportResponse?.ok())throw new Error(`Attendance report returned ${reportResponse?.status()}.`);
 await admin.getByRole('heading',{name:'Review and export attendance'}).waitFor();
 const reportLinks=await admin.getByRole('link',{name:'Review session'}).evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
 const reportIds=reportLinks.map(href=>href?.split('/').pop()).filter(Boolean);
 for(const id of recommendedSessionIds)if(!reportIds.includes(id))throw new Error(`Recommended session ${id} is missing from administrator report.`);
 mkdirSync('docs/evidence/ex-13',{recursive:true});
 await admin.screenshot({path:'docs/evidence/ex-13/connected-admin-report.png',fullPage:true});
 observations.push({persona:'administrator',path:reportPath,title:'Review and export attendance',status:reportResponse.status(),recommendedSessionsFound:recommendedSessionIds.length});
 await adminContext.close();

 const teacherContext=await browser.newContext({viewport:{width:1440,height:1000}}),teacher=await teacherContext.newPage();
 await signIn(teacher,required(people.teacherEmail,'teacherEmail'),required(people.teacherPassword,'teacherPassword'),/\/account$/);
 const todayResponse=await teacher.goto(`${baseURL}/teacher/today`);if(!todayResponse?.ok())throw new Error(`Teacher day returned ${todayResponse?.status()}.`);
 await teacher.getByLabel('School date').fill(recommendedDate);
 await teacher.getByRole('button',{name:'Refresh',exact:true}).click();
 const list=teacher.locator('.teacher-session-list');await list.waitFor({timeout:20_000});
 const teacherLinks=await list.getByRole('link',{name:'Session details'}).evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
 const teacherIds=teacherLinks.map(href=>href?.split('/').pop()).filter(Boolean);
 for(const id of recommendedSessionIds)if(!teacherIds.includes(id))throw new Error(`Recommended session ${id} is missing from teacher day.`);
 const detailResponse=await teacher.goto(`${baseURL}/teacher/sessions/${recommendedSessionIds[0]}`);if(!detailResponse?.ok())throw new Error(`Teacher session detail returned ${detailResponse?.status()}.`);
 await teacher.getByRole('heading',{name:'Session details'}).waitFor();
 await teacher.goto(`${baseURL}/teacher/today`);await teacher.getByLabel('School date').fill(recommendedDate);await teacher.getByRole('button',{name:'Refresh',exact:true}).click();await list.waitFor({timeout:20_000});
 await teacher.screenshot({path:'docs/evidence/ex-13/connected-teacher-day.png',fullPage:true});
 observations.push({persona:'teacher',path:'/teacher/today',title:'My teaching day',status:todayResponse.status(),recommendedDate,recommendedSessionsFound:recommendedSessionIds.length,detailStatus:detailResponse.status()});
 await teacherContext.close();
 const result={checkedAt:new Date().toISOString(),baseURL,credentialsSource:'artifacts/people-02/private-demo.json',scenarioSource:'artifacts/attendance-01/private-demo.json',observations};
 writeFileSync('docs/evidence/ex-13/browser-verification.json',`${JSON.stringify(result,null,2)}\n`);
 console.log(`Verified connected administrator and teacher demo (${recommendedSessionIds.length} sessions on ${recommendedDate}).`);
}finally{await browser.close();}
