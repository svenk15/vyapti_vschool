export type BrandPalette = "forest" | "indigo" | "clay";
export const palettes = {
  forest: { name: "Forest", primary: "#245c49", onPrimary: "#ffffff", soft: "#e9f1e9", accent: "#dbe9b9" },
  indigo: { name: "Indigo", primary: "#464985", onPrimary: "#ffffff", soft: "#eeedf6", accent: "#dedcf0" },
  clay: { name: "Clay", primary: "#854e3c", onPrimary: "#ffffff", soft: "#f7eee8", accent: "#eed9c9" },
} as const;

export type PublicBrand = Readonly<{
  slug: string; institutionName: string; branchName: string; monogram: string;
  palette: BrandPalette; welcome: string; supportEmail: string;
}>;

export function contrastRatio(a: string, b: string): number {
  function luminance(hex: string) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error("INVALID_COLOR");
    const [r,g,b] = [1,3,5].map(i => {
      const c = parseInt(hex.slice(i,i+2),16)/255;
      return c<=0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4;
    });
    return .2126*r+.7152*g+.0722*b;
  }
  const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (values[0]+.05)/(values[1]+.05);
}

export function validatePublicBrand(brand: PublicBrand): boolean {
  return /^[a-z0-9-]{1,60}$/.test(brand.slug)
    && brand.institutionName.length>0 && brand.institutionName.length<=120
    && brand.branchName.length>0 && brand.branchName.length<=120
    && brand.monogram.length>0 && brand.monogram.length<=3
    && brand.welcome.length<=180
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brand.supportEmail)
    && Object.prototype.hasOwnProperty.call(palettes,brand.palette);
}
