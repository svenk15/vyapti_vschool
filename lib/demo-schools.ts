import { validatePublicBrand, type PublicBrand } from "@/shared/contracts/branding";

/** Public synthetic branding only. These fixtures create no tenant, account or entitlement. */
export const demoSchools: readonly PublicBrand[] = [
  {slug:"greenwood-north",institutionName:"Greenwood Schools",branchName:"North Campus",monogram:"G",palette:"forest",welcome:"A little more connected. A lot more possible.",supportEmail:"office@greenwood.example"},
  {slug:"greenwood-south",institutionName:"Greenwood Schools",branchName:"South Campus",monogram:"G",palette:"clay",welcome:"One community. A new day of possibilities.",supportEmail:"office@greenwood.example"},
  {slug:"aster-central",institutionName:"Aster Learning Trust",branchName:"Central School",monogram:"A",palette:"indigo",welcome:"A thoughtful space for a brighter school day.",supportEmail:"office@aster.example"},
];
export function findDemoSchool(slug:string) {
 const brand=demoSchools.find(s=>s.slug===slug);
 return brand&&validatePublicBrand(brand)?brand:undefined;
}
