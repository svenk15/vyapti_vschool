import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';

const origin=process.env.VSCHOOL_REFERENCE_URL??'http://127.0.0.1:3471';
const output='docs/evidence/admin-sa-23-2026-10-11';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});

async function capture(viewport,suffix){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  await page.goto(`${origin}/VSchool_School_Admin_Review.html#/flow/SA-23`);
  await page.waitForFunction(()=>document.fonts.status==='loaded');
  await page.locator('.reviewbar').evaluate(node=>node.style.display='none');
  await page.getByLabel('Academic year').selectOption({index:1});
  await page.getByLabel('Placement effective from').fill('2026-10-04');
  await page.screenshot({path:`${output}/reference-target-${suffix}.png`,fullPage:true});
  await page.getByRole('button',{name:'Continue'}).click();
  await page.getByLabel('CSV file').setInputFiles({name:'preview-only.csv',mimeType:'text/csv',buffer:Buffer.from('student\nJordan Example\n')});
  await page.screenshot({path:`${output}/reference-file-${suffix}.png`,fullPage:true});
  await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('checkbox').check();
  await page.screenshot({path:`${output}/reference-review-${suffix}.png`,fullPage:true});
  await page.getByRole('button',{name:'Continue'}).click();
  await page.screenshot({path:`${output}/reference-confirm-${suffix}.png`,fullPage:true});
  const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,width:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}));
  await page.close();
  return dimensions;
}

const report={capturedAt:new Date().toISOString(),source:'docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-23',desktop:await capture({width:1440,height:1000},'desktop'),mobile:await capture({width:390,height:844},'mobile')};
writeFileSync(`${output}/reference-capture.json`,`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));
await browser.close();
