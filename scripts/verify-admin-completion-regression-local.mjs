import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const credentials=JSON.parse(readFileSync('artifacts/people-02/private-demo.json','utf8'));
const attendance=JSON.parse(readFileSync('artifacts/attendance-01/private-demo.json','utf8'));
const correction=Object.values(attendance.correctionByDate??{}).at(-1);
const output='docs/evidence/admin-completion-reconciliation-2026-10-11';
mkdirSync(output,{recursive:true});

const browser=await chromium.launch();
try{
  const context=await browser.newContext({baseURL,viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  await page.goto('/sign-in');
  await page.getByRole('textbox',{name:'Email address',exact:true}).fill(credentials.adminEmail);
  await page.getByLabel(/^Password/).fill(credentials.password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.waitForURL(/\/admin$/);
  const routes=[
    ['attendance-lifecycle','/admin/attendance/sessions'],
    ...(correction?.sessionId?[['attendance-correction',`/admin/attendance/sessions/${correction.sessionId}`]]:[]),
    ['attendance-report','/admin/reports/attendance'],
    ['students-directory','/admin/students'],
    ['student-registration','/admin/students/register'],
    ['student-enrollment','/admin/students/enroll'],
    ['staff-access','/admin/users'],
  ];
  const results=[];
  for(const [name,route] of routes){
    await page.goto(route);await page.getByRole('heading',{level:1}).waitFor();
    const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,title:document.querySelector('h1')?.textContent?.trim()??'',sidebarWidth:document.querySelector('.portal-sidebar')?.getBoundingClientRect().width??0}));
    assert.equal(result.overflow,false,`${name} desktop overflow`);assert.equal(result.sidebarWidth,240,`${name} sidebar width`);
    await page.screenshot({path:`${output}/${name}-desktop.png`,fullPage:true});
    results.push({name,route,viewport:{width:1440,height:1000},...result});
  }
  await page.setViewportSize({width:390,height:844});await page.goto('/admin/students/enroll');await page.getByRole('heading',{level:1}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'student enrollment mobile overflow');
  await page.screenshot({path:`${output}/student-enrollment-mobile.png`,fullPage:true});
  writeFileSync(`${output}/browser-results.json`,`${JSON.stringify({checkedAt:new Date().toISOString(),baseURL,results},null,2)}\n`);
  await context.close();
  console.log(`Administrator completion regression verified; evidence: ${output}`);
}finally{await browser.close();}
