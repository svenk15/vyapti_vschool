import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';

const root=process.cwd();
const evidence=process.env.VSCHOOL_ADMIN_LANDING_EVIDENCE??`${root}/docs/evidence/ux-revamp-06-admin-landing-2026-10-18`;
const baseURL=process.env.VSCHOOL_DEMO_URL??'http://127.0.0.1:3400';
const credentials=JSON.parse(readFileSync(`${root}/artifacts/people-02/private-demo.json`,'utf8'));
const themes=['forest','amethyst','porcelain','linen'];
mkdirSync(evidence,{recursive:true});

async function signIn(page){
  await page.goto(`${baseURL}/sign-in`);
  await page.getByRole('textbox',{name:'Email address',exact:true}).fill(credentials.adminEmail);
  await page.getByLabel(/^Password/).fill(credentials.password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.waitForURL(url=>url.pathname==='/choose-workspace'||url.pathname==='/admin',{timeout:15000});
  if(new URL(page.url()).pathname==='/choose-workspace'){
    await page.getByLabel('Branch').selectOption(`${credentials.schoolId}:administration`);
    await page.getByRole('button',{name:/Continue/}).click();
    await page.getByRole('button',{name:/Confirm/}).click();
  }
  await page.waitForURL(/\/admin$/,{timeout:15000});
  await page.getByRole('heading',{name:'Your school day, at a glance',exact:true}).waitFor();
}

async function metrics(page,label){
  return page.evaluate(label=>{
    const q=(selector)=>document.querySelector(selector);
    const rect=(selector)=>{const node=q(selector);if(!node)return null;const value=node.getBoundingClientRect();return {x:value.x,y:value.y,width:value.width,height:value.height,bottom:value.bottom};};
    const summary=[...document.querySelectorAll('.dashboard-summary-item')].map(node=>{const value=node.getBoundingClientRect();return {width:value.width,height:value.height};});
    const font=getComputedStyle(document.body);
    const heading=q('.admin-dashboard h1');
    const nav=q('.portal-nav-scroll');
    const footer=q('.portal-sidebar-footer');
    return {
      label,
      cssViewport:{width:innerWidth,height:innerHeight},
      outerViewport:{width:outerWidth,height:outerHeight},
      visualViewport:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale}:null,
      devicePixelRatio,
      documentZoom:getComputedStyle(document.documentElement).zoom,
      bodyFontFamily:font.fontFamily,
      bodyFontSize:font.fontSize,
      interLoaded:document.fonts.check('14px Inter'),
      headingFont:heading?{family:getComputedStyle(heading).fontFamily,size:getComputedStyle(heading).fontSize,lineHeight:getComputedStyle(heading).lineHeight}:null,
      rootOverflow:{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,hasHorizontal:document.documentElement.scrollWidth>document.documentElement.clientWidth},
      summary:{rect:rect('.dashboard-summary-strip'),items:summary},
      workGrid:{rect:rect('.dashboard-work-grid'),columns:q('.dashboard-work-grid')?getComputedStyle(q('.dashboard-work-grid')).gridTemplateColumns:null,gap:q('.dashboard-work-grid')?getComputedStyle(q('.dashboard-work-grid')).gap:null},
      sessionTableDisplay:q('.dashboard-sessions-table')?getComputedStyle(q('.dashboard-sessions-table')).display:null,
      sessionCardsDisplay:q('.dashboard-sessions-mobile')?getComputedStyle(q('.dashboard-sessions-mobile')).display:null,
      sidebar:{rect:rect('.portal-sidebar'),navClientHeight:nav?.clientHeight??null,navScrollHeight:nav?.scrollHeight??null,navOverflow:nav?getComputedStyle(nav).overflowY:null,footer:footer?rect('.portal-sidebar-footer'):null},
      primaryActionVisible:!![...document.querySelectorAll('a')].find(node=>node.textContent?.includes('Register student')&&node.getBoundingClientRect().width>0),
      theme:q('.brand-surface')?.getAttribute('data-vs-theme')??null,
      colors:{primary:getComputedStyle(q('.brand-surface')??document.documentElement).getPropertyValue('--vs-primary').trim(),canvas:getComputedStyle(q('.brand-surface')??document.documentElement).getPropertyValue('--vs-canvas').trim(),surface:getComputedStyle(q('.brand-surface')??document.documentElement).getPropertyValue('--vs-surface').trim()}
    };
  },label);
}

