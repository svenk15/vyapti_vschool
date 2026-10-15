import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';

const origin=process.env.VSCHOOL_REFERENCE_URL??'http://127.0.0.1:3474',output='docs/evidence/learning-feedback-lea-04-2026-10-16',source='VSchool_Teacher_Review.html#/learning/review/w1';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});
async function capture(viewport,suffix){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,colorScheme:'light',locale:'en-GB',timezoneId:'Asia/Kolkata',reducedMotion:'reduce'});
 await page.goto(`${origin}/VSchool_Teacher_Review.html#/learning/review/w1`);
 await page.waitForFunction(()=>document.fonts.status==='loaded');
 await page.getByRole('button',{name:'Preview this workflow'}).click();
 await page.getByRole('heading',{name:'Review student work'}).waitFor();
 await page.locator('.reviewbar').evaluate(node=>node.style.display='none');
 await page.screenshot({path:`${output}/reference-private-draft-${suffix}.png`,fullPage:true});
 await page.getByLabel('What worked well').fill('Your explanation names all three changes and connects them to the observation.');
 await page.getByLabel('Next step for learning').fill('Add one labelled diagram to show where each state change occurs.');
 await page.getByRole('button',{name:'Review return'}).click();
 await page.screenshot({path:`${output}/reference-review-${suffix}.png`,fullPage:true});
 const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,width:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}));
 await page.close();return dimensions;
}
const report={capturedAt:new Date().toISOString(),source,desktop:await capture({width:1280,height:1000},'chromium'),mobile:await capture({width:390,height:844},'mobile')};
writeFileSync(`${output}/reference-capture.json`,`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));
await browser.close();
