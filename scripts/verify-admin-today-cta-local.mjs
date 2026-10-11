import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const credentials=JSON.parse(readFileSync('artifacts/people-02/private-demo.json','utf8'));
const output='docs/evidence/admin-today-cta-2026-10-11';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch();
try{
 const context=await browser.newContext({baseURL,viewport:{width:1440,height:1000}}),page=await context.newPage();
 await page.goto('/sign-in');
 await page.getByRole('textbox',{name:'Email address',exact:true}).fill(credentials.adminEmail);
 await page.getByLabel(/^Password/).fill(credentials.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(/\/admin$/);await page.getByRole('heading',{name:'A clear start to your school day'}).waitFor();
 const metrics=await page.evaluate(()=>{
  const measure=selector=>{const node=document.querySelector(selector),style=getComputedStyle(node),box=node.getBoundingClientRect();return {width:box.width,height:box.height,padding:style.padding,gap:style.gap,borderColor:style.borderColor,borderRadius:style.borderRadius,background:style.backgroundColor,color:style.color,fontSize:style.fontSize,fontWeight:style.fontWeight,lineHeight:style.lineHeight,iconPath:node.querySelector('path')?.getAttribute('d')};};
  return {header:measure('.page-heading .btn'),attention:measure('.dashboard-work-row .btn'),quick:measure('.dashboard-quick-list>a'),overflow:document.documentElement.scrollWidth>innerWidth};
 });
 for(const [name,value] of Object.entries({header:metrics.header,attention:metrics.attention,quick:metrics.quick})){
  assert.equal(value.height,40,`${name} height`);assert.equal(value.padding,'8px 14px',`${name} padding`);assert.equal(value.gap,'8px',`${name} gap`);assert.equal(value.borderColor,'rgb(223, 230, 223)',`${name} border`);assert.equal(value.borderRadius,'8px',`${name} radius`);assert.equal(value.background,'rgb(255, 255, 255)',`${name} background`);assert.equal(value.color,'rgb(33, 58, 50)',`${name} text`);assert.equal(value.fontSize,'13px',`${name} font size`);assert.equal(value.fontWeight,'550',`${name} font weight`);
 }
 assert.equal(metrics.header.iconPath,'m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z');
 assert.equal(metrics.attention.iconPath,'M4 12h16m-6-6 6 6-6 6');assert.equal(metrics.quick.iconPath,'M4 12h16m-6-6 6 6-6 6');assert.equal(metrics.overflow,false);
 await page.screenshot({path:`${output}/today-desktop.png`,fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('heading',{name:'A clear start to your school day'}).waitFor();
 for(const selector of ['.page-heading .btn','.dashboard-work-row .btn','.dashboard-quick-list>a'])assert.equal(await page.locator(selector).first().evaluate(node=>node.getBoundingClientRect().height),44,`${selector} mobile height`);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:`${output}/today-mobile.png`,fullPage:true});
 writeFileSync(`${output}/measurements.json`,`${JSON.stringify({checkedAt:new Date().toISOString(),baseURL,desktop:{width:1440,height:1000},mobile:{width:390,height:844},metrics},null,2)}\n`);
 await context.close();console.log(`Administrator Today CTA verification passed; evidence: ${output}`);
}finally{await browser.close();}
