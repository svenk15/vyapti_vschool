import { describe,expect,it } from "vitest";
import { themes,themeIds,resolveThemeId,contrastRatio,validatePublicBrand } from "../../backend/modules/branding/domain/theme";
const brand={slug:"school-north",institutionName:"Example institution",branchName:"North",monogram:"E",palette:"forest" as const,welcome:"Welcome",supportEmail:"help@school.example"};
describe("safe branding reference rules",()=>{
 it.each(themeIds)("%s primary/on-primary and body pairs pass normal-text contrast",key=>{const p=themes[key];expect(contrastRatio(p.primary,p.onPrimary)).toBeGreaterThanOrEqual(4.5);expect(contrastRatio(p.text,p.canvas)).toBeGreaterThanOrEqual(4.5);expect(contrastRatio(p.textMuted,p.surface)).toBeGreaterThanOrEqual(4.5);});
 it("normalizes known legacy values and fails unknown reads safely to forest",()=>{expect(resolveThemeId("indigo")).toBe("amethyst");expect(resolveThemeId("clay")).toBe("linen");expect(resolveThemeId("url(evil)")).toBe("forest");});
 it("validates synthetic public brand",()=>expect(validatePublicBrand(brand)).toBe(true));
 it("rejects unapproved palette and oversized copy",()=>{expect(validatePublicBrand({...brand,palette:"constructor" as never})).toBe(false);expect(validatePublicBrand({...brand,welcome:"x".repeat(181)})).toBe(false);});
 it("rejects unsafe slug and invalid contact",()=>{expect(validatePublicBrand({...brand,slug:"../other"})).toBe(false);expect(validatePublicBrand({...brand,supportEmail:"javascript:bad"})).toBe(false);});
 it("rejects invalid color input",()=>expect(()=>contrastRatio("url(x)","#ffffff")).toThrow("INVALID_COLOR"));
});

describe("public preview runtime and storage-contract bounds", () => {
 it.each([undefined, null, false, 42, "brand", [], {}, { ...brand, institutionName: null }, { ...brand, supportEmail: 42 }, { ...brand, welcome: undefined }])("rejects malformed runtime projection %j without throwing", value => {
  expect(validatePublicBrand(value)).toBe(false);
 });
 it("enforces documented slug and display-name boundaries", () => {
  expect(validatePublicBrand({ ...brand, slug: "abc" })).toBe(true);
  expect(validatePublicBrand({ ...brand, slug: "a".repeat(80), institutionName: "n".repeat(160), branchName: "b".repeat(160) })).toBe(true);
  for (const value of [{ slug: "ab" }, { slug: "a".repeat(81) }, { slug: "UPPER" }, { institutionName: " " }, { branchName: " " }, { institutionName: "n".repeat(161) }, { branchName: "b".repeat(161) }, { monogram: " " }, { monogram: "ABCD" }]) {
   expect(validatePublicBrand({ ...brand, ...value })).toBe(false);
  }
 });
 it("bounds support email and rejects every inherited palette key", () => {
  expect(validatePublicBrand({ ...brand, supportEmail: "a".repeat(240) + "@school.example" })).toBe(false);
  expect(validatePublicBrand({ ...brand, supportEmail: "a".repeat(239) + "@school.example" })).toBe(true);
  for (const palette of ["constructor", "toString", "__proto__", "hasOwnProperty"]) expect(validatePublicBrand({ ...brand, palette })).toBe(false);
 });
});
