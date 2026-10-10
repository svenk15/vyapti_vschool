import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';

const root='/Users/venky/Documents/codebase/vyapti_vschool';
const evidence=`${root}/docs/evidence/admin-attendance-journey-2026-10-11`;
const appOrigin=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3470';
const referenceOrigin=process.env.VSCHOOL_REFERENCE_URL??'http://127.0.0.1:3471';
mkdirSync(evidence,{recursive:true});
const credentials=JSON.parse(readFileSync(`${root}/artifacts/people-02/private-demo.json`,'utf8'));
const browser=await chromium.launch({headless:true});

function assert(condition,message){if(!condition)throw new Error(message);}
async function renderedFont(page,selector){
 const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');
 const {root:document}=await session.send('DOM.getDocument'),{nodeId}=await session.send('DOM.querySelector',{nodeId:document.nodeId,selector});
 if(!nodeId){await session.detach();return null;}
 const fonts=await session.send('CSS.getPlatformFontsForNode',{nodeId});await session.detach();
 return fonts.fonts.map(font=>({familyName:font.familyName,isCustomFont:font.isCustomFont,glyphCount:font.glyphCount}));
}
async function styles(page,selectors){
 const result={};
 for(const selector of selectors)result[selector]=await page.locator(selector).first().evaluate(element=>{const s=getComputedStyle(element),r=element.getBoundingClientRect();return {fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,color:s.color,backgroundColor:s.backgroundColor,border:s.border,borderRadius:s.borderRadius,padding:s.padding,display:s.display,gap:s.gap,width:r.width,height:r.height,x:r.x,y:r.y};});
 return result;
}
async function overflowReport(page){return page.evaluate(()=>{const viewport=document.documentElement.clientWidth,documentWidth=document.documentElement.scrollWidth;const offenders=[...document.querySelectorAll('*')].flatMap(element=>{const box=element.getBoundingClientRect();return box.right>viewport+.5||box.left<-.5?[{tag:element.tagName,className:element.className?.toString().slice(0,100),left:box.left,right:box.right,width:box.width}]:[];}).slice(0,20);return {viewport,documentWidth,overflow:documentWidth>viewport,offenders};});}
async function signIn(page){
 await page.goto(`${appOrigin}/sign-in`);await page.getByRole('textbox',{name:'Email address',exact:true}).fill(credentials.adminEmail);await page.getByLabel(/^Password/).fill(credentials.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForURL(/\/admin/);
}
async function setFirstDifferentMark(page){const select=page.getByLabel(/^Correction for /).first(),current=await select.inputValue(),next=current==='EXCUSED'?'PRESENT':'EXCUSED';await select.selectOption(next);return {current,next};}

const reference=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
await reference.goto(`${referenceOrigin}/VSchool_School_Admin_Review.html#/home`);await reference.waitForFunction(()=>document.fonts.status==='loaded');await reference.locator('.reviewbar').evaluate(node=>node.style.display='none');await reference.screenshot({path:`${evidence}/reference-today-desktop.png`});
await reference.goto(`${referenceOrigin}/VSchool_School_Admin_Review.html#/flow/SA-26`);await reference.locator('.reviewbar').evaluate(node=>node.style.display='none');await reference.screenshot({path:`${evidence}/reference-sa-26-desktop.png`});
await reference.goto(`${referenceOrigin}/VSchool_School_Admin_Review.html#/flow/SA-27`);await reference.waitForFunction(()=>document.fonts.status==='loaded');
await reference.locator('.reviewbar').evaluate(node=>node.style.display='none');
await reference.screenshot({path:`${evidence}/reference-sa-27-desktop.png`});
const referenceStyles=await styles(reference,['body','.shell','.sidebar','.topbar','.content','.page-head','h1','.card','.formgrid','.field label','.field select','.btn.primary']);
const referenceFonts={heading:await renderedFont(reference,'h1'),body:await renderedFont(reference,'.content'),navigation:await renderedFont(reference,'.nav-item')};
await reference.setViewportSize({width:390,height:844});await reference.screenshot({path:`${evidence}/reference-sa-27-mobile.png`});

const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const app=await context.newPage();await signIn(app);await app.goto(`${appOrigin}/admin`);await app.waitForLoadState('networkidle');
await app.screenshot({path:`${evidence}/application-today-desktop.png`});
const sessionLinks=await app.locator('a.dashboard-session-row').evaluateAll(nodes=>nodes.map(node=>({href:node.getAttribute('href'),text:node.textContent?.replace(/\s+/g,' ').trim()})));
const submitted=sessionLinks.find(item=>item.text?.includes('Submitted'));assert(submitted?.href,'SUBMITTED_TODAY_SESSION_REQUIRED');
await app.goto(`${appOrigin}${submitted.href}`);await app.waitForLoadState('networkidle');await app.evaluate(()=>document.fonts.ready);
await app.screenshot({path:`${evidence}/application-register-before-desktop.png`});
const appStyles=await styles(app,['.portal-shell','.portal-sidebar','.portal-topbar','.portal-page-content','.page-heading','h1','.attendance-session-summary-card','.attendance-records-card','.attendance-records-card .data-table','.attendance-records-card .data-table th','.attendance-records-card .data-table td','.attendance-correction-reason','.btn-primary']);
const appFonts={heading:await renderedFont(app,'h1'),body:await renderedFont(app,'.portal-page-content'),navigation:await renderedFont(app,'.portal-nav-group a')};
const desktopOverflow=await overflowReport(app);

await setFirstDifferentMark(app);await app.getByLabel('Reason',{exact:true}).fill('Verified administrator correction');await app.getByLabel('I have reviewed the original and corrected status.').check();
assert(await app.getByRole('button',{name:'Cancel session'}).isDisabled(),'CANCELLATION_MUST_LOCK_WHILE_CORRECTION_IS_DRAFTED');await app.screenshot({path:`${evidence}/application-correction-draft-desktop.png`});

let lostCorrectionBody,dropCorrection=true;
await app.route('**/api/v1/sessions/*/corrections',async route=>{lostCorrectionBody=route.request().postData();if(dropCorrection){dropCorrection=false;await route.fetch();await route.abort();return;}await route.continue();});
await app.getByRole('button',{name:'Save correction'}).click();await app.getByText('Correction outcome unknown',{exact:true}).waitFor();
assert(await app.getByLabel(/^Correction for /).first().isDisabled(),'UNKNOWN_CORRECTION_MUST_LOCK_INPUTS');assert(await app.getByRole('button',{name:'Retry correction'}).isEnabled(),'UNKNOWN_CORRECTION_RETRY_MUST_BE_ENABLED');
await app.screenshot({path:`${evidence}/application-correction-unknown-desktop.png`});await app.getByRole('button',{name:'Retry correction'}).click();await app.getByText(/Correction \d+ saved\. 1 record updated\./).waitFor();assert(lostCorrectionBody,'CORRECTION_BODY_WAS_NOT_CAPTURED');await app.unroute('**/api/v1/sessions/*/corrections');

await setFirstDifferentMark(app);await app.getByLabel('Reason',{exact:true}).fill('History read separation check');await app.getByLabel('I have reviewed the original and corrected status.').check();
let failHistory=true;await app.route('**/api/v1/sessions/*/history',route=>{if(failHistory){failHistory=false;return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({code:'UNAVAILABLE',message:'History unavailable',retryable:true})});}return route.continue();});
await app.getByRole('button',{name:'Save correction'}).click();await app.getByText(/Correction \d+ saved\. 1 record updated\./).waitFor();await app.getByText('History temporarily unavailable',{exact:true}).waitFor();await app.screenshot({path:`${evidence}/application-saved-history-unavailable-desktop.png`});
await app.getByRole('button',{name:'Refresh history'}).click();await app.getByText('History temporarily unavailable',{exact:true}).waitFor({state:'detached'});await app.unroute('**/api/v1/sessions/*/history');

