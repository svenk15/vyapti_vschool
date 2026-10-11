import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const credentials=JSON.parse(readFileSync('artifacts/people-02/private-demo.json','utf8'));
const output='docs/evidence/admin-shared-shell-2026-10-11';
mkdirSync(output,{recursive:true});

const browser=await chromium.launch();
try{
 const context=await browser.newContext({baseURL,viewport:{width:1440,height:1000}}),page=await context.newPage();
 await page.goto('/sign-in');
 await page.getByRole('textbox',{name:'Email address',exact:true}).fill(credentials.adminEmail);
 await page.getByLabel(/^Password/).fill(credentials.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(/\/admin$/);
 const routes=[['attendance','/admin/attendance/sessions'],['students','/admin/students'],['staff','/admin/users']];
 for(const [name,route] of routes){
  await page.goto(route);await page.getByRole('heading',{level:1}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} desktop overflow`);
  await page.screenshot({path:`${output}/${name}-desktop.png`,fullPage:true});
 }
 await page.goto('/admin/attendance/sessions');
 const measurements=await page.evaluate(()=>{
  const style=selector=>getComputedStyle(document.querySelector(selector));
  const rect=selector=>{const {width,height}=document.querySelector(selector).getBoundingClientRect();return {width,height};};
  const inactive=[...document.querySelectorAll('.portal-nav-group a')].find(node=>!node.hasAttribute('aria-current'));
  return {
   sidebar:{...rect('.portal-sidebar'),background:style('.portal-sidebar').backgroundColor},
   brand:{...rect('.portal-brand'),fontSize:style('.portal-brand').fontSize,fontWeight:style('.portal-brand').fontWeight,gap:style('.portal-brand').gap},
   brandMark:rect('.portal-sidebar .portal-brand-mark'),
   heading:{fontSize:style('h1').fontSize,fontWeight:style('h1').fontWeight,lineHeight:style('h1').lineHeight},
   inactiveNav:{fontSize:getComputedStyle(inactive).fontSize,fontWeight:getComputedStyle(inactive).fontWeight,minHeight:getComputedStyle(inactive).minHeight},
   activeNav:{fontWeight:style('.portal-nav-group a[aria-current="page"]').fontWeight,iconPath:document.querySelector('.portal-nav-group a[aria-current="page"] path').getAttribute('d')},
  };
 });
 assert.deepEqual(measurements.sidebar,{width:240,height:1000,background:'rgb(23, 59, 50)'});
 assert.equal(measurements.brand.fontSize,'24px');assert.equal(measurements.brand.fontWeight,'600');assert.equal(measurements.brand.gap,'12px');
 assert.deepEqual(measurements.brandMark,{width:33,height:33});
 assert.deepEqual(measurements.heading,{fontSize:'28px',fontWeight:'650',lineHeight:'35px'});
 assert.deepEqual(measurements.inactiveNav,{fontSize:'13px',fontWeight:'400',minHeight:'42px'});
 assert.equal(measurements.activeNav.fontWeight,'600');assert.equal(measurements.activeNav.iconPath,'m5 12 4 4L19 6');
 writeFileSync(`${output}/measurements.json`,`${JSON.stringify({checkedAt:new Date().toISOString(),baseURL,viewport:{width:1440,height:1000},measurements},null,2)}\n`);
 await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('button',{name:'Open navigation'}).click();
 await page.getByRole('navigation',{name:'School administration'}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'attendance mobile overflow');
 await page.screenshot({path:`${output}/attendance-mobile-navigation.png`,fullPage:true});
 await context.close();
 console.log(`Shared Administrator shell verified; evidence: ${output}`);
}finally{await browser.close();}