const browser=await chromium.launch({headless:true});
const report={capturedAt:new Date().toISOString(),baseURL,browser:'Playwright Chromium',zoomEvidence:'Playwright default page zoom; visualViewport.scale is recorded. This is not Chromium device-scale emulation.',themeEvidence:'Each screenshot uses the same authorized server data and DOM. A visual-only data-vs-theme override exercises the four approved token sets without changing stored branch configuration.',desktop:{},mobile:{},themes:{},keyboard:{},sidebar:{}};
try{
  const desktopContext=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const desktop=await desktopContext.newPage();
  await signIn(desktop);
  report.desktop=await metrics(desktop,'desktop-after');
  const communication=desktop.getByRole('button',{name:/Communication/}).first();
  if(await communication.count()){
    await communication.scrollIntoViewIfNeeded();
    report.sidebar.communication=await communication.evaluate(node=>{const rect=node.getBoundingClientRect();const nav=node.closest('.portal-nav-scroll')?.getBoundingClientRect();const footer=document.querySelector('.portal-sidebar-footer')?.getBoundingClientRect();return {visible:rect.bottom>(nav?.top??0)&&rect.top<(nav?.bottom??0),aboveFooter:footer?rect.bottom<=footer.top:true,rect:{top:rect.top,bottom:rect.bottom},nav:nav?{top:nav.top,bottom:nav.bottom}:null,footer:footer?{top:footer.top,bottom:footer.bottom}:null};});
  }
  const register=desktop.getByRole('link',{name:/Register student/});
  await register.focus();
  const focusedBefore=await register.evaluate(node=>document.activeElement===node);
  await desktop.keyboard.press('Tab');
  const focusedAfter=await desktop.evaluate(()=>({tag:document.activeElement?.tagName,text:document.activeElement?.textContent?.trim().replace(/\s+/g,' ').slice(0,80)}));
  report.keyboard.desktop={registerFocused:focusedBefore,next:focusedAfter};
  for(const theme of themes){
    await desktop.evaluate(theme=>document.querySelector('.brand-surface')?.setAttribute('data-vs-theme',theme),theme);
    report.themes[`${theme}-desktop`]=await metrics(desktop,`${theme}-desktop`);
    await desktop.screenshot({path:`${evidence}/after-${theme}-desktop.png`,fullPage:true});
  }
  await desktopContext.close();

  const mobileContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const mobile=await mobileContext.newPage();
  await signIn(mobile);
  report.mobile=await metrics(mobile,'mobile-after');
  for(const theme of themes){
    await mobile.evaluate(theme=>document.querySelector('.brand-surface')?.setAttribute('data-vs-theme',theme),theme);
    report.themes[`${theme}-mobile`]=await metrics(mobile,`${theme}-mobile`);
    await mobile.screenshot({path:`${evidence}/after-${theme}-mobile.png`,fullPage:true});
  }
  await mobile.evaluate(()=>document.querySelector('.brand-surface')?.setAttribute('data-vs-theme','forest'));
  const menu=mobile.getByRole('button',{name:'Open navigation'});
  await menu.focus();
  await menu.click();
  await mobile.waitForTimeout(100);
  const dialog=mobile.locator('#portal-navigation');
  await dialog.waitFor();
  report.keyboard.mobile={focusInsideAfterOpen:await mobile.evaluate(()=>!!document.activeElement?.closest('#portal-navigation'))};
  await mobile.screenshot({path:`${evidence}/after-forest-mobile-navigation.png`,fullPage:false});
  await mobile.keyboard.press('Escape');
  report.keyboard.mobile.focusReturnedAfterEscape=await menu.evaluate(node=>document.activeElement===node);
  await mobileContext.close();
} finally {
  await browser.close();
}
assert.deepEqual(report.desktop.cssViewport,{width:1440,height:1000});
assert.equal(report.desktop.visualViewport.scale,1);
assert.equal(report.desktop.devicePixelRatio,1);
assert.equal(report.desktop.interLoaded,true);
assert.equal(report.desktop.rootOverflow.hasHorizontal,false);
assert.equal(report.desktop.summary.items.length,3);
assert.ok(report.desktop.summary.rect.height>=112&&report.desktop.summary.rect.height<=128);
assert.equal(report.desktop.workGrid.gap,'24px');
assert.equal(report.desktop.sessionTableDisplay,'block');
assert.equal(report.desktop.sessionCardsDisplay,'none');
assert.equal(report.desktop.primaryActionVisible,true);
assert.equal(report.sidebar.communication.visible,true);
assert.equal(report.sidebar.communication.aboveFooter,true);
assert.equal(report.keyboard.desktop.registerFocused,true);
assert.equal(report.keyboard.desktop.next.text,'School setup');
assert.deepEqual(report.mobile.cssViewport,{width:390,height:844});
assert.equal(report.mobile.visualViewport.scale,1);
assert.equal(report.mobile.devicePixelRatio,1);
assert.equal(report.mobile.interLoaded,true);
assert.equal(report.mobile.rootOverflow.hasHorizontal,false);
assert.equal(report.mobile.sessionTableDisplay,'none');
assert.equal(report.mobile.sessionCardsDisplay,'grid');
assert.equal(report.keyboard.mobile.focusInsideAfterOpen,true);
assert.equal(report.keyboard.mobile.focusReturnedAfterEscape,true);
assert.equal(new Set(themes.map(theme=>report.themes[`${theme}-desktop`].colors.primary)).size,4);
writeFileSync(`${evidence}/render-metrics.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({evidence,desktop:report.desktop,mobile:report.mobile,keyboard:report.keyboard,sidebar:report.sidebar},null,2));