await setFirstDifferentMark(app);await app.getByLabel('Reason',{exact:true}).fill('Stale version recovery check');await app.getByLabel('I have reviewed the original and corrected status.').check();
await app.route('**/api/v1/sessions/*/corrections',route=>route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({code:'STALE_VERSION',message:'The register changed before this correction.',retryable:false})}));
await app.getByRole('button',{name:'Save correction'}).click();await app.getByText('Attempted change retained for review',{exact:true}).waitFor();await app.screenshot({path:`${evidence}/application-correction-stale-desktop.png`});
await app.unroute('**/api/v1/sessions/*/corrections');await app.getByRole('button',{name:'Review against current register'}).click();await app.getByLabel('I have reviewed the original and corrected status.').check();await app.getByRole('button',{name:'Save correction'}).click();await app.getByText(/Correction \d+ saved\. 1 record updated\./).waitFor();
await app.reload();await app.waitForLoadState('networkidle');assert((await app.locator('.attendance-history-list>li').count())>=4,'PERSISTED_REVISION_HISTORY_REQUIRED');await app.screenshot({path:`${evidence}/application-register-final-desktop.png`});

await app.getByLabel('Cancellation reason').fill('Unknown cancellation interaction check');let cancelBody;
await app.route('**/api/v1/sessions/*/cancel',route=>{cancelBody=route.request().postData();return route.abort();});await app.getByRole('button',{name:'Cancel session'}).click();await app.getByText('Cancellation outcome unknown',{exact:true}).waitFor();
assert(await app.getByLabel('Cancellation reason').isDisabled(),'UNKNOWN_CANCELLATION_MUST_LOCK_REASON');assert(await app.getByRole('button',{name:'Retry cancellation'}).isEnabled(),'UNKNOWN_CANCELLATION_RETRY_MUST_BE_ENABLED');assert(cancelBody,'CANCELLATION_BODY_WAS_NOT_CAPTURED');await app.screenshot({path:`${evidence}/application-cancellation-unknown-desktop.png`});await app.unroute('**/api/v1/sessions/*/cancel');await app.reload();

