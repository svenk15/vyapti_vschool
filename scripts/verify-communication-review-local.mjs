import {chromium} from '@playwright/test';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const credentialPath='artifacts/people-02/private-demo.json';
const scenarioPath='artifacts/communication-01/private-demo.json';
const evidence='docs/evidence/principal-f10-notice-review-2026-10-17';
if(!existsSync(credentialPath)||!existsSync(scenarioPath))throw new Error('Run pnpm demo:seed before Communication review verification.');
const credentials=JSON.parse(readFileSync(credentialPath,'utf8'));
const scenario=JSON.parse(readFileSync(scenarioPath,'utf8'));
if(!scenario.reviewProposalId)throw new Error('SYNTHETIC_REVIEW_PROPOSAL_REQUIRED');
mkdirSync(evidence,{recursive:true});
const browser=await chromium.launch({headless:true});
const observations={checkedAt:new Date().toISOString(),baseURL,credentialPath,scenarioPath,applicationRoutes:{author:`/admin/communication/proposals/${scenario.reviewProposalId}`,review:`/leadership/notices/review/${scenario.reviewProposalId}`},referenceWorkflow:'LEA-33',states:{}};

async function signIn(page,email,password,workspace){
  await page.goto(`${baseURL}/sign-in`);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel(/^Password/).fill(password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.waitForURL(url=>!url.pathname.endsWith('/sign-in'));
  if(new URL(page.url()).pathname==='/choose-workspace'){
    await page.getByLabel('Branch').selectOption(`${credentials.schoolId}:${workspace}`);
    await page.getByRole('button',{name:/Continue/}).click();
    await page.getByRole('button',{name:/Confirm/}).click();
    await page.waitForURL(workspace==='leadership'?/\/leadership$/:/\/admin$/);
  }
}

async function assertLayout(page,label){
  await page.evaluate(()=>document.fonts.ready);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw new Error(`${label.toUpperCase()}_HORIZONTAL_OVERFLOW`);
  observations.states[label]={overflow,titleSize:await page.locator('h1').first().evaluate(node=>getComputedStyle(node).fontSize)};
}

try{
  const authorContext=await browser.newContext({viewport:{width:1440,height:1000}}),author=await authorContext.newPage();
  await signIn(author,credentials.adminEmail,credentials.password,'administration');
  await author.goto(`${baseURL}${observations.applicationRoutes.author}`);
  const alreadyPublished=await author.getByRole('heading',{name:'Notice published'}).count()>0;
  if(!alreadyPublished){
    await author.getByRole('heading',{name:'Notice awaiting review'}).waitFor();
    await assertLayout(author,'authorAwaitingDesktop');
    await author.screenshot({path:`${evidence}/application-author-awaiting-desktop.png`,fullPage:true});
  }

  const reviewContext=await browser.newContext({viewport:{width:1440,height:1000}}),review=await reviewContext.newPage();
  await signIn(review,credentials.teacherEmail,credentials.teacherPassword,'leadership');
  await review.goto(`${baseURL}${observations.applicationRoutes.review}`);
  if(!alreadyPublished){
    await review.getByRole('heading',{name:'Review proposed notice'}).waitFor();
    await assertLayout(review,'reviewExactDesktop');
    await review.screenshot({path:`${evidence}/application-review-exact-desktop.png`,fullPage:true});
    await review.getByRole('button',{name:/Continue/}).focus();
    await review.keyboard.press('Enter');
    await review.getByRole('heading',{name:'Choose a decision'}).waitFor();
    if(!await review.getByRole('heading',{name:'Choose a decision'}).evaluate(node=>node===document.activeElement))throw new Error('DECISION_STAGE_FOCUS_MISSING');
    await review.getByLabel('Decision').selectOption('APPROVE');
    await review.getByRole('button',{name:/Continue/}).click();
    await review.getByRole('heading',{name:'Confirm the decision'}).waitFor();
    await review.screenshot({path:`${evidence}/application-review-confirm-desktop.png`,fullPage:true});
    await review.getByRole('button',{name:'Confirm approve'}).click();
    await review.getByRole('heading',{name:'Decision recorded'}).waitFor();
    await review.screenshot({path:`${evidence}/application-review-outcome-desktop.png`,fullPage:true});
    await review.reload();
    await review.getByText('APPROVED',{exact:true}).waitFor();
    observations.states.reviewApprovedPersistence={persistedAfterReload:true};
  }else{
    await review.getByText('PUBLISHED',{exact:true}).waitFor();
    observations.states.reviewPublishedPersistence={persistedAfterReload:true};
  }
  await reviewContext.close();

  if(!alreadyPublished){
    await author.reload();
    await author.getByRole('heading',{name:'Publish approved revision'}).waitFor();
    await author.screenshot({path:`${evidence}/application-publish-confirm-desktop.png`,fullPage:true});
    await author.getByRole('button',{name:'Publish approved revision'}).click();
    await author.getByRole('heading',{name:'Notice published'}).waitFor();
  }
  await author.reload();
  await author.getByRole('heading',{name:'Notice published'}).waitFor();
  await author.screenshot({path:`${evidence}/application-published-desktop.png`,fullPage:true});
  observations.states.publication={persistedAfterReload:true};
  await authorContext.close();

  const mobileAuthorContext=await browser.newContext({viewport:{width:390,height:844}}),mobileAuthor=await mobileAuthorContext.newPage();
  await signIn(mobileAuthor,credentials.adminEmail,credentials.password,'administration');
  await mobileAuthor.goto(`${baseURL}${observations.applicationRoutes.author}`);
  await mobileAuthor.getByRole('heading',{name:'Notice published'}).waitFor();
  await assertLayout(mobileAuthor,'authorPublishedMobile');
  const adminMenu=mobileAuthor.getByRole('button',{name:'Open navigation'});
  await adminMenu.focus();await mobileAuthor.keyboard.press('Enter');
  await mobileAuthor.getByRole('navigation').getByRole('link',{name:'Communication'}).waitFor();
  await mobileAuthor.keyboard.press('Escape');
  await mobileAuthor.waitForFunction(()=>document.activeElement?.getAttribute('aria-controls')==='portal-navigation');
  await mobileAuthor.screenshot({path:`${evidence}/application-published-mobile.png`,fullPage:true});
  observations.states.authorPublishedMobile.keyboardFocusReturn=true;
  await mobileAuthorContext.close();

  const mobileReviewContext=await browser.newContext({viewport:{width:390,height:844}}),mobileReview=await mobileReviewContext.newPage();
  await signIn(mobileReview,credentials.teacherEmail,credentials.teacherPassword,'leadership');
  await mobileReview.goto(`${baseURL}${observations.applicationRoutes.review}`);
  await mobileReview.getByText('PUBLISHED',{exact:true}).waitFor();
  await assertLayout(mobileReview,'reviewApprovedMobile');
  await mobileReview.screenshot({path:`${evidence}/application-review-approved-mobile.png`,fullPage:true});
  await mobileReviewContext.close();

  const referencePath=resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html');
  for(const [label,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage({viewport});
    await page.goto(pathToFileURL(referencePath).href);
    await page.evaluate(()=>window.WorkflowReview.read('LEA-33'));
    await page.getByRole('heading',{name:'Approve or return a proposed communication'}).waitFor();
    await page.screenshot({path:`${evidence}/reference-${label}.png`,fullPage:true});
    await page.close();
  }
  writeFileSync(`${evidence}/comparison.json`,`${JSON.stringify(observations,null,2)}\n`);
  console.log(`Communication exact-review browser evidence: ${evidence}`);
}finally{await browser.close();}
