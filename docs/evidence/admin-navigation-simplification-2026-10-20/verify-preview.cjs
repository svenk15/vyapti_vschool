const {chromium}=require('@playwright/test');
const {mkdirSync,writeFileSync}=require('node:fs');

(async()=>{
 const output='docs/evidence/admin-navigation-simplification-2026-10-20';
 mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const results=[];
 for(const viewport of [{name:'desktop',width:1440,height:1000},{name:'intermediate',width:900,height:900},{name:'mobile',width:390,height:844},{name:'narrow',width:360,height:800}]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:3415/NAVIGATION_PREVIEW.html#students');
  const labels=await page.locator('#primary a').allTextContents();
  if(JSON.stringify(labels.map(value=>value.trim()))!==JSON.stringify(['Today','Students','Staff','Attendance','Academics','Communication']))throw new Error(`Unexpected broad navigation at ${viewport.name}: ${labels}`);
  if(viewport.width<768){
   const opener=page.getByRole('button',{name:'Open navigation'});
   await opener.click();await page.waitForTimeout(250);
   await page.screenshot({path:`${output}/preview-${viewport.name}-drawer.png`,fullPage:true});
   await page.locator('.nav-scroll').evaluate(node=>{node.scrollTop=node.scrollHeight});
   const lastService=page.getByRole('link',{name:'Restricted support'}),scrollRegion=page.locator('.nav-scroll');
   const [serviceBox,scrollBox]=await Promise.all([lastService.boundingBox(),scrollRegion.boundingBox()]);
   if(!serviceBox||!scrollBox||serviceBox.bottom>scrollBox.y+scrollBox.height+1)throw new Error(`Conditional services are not reachable above the footer in ${viewport.name}`);
   await page.screenshot({path:`${output}/preview-${viewport.name}-drawer-lower.png`,fullPage:true});
   const last=page.getByRole('button',{name:'Sign out'});await last.focus();await page.keyboard.press('Tab');
   const trapped=await page.evaluate(()=>document.activeElement?.classList.contains('brand')===true);
   if(!trapped)throw new Error(`Focus did not wrap in ${viewport.name} drawer`);
   await page.keyboard.press('Escape');
   await page.waitForFunction(()=>document.activeElement?.id==='menu');
  }else await page.screenshot({path:`${output}/preview-${viewport.name}.png`,fullPage:true});
  const geometry=await page.evaluate(()=>({rootOverflow:document.documentElement.scrollWidth>innerWidth,sidebarWidth:Math.round(document.querySelector('.sidebar').getBoundingClientRect().width),cardWidth:Math.round(document.querySelector('.form-card').getBoundingClientRect().width),active:document.querySelector('#primary a.active')?.textContent.trim(),computedFont:getComputedStyle(document.body).fontFamily}));
  if(geometry.rootOverflow)throw new Error(`Root overflow at ${viewport.name}`);
  results.push({viewport,geometry});
  if(viewport.name==='desktop'){
   await page.getByLabel('Access profile').selectOption('attendance');
   const limited=await page.locator('#primary a').allTextContents();
   if(limited.length!==1||limited[0].trim()!=='Attendance')throw new Error(`Attendance simulation incorrect: ${limited}`);
   await page.getByLabel('Access profile').selectOption('noTimetable');
   await page.getByRole('link',{name:'Academics'}).click();
   const tabs=await page.getByRole('navigation',{name:'Academics views'}).getByRole('button').allTextContents();
   if(tabs.includes('Timetable'))throw new Error('Timetable remained visible in no-Timetable profile');
   await page.screenshot({path:`${output}/preview-academics-fallback-desktop.png`,fullPage:true});
  }
  await context.close();
 }
 writeFileSync(`${output}/preview-verification.json`,JSON.stringify({capturedAt:new Date().toISOString(),browser:'Playwright Chromium',deviceScaleFactor:1,actualBrowserZoom:'not tested',results},null,2));
 await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
