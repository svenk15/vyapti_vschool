import { describe,expect,it } from "vitest";
import { palettes,contrastRatio,validatePublicBrand } from "../../backend/modules/branding/domain/theme";
const brand={slug:"school-north",institutionName:"Example institution",branchName:"North",monogram:"E",palette:"forest" as const,welcome:"Welcome",supportEmail:"help@school.example"};
describe("safe branding reference rules",()=>{
 it.each(Object.keys(palettes) as (keyof typeof palettes)[])("%s primary/on-primary passes normal-text contrast",key=>{const p=palettes[key];expect(contrastRatio(p.primary,p.onPrimary)).toBeGreaterThanOrEqual(4.5);expect(contrastRatio(p.primary,p.soft)).toBeGreaterThanOrEqual(4.5);});
 it("neutral body and secondary text pairs remain readable",()=>{expect(contrastRatio("#203b33","#f8f9f5")).toBeGreaterThanOrEqual(7);expect(contrastRatio("#5c6d65","#ffffff")).toBeGreaterThanOrEqual(4.5);});
 it("validates synthetic public brand",()=>expect(validatePublicBrand(brand)).toBe(true));
 it("rejects unapproved palette and oversized copy",()=>{expect(validatePublicBrand({...brand,palette:"constructor" as never})).toBe(false);expect(validatePublicBrand({...brand,welcome:"x".repeat(181)})).toBe(false);});
 it("rejects unsafe slug and invalid contact",()=>{expect(validatePublicBrand({...brand,slug:"../other"})).toBe(false);expect(validatePublicBrand({...brand,supportEmail:"javascript:bad"})).toBe(false);});
 it("rejects invalid color input",()=>expect(()=>contrastRatio("url(x)","#ffffff")).toThrow("INVALID_COLOR"));
});