await app.getByRole('link',{name:'Return to Today'}).click();await app.waitForURL(/\/admin$/);await app.getByRole('heading',{name:'Today'}).waitFor();assert((await app.locator('a.dashboard-session-row').count())===sessionLinks.length,'TODAY_SESSION_COUNT_CHANGED_AFTER_CORRECTION');await app.screenshot({path:`${evidence}/application-today-after-desktop.png`});

await app.setViewportSize({width:390,height:844});await app.getByRole('button',{name:'Open navigation'}).click();await app.screenshot({path:`${evidence}/application-today-mobile-navigation.png`});await app.keyboard.press('Escape');
await app.goto(`${appOrigin}${submitted.href}`);await app.waitForLoadState('networkidle');await app.screenshot({path:`${evidence}/application-register-final-mobile.png`,fullPage:true});const mobileOverflow=await overflowReport(app);
await app.setViewportSize({width:1440,height:1000});
const zoomSession=await context.newCDPSession(app);await zoomSession.send('Emulation.setPageScaleFactor',{pageScaleFactor:2});await app.screenshot({path:`${evidence}/application-register-200-percent.png`});const zoomOverflow=await overflowReport(app);await zoomSession.send('Emulation.setPageScaleFactor',{pageScaleFactor:1});await zoomSession.detach();

const measurements={capturedAt:new Date().toISOString(),reference:{url:'VSchool_School_Admin_Review.html#/flow/SA-27',prototypeReviewBannerExcluded:true,viewport:{width:1440,height:1000},styles:referenceStyles,renderedFonts:referenceFonts},application:{origin:appOrigin,route:submitted.href,viewport:{width:1440,height:1000},styles:appStyles,renderedFonts:appFonts,desktopOverflow,mobileOverflow,zoom200:{mechanism:'Chromium DevTools Emulation.setPageScaleFactor',...zoomOverflow}},sessionLinks,recoveryAssertions:{correctionLostResponseReplay:true,historyFailureSeparatedFromSuccess:true,staleAttemptPreservedAndReviewed:true,persistenceAfterReload:true,correctionDoesNotChangeTodaySessionCount:true,cancellationUnknownPayloadLocked:true}};
writeFileSync(`${evidence}/measurements.json`,`${JSON.stringify(measurements,null,2)}\n`);
console.log(JSON.stringify({submittedRoute:submitted.href,sessionCount:sessionLinks.length,desktopOverflow,mobileOverflow,zoomOverflow,fontSummary:{reference:referenceFonts,application:appFonts},recoveryAssertions:measurements.recoveryAssertions},null,2));
await context.close();await browser.close();
