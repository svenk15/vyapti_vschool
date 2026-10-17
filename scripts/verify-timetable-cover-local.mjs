import {chromium} from '@playwright/test';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const credentialPath='artifacts/people-02/private-demo.json';
const attendanceCredentialPath='artifacts/attendance-01/private-demo.json';
const scenarioPath='artifacts/timetable-cover/private-demo.json';
const evidence='docs/evidence/principal-f07-cover-2026-10-17';
if(!existsSync(credentialPath)||!existsSync(attendanceCredentialPath)||!existsSync(scenarioPath))throw new Error('Run pnpm demo:seed before the cover verification.');
const credentials=JSON.parse(readFileSync(credentialPath,'utf8'));
const attendanceCredentials=JSON.parse(readFileSync(attendanceCredentialPath,'utf8'));
const scenario=JSON.parse(readFileSync(scenarioPath,'utf8'));
mkdirSync(evidence,{recursive:true});
const browser=await chromium.launch({headless:true});
const observations={checkedAt:new Date().toISOString(),baseURL,credentialPath,scenarioPath,applicationRoute:scenario.principalReviewHref,referenceWorkflow:'LEA-24',states:{}};

async function signIn(page,email=credentials.teacherEmail,password=credentials.teacherPassword){
 await page.goto(`${baseURL}/sign-in`);
 await page.getByLabel('Email address').fill(email);
 await page.getByLabel(/^Password/).fill(password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(url=>!url.pathname.endsWith('/sign-in'));
 if(new URL(page.url()).pathname==='/choose-workspace'){
  await page.getByLabel('Branch').selectOption(`${scenario.schoolId}:leadership`);
  await page.getByRole('button',{name:/Continue/}).click();
  await page.getByRole('button',{name:/Confirm/}).click();
  await page.waitForURL(/\/leadership$/);
 }
}

async function inspect(page,label,path){
 await page.goto(`${baseURL}${scenario.principalReviewHref}`);
 await page.getByRole('heading',{name:'Review occurrence cover'}).waitFor();
 await page.evaluate(()=>document.fonts.ready);
 const state={
  approval:await page.getByText(/^(PENDING|APPROVED)$/,{exact:true}).first().innerText(),
  response:await page.getByText('ACCEPTED',{exact:true}).innerText(),
  overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),
  titleSize:await page.getByRole('heading',{name:'Review occurrence cover'}).evaluate(node=>getComputedStyle(node).fontSize),
  availableAction:await page.getByLabel('Action').inputValue().catch(()=>null)
 };
 if(state.overflow)throw new Error(`${label.toUpperCase()}_HORIZONTAL_OVERFLOW`);
 await page.screenshot({path,fullPage:true});
 observations.states[label]=state;
}

