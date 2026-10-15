import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const origin=process.env.VSCHOOL_REFERENCE_URL??'http://127.0.0.1:3475',output='docs/evidence/student-sessions-stw-44-2026-10-16';mkdirSync(output,{recursive:true});const browser=await chromium.launch();
for(const [name,viewport] of [['chromium',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){const page=await browser.newPage({viewport,deviceScaleFactor:1});await page.goto(`${origin}/VSchool_Student_Review.html#/flow/STW-44`);await page.waitForFunction(()=>document.fonts.status==='loaded');await page.locator('.reviewbar').evaluate(node=>node.style.display='none');await page.screenshot({path:`${output}/reference-review-${name}.png`,fullPage:true});await page.getByLabel('What would you like to change or ask?').fill('End access on the mobile web browser started today.');await page.getByRole('button',{name:/Continue/}).click();await page.screenshot({path:`${output}/reference-confirm-${name}.png`,fullPage:true});await page.close();}
await browser.close();
