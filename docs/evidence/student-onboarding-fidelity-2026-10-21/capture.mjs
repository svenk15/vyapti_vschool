import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
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
async function metadata(page,label,state){return page.evaluate(({label,state})=>{const heading=document.querySelector('h1'),back=document.querySelector('.back,.student-registration-back'),surface=document.querySelector('.form-surface,.student-registration-card'),firstInput=document.querySelector('input:not([type=checkbox]),select');const rect=node=>node?Object.fromEntries(['x','y','width','height'].map(key=>[key,Math.round(node.getBoundingClientRect()[key]*100)/100])):null;return {label,state,url:location.href,cssViewport:{width:innerWidth,height:innerHeight},devicePixelRatio,visualViewportScale:visualViewport?.scale??null,bodyFont:getComputedStyle(document.body).fontFamily,rootOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,heading:rect(heading),back:rect(back),surface:rect(surface),firstControl:rect(firstInput)};},{label,state});}
async function shot(page,kind,state,viewportName,records){await settle(page);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(50);records.push(await metadata(page,kind,state));await page.screenshot({path:`${output}/${kind}/${state}-${viewportName}.png`,fullPage:true});}

async function login(page){
 await page.goto(`${baseURL}/sign-in`);await settle(page);
 await page.getByLabel('Email address').fill(credential.adminEmail);
 await page.getByRole('textbox',{name:'Password'}).fill(credential.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(url=>url.pathname==='/choose-workspace'||url.pathname==='/admin',{timeout:20000});
 if(new URL(page.url()).pathname==='/choose-workspace'){
  const select=page.getByLabel('Branch'),options=await select.locator('option').allTextContents(),label=options.find(value=>value.includes('School administration'));
  if(!label)throw new Error('School administration workspace is not available.');
  await select.selectOption({label});await page.getByRole('button',{name:/Continue/}).click();await page.getByRole('button',{name:/Confirm/}).click();await page.waitForURL(url=>url.pathname==='/admin',{timeout:20000});
 }
}

async function referenceStates(page,viewportName,records){
 let sequence=0;const open=async()=>{sequence+=1;await page.goto(`${reference}?capture=${viewportName}-${sequence}#add`);await settle(page);};
 await open();for(const id of ['first','last','admission','admitted','guardian-name','guardian-email'])await page.locator(`#${id}`).fill('');await page.locator('#class').selectOption('');await shot(page,'reference','empty-new',viewportName,records);
 await open();await page.getByRole('button',{name:'Use existing record'}).click();await shot(page,'reference','existing-record',viewportName,records);
 await open();await page.locator('details.disclosure').first().locator('summary').click();await shot(page,'reference','class-selected',viewportName,records);
 await open();await page.locator('#invite').check();await page.locator('#access-details summary').click();await shot(page,'reference','guardian-expanded',viewportName,records);
 await open();for(const id of ['first','admission','admitted'])await page.locator(`#${id}`).fill('');await page.getByRole('button',{name:'Add student',exact:true}).click();await shot(page,'reference','validation-failure',viewportName,records);
 await open();await page.getByRole('button',{name:'Add student',exact:true}).click();await shot(page,'reference','success',viewportName,records);
 await open();await page.locator('#outcome').selectOption('failed');await page.locator('#invite').check();await page.getByRole('button',{name:'Add student',exact:true}).click();await shot(page,'reference','partial-outcome',viewportName,records);
}

async function currentSeed(page){
 await page.goto(`${baseURL}/admin/students`);await settle(page);
 const list=await page.evaluate(async()=>{const response=await fetch('/api/v1/students?limit=1',{cache:'no-store'});if(!response.ok)throw new Error(`Student list failed: ${response.status}`);return response.json();});
 if(!list.items?.[0])throw new Error('No authorized synthetic Student is available.');
 const student=list.items[0],profile=await page.evaluate(async id=>{const response=await fetch(`/api/v1/students/${id}`,{cache:'no-store'});if(!response.ok)throw new Error(`Student profile failed: ${response.status}`);return response.json();},student.studentId);
 return {student,profile};
}

async function currentStates(page,viewportName,records,seed){
 const open=async()=>{await page.goto(`${baseURL}/admin/students/register`);await settle(page);};
 await open();await shot(page,'application','empty-new',viewportName,records);
 await open();await page.getByRole('button',{name:'Use existing record'}).click();await page.getByLabel('Find by').selectOption('ADMISSION_NUMBER');await page.getByLabel('Exact reference').fill(seed.student.admissionNumber);await page.getByRole('button',{name:'Find',exact:true}).click();await page.getByText(/already registered as a student/i).first().waitFor();await shot(page,'application','existing-record',viewportName,records);
 await open();const section=page.getByLabel('Class and section');const sectionValues=await section.locator('option').evaluateAll(options=>options.map(option=>option.value).filter(Boolean));if(sectionValues.length){await section.selectOption(sectionValues[0]);await page.getByText('Placement dates & roll number').click();await page.getByLabel('Roll number').fill('18');}await shot(page,'application','class-selected',viewportName,records);
 await open();const invite=page.getByLabel('Invite a parent or guardian now');if(await invite.count()){await invite.check();await page.locator('#registration-guardianName').waitFor();await page.locator('#registration-guardianName').fill('Priya Review');await page.locator('#registration-guardianEmail').fill('priya.review@example.test');}await shot(page,'application','guardian-expanded',viewportName,records);
 await open();await page.getByRole('button',{name:'Add student',exact:true}).click();await page.getByText('Correct the highlighted fields.').waitFor();await shot(page,'application','validation-failure',viewportName,records);
 await page.goto(`${baseURL}/admin/students/${seed.student.studentId}?returnTo=%2Fadmin%2Fstudents&onboarding=complete`);await settle(page);await shot(page,'application','success',viewportName,records);
 await open();await page.getByLabel('First name').fill('Review');await page.getByLabel('Last name').fill('Partial');await page.getByLabel('Admission number').fill(`REVIEW-${viewportName.toUpperCase()}`);const date=await page.getByLabel('Admission date').getAttribute('max');await page.getByLabel('Admission date').fill(date);const partialSection=page.getByLabel('Class and section'),partialValues=await partialSection.locator('option').evaluateAll(options=>options.map(option=>option.value).filter(Boolean));if(partialValues.length)await partialSection.selectOption(partialValues[0]);await page.getByLabel('Invite a parent or guardian now').check();await page.locator('#registration-guardianName').fill('Priya Review');await page.locator('#registration-guardianEmail').fill('priya.review@example.test');await page.route('**/api/v1/student-onboarding',async route=>{const body={code:'CONFLICT',message:'The parent invitation could not be created.',requestId:'synthetic-review-only',retryable:false,stage:'GUARDIAN',partial:{student:{...seed.profile,replayed:false},enrollment:{placement:{gradeName:'Grade 8 Demo',sectionName:'Demo Section A'}}}};await route.fulfill({status:409,contentType:'application/json',body:JSON.stringify(body)});},{times:1});await page.getByRole('button',{name:'Add student',exact:true}).click();await page.getByRole('heading',{name:'Student added'}).waitFor();await shot(page,'application','partial-outcome',viewportName,records);await page.unroute('**/api/v1/student-onboarding');
}

const browser=await chromium.launch({headless:true});const records=[];
try{
 for(const [viewportName,viewport] of Object.entries(viewports)){
  const referenceContext=await browser.newContext({viewport,deviceScaleFactor:1});const referencePage=await referenceContext.newPage();await referenceStates(referencePage,viewportName,records);await referenceContext.close();
  const appContext=await browser.newContext({viewport,deviceScaleFactor:1});const appPage=await appContext.newPage();await login(appPage);const seed=await currentSeed(appPage);await currentStates(appPage,viewportName,records,seed);await appContext.close();
 }
}finally{await browser.close();}
writeFileSync(`${output}/capture-metadata.json`,`${JSON.stringify({capturedAt:new Date().toISOString(),baseURL,buildId:readFileSync('.next/BUILD_ID','utf8').trim(),applicationSource:'d6c61772484ddf2df828a3917b12d7083ff6cf96',head:'d6c61772484ddf2df828a3917b12d7083ff6cf96',reference,notes:['The reference review controls remain visible and are reference-only.','Application partial-outcome capture uses a route-fulfilled owner failure after a synthetic no-write form submission; it is test-only presentation evidence.','Application success uses the normal post-onboarding profile route with an existing authorized fictional Student; no mutation was issued.'],records},null,2)}\n`);
console.log(`Captured ${records.length} states without issuing a Student mutation.`);
