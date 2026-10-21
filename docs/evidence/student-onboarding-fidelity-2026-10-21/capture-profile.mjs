import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const require=createRequire(`${process.cwd()}/package.json`);
const {chromium}=require('@playwright/test');
const baseURL='http://127.0.0.1:3400';
const output='docs/evidence/student-onboarding-fidelity-2026-10-21';
const reference=pathToFileURL(`${process.cwd()}/docs/ux/references/student-onboarding-approved/refined-onboarding.html`).href;
const credential=JSON.parse(readFileSync('artifacts/people-02/private-demo.json','utf8'));
const viewports={desktop:{width:1440,height:1000},mobile:{width:390,height:844}};
mkdirSync(`${output}/reference`,{recursive:true});
mkdirSync(`${output}/application`,{recursive:true});

async function settle(page){await page.waitForLoadState('domcontentloaded');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);}
async function inspect(page,kind,state,viewportName){
 await settle(page);await page.evaluate(()=>scrollTo(0,0));
 const metrics=await page.evaluate(({kind,state,viewportName})=>{const rect=node=>node?Object.fromEntries(['x','y','width','height'].map(key=>[key,Math.round(node.getBoundingClientRect()[key]*100)/100])):null;return {kind,state,viewportName,url:location.href,cssViewport:{width:innerWidth,height:innerHeight},devicePixelRatio,visualViewportScale:visualViewport?.scale??null,bodyFont:getComputedStyle(document.body).fontFamily,rootOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,heading:rect(document.querySelector('h1')),record:rect(document.querySelector('.student-record,.student-profile-composition')),drawer:rect(document.querySelector('dialog[open]'))};},{kind,state,viewportName});
 await page.screenshot({path:`${output}/${kind}/${state}-${viewportName}.png`,fullPage:true});return metrics;
}
async function login(page){
 await page.goto(`${baseURL}/sign-in`);await settle(page);await page.getByLabel('Email address').fill(credential.adminEmail);await page.getByRole('textbox',{name:'Password'}).fill(credential.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForURL(url=>url.pathname==='/choose-workspace'||url.pathname==='/admin',{timeout:20000});
 if(new URL(page.url()).pathname==='/choose-workspace'){const select=page.getByLabel('Branch'),options=await select.locator('option').allTextContents(),label=options.find(value=>value.includes('School administration'));if(!label)throw new Error('School administration workspace is unavailable.');await select.selectOption({label});await page.getByRole('button',{name:/Continue/}).click();await page.getByRole('button',{name:/Confirm/}).click();await page.waitForURL(url=>url.pathname==='/admin',{timeout:20000});}
}
async function studentWithGuardian(page){
 await page.goto(`${baseURL}/admin/students`);await settle(page);
 return page.evaluate(async()=>{const response=await fetch('/api/v1/students?limit=100',{cache:'no-store'});if(!response.ok)throw new Error(`Student list failed: ${response.status}`);const list=await response.json();for(const student of list.items??[]){const guardians=await fetch(`/api/v1/students/${student.studentId}/guardians`,{cache:'no-store'});if(guardians.ok){const body=await guardians.json();if((body.items??body).length)return student;}}return list.items?.[0]??null;});
}

const browser=await chromium.launch({headless:true});const records=[];
try{
 for(const [viewportName,viewport] of Object.entries(viewports)){
  const rc=await browser.newContext({viewport,deviceScaleFactor:1});const rp=await rc.newPage();
  await rp.goto(`${reference}?profile=${viewportName}#profile`);records.push(await inspect(rp,'reference','profile',viewportName));
  await rp.getByRole('button',{name:/Add guardian/i}).click();records.push(await inspect(rp,'reference','guardian-add',viewportName));await rp.keyboard.press('Escape');
  await rp.getByRole('button',{name:/Manage/}).first().click();records.push(await inspect(rp,'reference','guardian-manage',viewportName));await rp.keyboard.press('Escape');await rc.close();

  const ac=await browser.newContext({viewport,deviceScaleFactor:1});const ap=await ac.newPage();await login(ap);const student=await studentWithGuardian(ap);if(!student)throw new Error('No authorized synthetic Student is available.');
  await ap.goto(`${baseURL}/admin/students/${student.studentId}`);records.push(await inspect(ap,'application','profile',viewportName));
  const add=ap.getByRole('button',{name:'Add guardian',exact:true});await add.click();await ap.getByRole('dialog').waitFor();const addFocused=await ap.evaluate(()=>document.activeElement?.getAttribute('id')??document.activeElement?.getAttribute('aria-label'));records.push({...await inspect(ap,'application','guardian-add',viewportName),initialFocus:addFocused});await ap.keyboard.press('Escape');const addFocusReturned=await add.evaluate(node=>document.activeElement===node);
  const manage=ap.getByRole('button',{name:'Manage',exact:true}).first();if(await manage.count()){await manage.click();await ap.getByRole('dialog').waitFor();records.push({...await inspect(ap,'application','guardian-manage',viewportName),addFocusReturned});await ap.keyboard.press('Escape');records.push({kind:'application',state:'guardian-manage-focus-return',viewportName,returned:await manage.evaluate(node=>document.activeElement===node)});}else records.push({kind:'application',state:'guardian-manage',viewportName,unavailable:true});
  await ac.close();
 }
}finally{await browser.close();}
writeFileSync(`${output}/profile-capture-metadata.json`,`${JSON.stringify({capturedAt:new Date().toISOString(),baseURL,buildId:readFileSync('.next/BUILD_ID','utf8').trim(),applicationSource:'d6c61772484ddf2df828a3917b12d7083ff6cf96',reference,records},null,2)}\n`);
console.log(`Captured ${records.filter(record=>!record.unavailable).length} Profile and guardian observations without mutations.`);
