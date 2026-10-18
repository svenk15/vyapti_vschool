import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const outputDir='artifacts/must-have-release';
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
 {name:'administrator',email:people.adminEmail,password:people.password,workspace:'School administration',path:'/admin'},
 {name:'principal',email:people.adminEmail,password:people.password,workspace:'Principal leadership',path:'/leadership'},
 {name:'teacher',email:people.teacherEmail,password:people.teacherPassword,workspace:'Teaching',path:'/teacher/today'},
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
    if(capture)await page.screenshot({path:`${outputDir}/${persona.name}-${viewportName}.png`,fullPage:true});
    results.push({persona:persona.name,viewport:viewportName,path:persona.path,contextCount,ok:true});
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
