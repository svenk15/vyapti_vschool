import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const outputDir=process.env.VSCHOOL_PERSONA_OUTPUT??'artifacts/must-have-release';
const capture=process.env.VSCHOOL_CAPTURE_PERSONAS==='1';

function privateFixture(path,fields){
 if(!existsSync(path))throw new Error(`Missing private fixture: ${path}. Run pnpm demo:seed.`);
 const value=JSON.parse(readFileSync(path,'utf8'));
 for(const field of fields)if(typeof value[field]!=='string'||!value[field])throw new Error(`Private fixture ${path} is missing ${field}.`);
 return value;
}

const people=privateFixture('artifacts/people-02/private-demo.json',['adminEmail','password','teacherEmail','teacherPassword']);
const family=privateFixture('artifacts/guardians-01/private-demo.json',['parentEmail','parentPassword']);
const student=privateFixture('artifacts/students-portal/private-demo.json',['studentEmail','studentPassword']);
const personas=[
 {name:'administrator',email:people.adminEmail,password:people.password,workspace:'School administration',path:'/admin',reviewRoutes:['/admin/academics','/admin/students','/admin/communication']},
 {name:'principal',email:people.adminEmail,password:people.password,workspace:'Principal leadership',path:'/leadership',reviewRoutes:['/leadership/assessments','/leadership/coordination']},
 {name:'teacher',email:people.teacherEmail,password:people.teacherPassword,workspace:'Teaching',path:'/teacher/today',reviewRoutes:['/teacher/learning','/teacher/assessments']},
 {name:'parent',email:family.parentEmail,password:family.parentPassword,path:'/family',selector:'Switch child',minimumContexts:2},
 {name:'student',email:student.studentEmail,password:student.studentPassword,path:'/student',selector:'Switch school context',minimumContexts:2},
];
const viewports=[['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]];
const results=[];
mkdirSync(outputDir,{recursive:true,mode:0o700});

const browser=await chromium.launch({headless:true});
try{
 for(const [viewportName,viewport] of viewports){
  for(const persona of personas){
   const context=await browser.newContext({viewport}),page=await context.newPage();
   try{
    await page.goto(`${baseURL}/sign-in`,{waitUntil:'networkidle'});
    await page.getByLabel('Email address').fill(persona.email);
    await page.getByRole('textbox',{name:'Password'}).fill(persona.password);
    await page.getByRole('button',{name:'Sign in',exact:true}).click();
    if(persona.workspace){
     await page.waitForURL('**/choose-workspace',{timeout:20_000});
     const labels=await page.locator('select option').allTextContents(),label=labels.find(value=>value.includes(persona.workspace));
     if(!label)throw new Error(`Expected ${persona.workspace} option was not authorized.`);
     await page.getByLabel('Branch').selectOption({label});
     await page.getByRole('button',{name:/Continue/}).click();
     await page.getByRole('button',{name:/Confirm/}).click();
    }
    await page.waitForURL(url=>url.pathname===persona.path,{timeout:20_000});
    await page.locator('h1').first().waitFor();
    let contextCount=null;
    if(persona.selector){
     const selector=page.getByLabel(persona.selector);
     await selector.waitFor();
     contextCount=await selector.locator('option').count();
     if(contextCount<(persona.minimumContexts??1))throw new Error(`${persona.name} context fixture is incomplete.`);
    }
    const shell=await page.evaluate(()=>{
     const sidebar=document.querySelector('.portal-sidebar'),nav=document.querySelector('.portal-nav-scroll'),footer=document.querySelector('.portal-sidebar-footer');
     const visibleRows=[...document.querySelectorAll('.portal-nav-group a,.portal-nav-disclosure')].filter(node=>node.getClientRects().length>0).map(node=>node.getBoundingClientRect().height);
     const footerRect=footer?.getBoundingClientRect();
     return {rootOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,fontFamily:getComputedStyle(document.body).fontFamily,sidebarVisible:!!sidebar&&sidebar.getClientRects().length>0,navOverflow:nav?getComputedStyle(nav).overflowY:null,minimumVisibleRow:visibleRows.length?Math.min(...visibleRows):null,footerVisible:!!footerRect&&footerRect.height>0&&footerRect.top<innerHeight&&footerRect.bottom<=innerHeight+1};
    });
    const presentation=await page.evaluate(()=>{const grid=document.querySelector('.landing-grid'),summary=document.querySelector('.landing-summary'),actions=[...document.querySelectorAll('.landing-quick-list>a')],calendar=document.querySelector('.landing-calendar');return {gridColumns:grid?getComputedStyle(grid).gridTemplateColumns:null,summaryItems:summary?.children.length??0,summaryHeight:summary?.getBoundingClientRect().height??null,actionLinks:actions.map(node=>({label:node.textContent?.trim().replace(/\s+/g,' ')??'',href:node.getAttribute('href')})),calendarUnavailable:calendar?.textContent?.includes('Calendar unavailable')??false,technicalCopy:[...document.querySelectorAll('main')].some(node=>/other school areas|your dashboard shows the school information/i.test(node.textContent??''))};});
    if(shell.rootOverflow)throw new Error(`${persona.name} has horizontal document overflow.`);
    if(!shell.fontFamily.toLowerCase().includes('inter'))throw new Error(`${persona.name} is not using Inter.`);
    if(viewportName==='desktop'){
     if(!shell.sidebarVisible||shell.navOverflow!=='auto'||(shell.minimumVisibleRow??0)<44||!shell.footerVisible)throw new Error(`${persona.name} desktop navigation geometry is invalid.`);
    }else{
     const menu=page.getByRole('button',{name:/^Open(?: Parent| Student)? navigation$/}).first();
     await menu.click();
     const dialog=page.locator('.portal-sidebar[role="dialog"]');
     await dialog.waitFor();
     await page.waitForTimeout(100);
     const mobileShell=await page.evaluate(()=>{const footer=document.querySelector('.portal-sidebar[role="dialog"] .portal-sidebar-footer')?.getBoundingClientRect();return {focusInside:!!document.activeElement?.closest('.portal-sidebar[role="dialog"]'),footerVisible:!!footer&&footer.height>0&&footer.top<innerHeight&&footer.bottom<=innerHeight+1};});
     if(!mobileShell.focusInside||!mobileShell.footerVisible)throw new Error(`${persona.name} mobile navigation focus or footer is invalid: ${JSON.stringify(mobileShell)}`);
     if(capture)await page.screenshot({path:`${outputDir}/${persona.name}-mobile-navigation.png`,fullPage:true});
     await page.keyboard.press('Escape');
     const menuHandle=await menu.elementHandle();await page.waitForFunction(node=>document.activeElement===node,menuHandle,{timeout:2_000}).catch(()=>{throw new Error(`${persona.name} mobile navigation did not return focus.`);});
     Object.assign(shell,{mobile:mobileShell});
    }
    const expectedSummaryItems=persona.name==='administrator'||persona.name==='parent'?3:4;
    if(presentation.summaryItems!==expectedSummaryItems||presentation.technicalCopy)throw new Error(`${persona.name} landing composition is invalid: ${JSON.stringify(presentation)}`);
    if(persona.name==='principal'){
     const hrefs=presentation.actionLinks.map(item=>item.href);
     if(!hrefs.some(href=>href?.match(/^\/leadership\/attendance\?date=\d{4}-\d{2}-\d{2}$/))||!hrefs.includes('/leadership/context')||!hrefs.includes('/leadership/account'))throw new Error(`Principal quick access is invalid: ${JSON.stringify(presentation.actionLinks)}`);
    }
    if(persona.name==='parent'&&presentation.actionLinks.length<3)throw new Error(`Parent dashboard actions are incomplete.`);
    if(['administrator','principal','teacher','parent','student'].includes(persona.name)){
     const trackCount=presentation.gridColumns?.split(' ').length??0;
     if(viewportName==='desktop'&&trackCount<2)throw new Error(`${persona.name} dashboard did not render two desktop columns.`);
     if(viewportName==='mobile'&&trackCount!==1)throw new Error(`${persona.name} dashboard did not stack on mobile.`);
    }
    if(capture){
     await page.screenshot({path:`${outputDir}/${persona.name}-${viewportName}.png`,fullPage:true});
     if(viewportName==='desktop'){
      for(let remaining=20;remaining>0;remaining--){const disclosure=page.locator('.portal-nav-disclosure[aria-expanded="false"]').first();if(!await disclosure.count())break;await disclosure.click();}
      await page.screenshot({path:`${outputDir}/${persona.name}-desktop-navigation.png`,fullPage:true});
     }
    }
    const routeChecks=[],reviewHrefs=[...(persona.reviewRoutes??[]),...(['parent','student'].includes(persona.name)?presentation.actionLinks.map(item=>item.href).filter(Boolean):[])];
    if(viewportName==='desktop'){for(const href of reviewHrefs){const probe=await context.newPage(),response=await probe.goto(new URL(href,baseURL).toString(),{waitUntil:'domcontentloaded'}),pathname=new URL(probe.url()).pathname,heading=(await probe.locator('h1').first().textContent())?.trim()??'',serviceUnavailable=await probe.getByText('SERVICE_UNAVAILABLE',{exact:true}).count()>0;if(!response?.ok()||['/sign-in','/choose-workspace','/family/access-unavailable','/student/access-unavailable'].includes(pathname)||!heading||serviceUnavailable)throw new Error(`${persona.name} review route failed: ${JSON.stringify({href,status:response?.status(),pathname,heading,serviceUnavailable})}`);routeChecks.push({href,status:response.status(),pathname,heading});await probe.close();}}
    results.push({persona:persona.name,viewport:viewportName,path:persona.path,contextCount,shell,presentation,routeChecks,ok:true});
   } finally {await context.close();}
  }
 }
 const recovery=await browser.newPage({viewport:{width:390,height:844}});
 await recovery.goto(`${baseURL}/forgot-password`,{waitUntil:'networkidle'});
 await recovery.locator('h1').first().waitFor();
 results.push({persona:'public-recovery',viewport:'mobile',path:'/forgot-password',contextCount:null,ok:true});
 await recovery.close();
} finally {await browser.close();}

const report={checkedAt:new Date().toISOString(),baseURL,buildId:existsSync('.next/BUILD_ID')?readFileSync('.next/BUILD_ID','utf8').trim():null,results};
writeFileSync(`${outputDir}/persona-verification.json`,`${JSON.stringify(report,null,2)}\n`,{mode:0o600});
console.log(`Verified ${results.length} persona/recovery states. Private report: ${outputDir}/persona-verification.json`);