try{
 const desktopContext=await browser.newContext({viewport:{width:1440,height:1000}}),desktop=await desktopContext.newPage();
 await signIn(desktop);
 await desktop.goto(`${baseURL}${scenario.principalReviewHref}`);
 await desktop.getByRole('heading',{name:'Review occurrence cover'}).waitFor();
 if(await desktop.getByText('Cover is active',{exact:true}).count()===0){
  await inspect(desktop,'desktopPending',`${evidence}/application-pending-desktop.png`);
  await desktop.getByLabel('Action').focus();
  if(!await desktop.getByLabel('Action').evaluate(node=>node===document.activeElement))throw new Error('ACTION_KEYBOARD_FOCUS_MISSING');
  await desktop.getByLabel('Action').selectOption('APPROVE');
  await desktop.getByLabel('Decision reason').fill('Independent synthetic cover approval');
  await desktop.getByRole('button',{name:'Confirm action'}).click();
  await desktop.getByText('Cover is active',{exact:true}).waitFor();
 }
 await desktop.reload();
 await desktop.getByText('ACTIVE',{exact:true}).first().waitFor();
 await desktop.screenshot({path:`${evidence}/application-active-desktop.png`,fullPage:true});
 observations.states.desktopActive={persistedAfterReload:true,overflow:await desktop.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
 await desktopContext.close();

 const mobileContext=await browser.newContext({viewport:{width:390,height:844}}),mobile=await mobileContext.newPage();
 await signIn(mobile);
 await mobile.goto(`${baseURL}${scenario.principalReviewHref}`);
 await mobile.getByText('Cover is active',{exact:true}).waitFor();
 const menu=mobile.getByRole('button',{name:'Open navigation'});
 await menu.focus();
 await mobile.keyboard.press('Enter');
 await mobile.getByRole('navigation',{name:'Principal leadership'}).getByRole('link',{name:'Cover requests'}).waitFor();
 await mobile.screenshot({path:`${evidence}/application-active-mobile-navigation.png`,fullPage:true});
 await mobile.keyboard.press('Escape');
 await mobile.waitForFunction(()=>document.activeElement?.getAttribute('aria-controls')==='portal-navigation');
 if(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('MOBILE_HORIZONTAL_OVERFLOW');
 await mobile.screenshot({path:`${evidence}/application-active-mobile.png`,fullPage:true});
 observations.states.mobileActive={keyboardFocusReturn:true,overflow:false};
 await mobileContext.close();

 const teacherContext=await browser.newContext({viewport:{width:1440,height:1000}}),teacher=await teacherContext.newPage();
 await signIn(teacher,attendanceCredentials.teacherTwoEmail,attendanceCredentials.teacherTwoPassword);
 await teacher.goto(`${baseURL}${scenario.teacherResponseHref}`);
 await teacher.getByRole('heading',{name:'Respond to cover request'}).waitFor();
 if(await teacher.getByText('Cover is active',{exact:true}).count()===0){
  await teacher.getByText('APPROVED',{exact:true}).waitFor();
  await teacher.getByText('PENDING',{exact:true}).waitFor();
  await teacher.screenshot({path:`${evidence}/teacher-pending-desktop.png`,fullPage:true});
  await teacher.getByLabel('Action').selectOption('ACCEPT');
  await teacher.getByLabel('Decision reason').fill('Synthetic substitute confirms availability');
  await teacher.getByRole('button',{name:'Confirm action'}).click();
  await teacher.getByText('Cover is active',{exact:true}).waitFor();
 }
 await teacher.reload();
 await teacher.getByText('ACTIVE',{exact:true}).first().waitFor();
 if(await teacher.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('TEACHER_DESKTOP_HORIZONTAL_OVERFLOW');
 await teacher.screenshot({path:`${evidence}/teacher-active-desktop.png`,fullPage:true});
 observations.states.teacherActive={persistedAfterReload:true,overflow:false};
 await teacherContext.close();

 const teacherMobileContext=await browser.newContext({viewport:{width:390,height:844}}),teacherMobile=await teacherMobileContext.newPage();
 await signIn(teacherMobile,attendanceCredentials.teacherTwoEmail,attendanceCredentials.teacherTwoPassword);
 await teacherMobile.goto(`${baseURL}${scenario.teacherResponseHref}`);
 await teacherMobile.getByText('Cover is active',{exact:true}).waitFor();
 const teacherMenu=teacherMobile.getByRole('button',{name:'Open navigation'});
 await teacherMenu.focus();
 await teacherMobile.keyboard.press('Enter');
 await teacherMobile.getByRole('navigation',{name:'Teaching navigation'}).getByRole('link',{name:'Cover requests'}).waitFor();
 await teacherMobile.screenshot({path:`${evidence}/teacher-active-mobile-navigation.png`,fullPage:true});
 await teacherMobile.keyboard.press('Escape');
 await teacherMobile.waitForFunction(()=>document.activeElement?.getAttribute('aria-controls')==='portal-navigation');
 if(await teacherMobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('TEACHER_MOBILE_HORIZONTAL_OVERFLOW');
 await teacherMobile.screenshot({path:`${evidence}/teacher-active-mobile.png`,fullPage:true});
 observations.states.teacherMobileActive={keyboardFocusReturn:true,overflow:false};
 await teacherMobileContext.close();

 const referencePath=resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html');
 for(const [label,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport});
  await page.goto(pathToFileURL(referencePath).href);
  await page.evaluate(()=>{window.WorkflowReview.read('LEA-24');});
  await page.getByRole('heading',{name:'Approve temporary cover when delegated'}).waitFor();
  await page.screenshot({path:`${evidence}/reference-${label}.png`,fullPage:true});
  await page.close();
 }
 writeFileSync(`${evidence}/comparison.json`,`${JSON.stringify(observations,null,2)}\n`);
 console.log(`Timetable cover browser evidence: ${evidence}`);
}finally{await browser.close();}
