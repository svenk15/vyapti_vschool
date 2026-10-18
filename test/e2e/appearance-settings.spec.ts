import {mkdirSync} from 'node:fs';
import {randomBytes,randomUUID} from 'node:crypto';
import {expect,test,type Page} from '@playwright/test';
import {createAccessServices} from '../../backend/composition/access';

const databaseUrl=process.env.TEST_DATABASE_URL??'';
if(new URL(databaseUrl).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated E2E PostgreSQL DB required');
const access=createAccessServices({databaseUrl});
const operator={operatorId:randomUUID(),verified:true as const};
const label=randomUUID().slice(0,6).toUpperCase();
const input={organizationName:`Appearance Trust ${label}`,schoolName:`Theme School ${label}`,schoolCode:'THEME',timezone:'Asia/Kolkata',adminEmail:`appearance-${label.toLowerCase()}@vschool.example`,password:randomBytes(24).toString('base64url')};
let scope:Awaited<ReturnType<typeof access.provisionSchool>>;
const evidence='docs/evidence/ux-revamp-04-2026-10-18';

test.beforeAll(async()=>{
  mkdirSync(evidence,{recursive:true});
  scope=await access.provisionSchool(input,operator);
  await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:scope.organizationId,accountId:scope.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic appearance browser authority'},operator);
});
test.afterAll(async()=>access.disconnect());

async function signIn(page:Page){
  await page.goto('/sign-in');
  await page.getByRole('textbox',{name:'Email address',exact:true}).fill(input.adminEmail);
  await page.getByLabel(/^Password/).fill(input.password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(page).toHaveURL(/\/admin$/,{timeout:15000});
}

test('authorized appearance settings preview, cancel, save, inherit, and surface a stale write',async({page})=>{
  await signIn(page);
  await page.goto('/admin/branding/manage');
  const settings=page.locator('.portal-appearance-settings');
  await expect(settings.getByRole('radio',{name:/Use institution theme/})).toBeChecked();
  await expect(settings.getByText('Currently Refined Forest')).toBeVisible();

  const porcelain=settings.getByRole('radio',{name:/Porcelain & Ink/});
  await porcelain.focus();
  await expect(porcelain).toBeFocused();
  await page.keyboard.press('Space');
  await expect(porcelain).toBeChecked();
  await settings.getByRole('button',{name:'Preview theme'}).click();
  await expect(settings.getByText('Theme preview — changes are not saved.')).toBeVisible();
  await expect(page.locator('.appearance-preview-surface')).toHaveAttribute('data-vs-theme','porcelain');
  await settings.getByRole('button',{name:'Cancel'}).click();
  await expect(settings.getByRole('radio',{name:/Use institution theme/})).toBeChecked();
  await expect(page.locator('.appearance-preview-surface')).toHaveAttribute('data-vs-theme','forest');

  await settings.getByRole('radio',{name:/Amethyst & Pearl/}).check();
  await settings.getByRole('button',{name:'Save changes'}).click();
  await expect(settings.getByText('Theme updated.')).toBeVisible();
  await page.reload();
  await expect(settings.getByRole('radio',{name:/Amethyst & Pearl/})).toBeChecked();

  const identity={accountId:scope.accountId,tokenVersion:1};
  const current=await access.getAppearanceConfiguration(identity,scope.organizationId,scope.schoolId);
  await access.updateBranchTheme(identity,scope.organizationId,scope.schoolId,{themeId:'linen',expectedVersion:current.version,key:randomUUID(),reason:'Synthetic concurrent appearance change'});
  await settings.getByRole('radio',{name:/Porcelain & Ink/}).check();
  await settings.getByRole('button',{name:'Save changes'}).click();
  await expect(settings.getByText('Appearance changed')).toBeVisible();
  await expect(settings.getByText(/Current: Linen & Bronze\. Attempted: Porcelain & Ink\./)).toBeVisible();
  await expect(settings.getByRole('radio',{name:/Porcelain & Ink/})).toBeChecked();
  await settings.getByRole('button',{name:'Save changes'}).click();
  await expect(settings.getByText('Theme updated.')).toBeVisible();

  await page.goto('/institutions');
  const institution=page.locator('.portal-appearance-settings');
  await expect(institution.getByRole('radio',{name:/Refined Forest/})).toBeChecked();
  await institution.getByRole('radio',{name:/Amethyst & Pearl/}).check();
  await institution.getByRole('button',{name:'Preview theme'}).click();
  await expect(page.locator('.appearance-preview-surface')).toHaveAttribute('data-vs-theme','amethyst');
  await institution.getByRole('button',{name:'Save changes'}).click();
  await expect(institution.getByText('Theme updated.')).toBeVisible();
  await expect(page.getByText('Use institution theme').last()).toBeVisible();
  await expect(page.getByText('Currently Amethyst & Pearl')).toBeVisible();

  await page.screenshot({path:`${evidence}/appearance-settings-${test.info().project.name}.png`,fullPage:true});
  await page.reload();
  await expect(institution.getByRole('radio',{name:/Amethyst & Pearl/})).toBeChecked();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
