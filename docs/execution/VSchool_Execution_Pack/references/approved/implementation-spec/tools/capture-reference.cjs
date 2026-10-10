// Reference-only inspection. Does not access a production application or database.
const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'../..');
const out=path.join(root,'implementation-spec/administrator/reference');fs.mkdirSync(out,{recursive:true});
const source=path.join(root,'packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html');
const catalog=JSON.parse(fs.readFileSync(path.join(path.dirname(source),'workflow-catalog.json')));
const props=['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','display','position','width','height','minHeight','maxWidth','padding','margin','gap','border','borderRadius','boxShadow','backdropFilter','gridTemplateColumns','overflowY','alignItems','justifyContent'];
const selectors=['body','.shell','.sidebar','.brand','.school-card','.nav-caption','.nav-item','.nav-item.active','.sidebar-footer','.person','.signout','.topbar','.crumb','.context-actions','.top-year','.content','.page-head','h1','h2','.btn','.btn.primary','.tabs','.toolbar','.searchbar','.searchbar select','.searchbar input','.table-card','th','td','.personcell','.avatar','.badge','.row-action','.dialog[open]','.dialog-head','.dialog-head h2','.dialog-body','.dialog-foot','.filter-group','.filter-group summary','.check','.check input','.formgrid','.field','.field label','.field input','.field select','.field textarea','.hint','.error','.steps','.step','.form-foot','.save-draft'];
(async()=>{
 const b=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:process.env.CHROMIUM_ARGS?JSON.parse(process.env.CHROMIUM_ARGS):[]});
 const page=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,locale:'en-GB',timezoneId:'Asia/Kolkata',colorScheme:'light',reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));const records=[];
 async function capture(id,route,width,action,screenshot=false){
  await page.setViewportSize({width,height:width===390?844:1000});
  await page.goto('about:blank');await page.goto('file://'+source+route);await page.evaluate(()=>document.fonts.ready);
  if(action)await action();
  const rec=await page.evaluate(({selectors,props})=>{
   const visible=e=>!!(e.getBoundingClientRect().width&&e.getBoundingClientRect().height)&&getComputedStyle(e).visibility!=='hidden';
   const r={title:document.querySelector('h1')?.textContent,hash:location.hash,viewport:{width:innerWidth,height:innerHeight,deviceScale:devicePixelRatio},elements:{},controls:[]};
   for(const s of selectors){r.elements[s]=[...document.querySelectorAll(s)].filter(visible).slice(0,3).map(e=>{const cs=getComputedStyle(e),rect=e.getBoundingClientRect();return {text:e.textContent.trim().slice(0,160),rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},styles:Object.fromEntries(props.map(k=>[k,cs[k]]))}})}
   r.controls=[...document.querySelectorAll('main input,main select,main textarea,main button,main a,dialog[open] input,dialog[open] button,dialog[open] summary')].filter(visible).map(e=>({tag:e.tagName,name:e.name||null,type:e.type||null,text:e.textContent.trim().slice(0,180),label:e.labels?.[0]?.textContent||e.getAttribute('aria-label'),required:e.required||false,disabled:e.disabled||false,href:e.getAttribute('href'),options:e.options?[...e.options].map(x=>({value:x.value,label:x.label})):undefined}));return r;
  },{selectors,props});
  rec.id=id;rec.capture='REFERENCE_ONLY';records.push(rec);
  if(screenshot)await page.screenshot({path:path.join(out,id+'.png'),fullPage:false});
 }
 for(const width of [1440,390]){
  await capture('students-'+width,'#/students',width,null,true);
  await capture('students-sort-'+width,'#/students',width,()=>page.locator('[data-action="sort"][data-scope="students"]').click(),true);
  await capture('students-filter-'+width,'#/students',width,()=>page.locator('[data-action="filters"][data-scope="students"]').click(),true);
  await capture('students-manage-'+width,'#/students',width,()=>page.locator('[data-action="manage"]').first().click(),true);
 }
 for(const m of catalog.modules)await capture('module-'+m.id,'#/'+m.id,1440);
 for(const w of catalog.workflows)await capture(w.id+'-entry','#/flow/'+w.id,1440);
 for(const scenario of ['loading','empty','load-error','denied','expired'])await capture('students-'+scenario,'#/students',1440,()=>page.selectOption('#review-scenario',scenario,{force:true}));
 // Record actual rendered fonts, not merely the CSS fallback list.
 await page.goto('about:blank');await page.goto('file://'+source+'#/students');await page.evaluate(()=>document.fonts.ready);
 const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const dom=await cdp.send('DOM.getDocument');const fonts={};
 for(const selector of ['h1','.nav-item','.personcell strong']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:dom.root.nodeId,selector});if(nodeId)fonts[selector]=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}
 fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify(records,null,2));
 fs.writeFileSync(path.join(out,'environment.json'),JSON.stringify({browser:b.version(),platform:process.platform,deviceScaleFactor:1,bodyFontAvailability:'platform dependent; inspect fonts below',actualFonts:fonts,pageErrors:errors,records:records.length,coverage:'module landings + workflow entry states + Students overlays/scenarios; later wizard states are specified from catalog, not all browser-exercised'},null,2));
 await b.close();console.log(JSON.stringify({records:records.length,pageErrors:errors.length,out}));
})().catch(e=>{console.error(e);process.exit(1)});
