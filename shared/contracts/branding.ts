export const themeIds = ["forest", "amethyst", "porcelain", "linen"] as const;
export type ThemeId = (typeof themeIds)[number];

export type ResolvedTheme = Readonly<{themeId:ThemeId;source:'branch'|'institution'|'default'}>;
export type AppearanceConfiguration = Readonly<{
  organizationId:string;
  schoolId:string|null;
  selection:ThemeId|null;
  effective:ResolvedTheme;
  version:number;
}>;
export type ThemeUpdateInput = Readonly<{themeId:ThemeId;expectedVersion:number;key:string;reason:string}>;
export type BranchThemeUpdateInput = Readonly<{themeId:ThemeId|null;expectedVersion:number;key:string;reason:string}>;
export type ThemeUpdateResult = AppearanceConfiguration & Readonly<{replayed:boolean}>;

/** Kept only until UX-03 migrates persisted Branding revisions. */
export type LegacyBrandPalette = "indigo" | "clay";
export type BrandPalette = ThemeId | LegacyBrandPalette;

export type ThemeTokens = Readonly<{
  name: string;
  canvas: string;
  surface: string;
  surfaceSubtle: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  onPrimary: string;
  selectionBg: string;
  selectionText: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarMuted: string;
  sidebarHover: string;
  sidebarActive: string;
  sidebarActiveText: string;
  focusRing: string;
  /** Compatibility aliases for the existing safe branding preview contract. */
  soft: string;
  accent: string;
}>;

export const themes: Readonly<Record<ThemeId, ThemeTokens>> = {
  forest: {
    name: "Refined Forest", canvas: "#F6F8F5", surface: "#FFFFFF", surfaceSubtle: "#EEF3EF",
    text: "#1F3028", textMuted: "#56665D", border: "#DCE5DF", primary: "#246B53",
    primaryHover: "#1D5945", primaryPressed: "#174837", onPrimary: "#FFFFFF",
    selectionBg: "#E4F0E9", selectionText: "#194D3B", sidebarBg: "#183D33",
    sidebarText: "#EDF5F0", sidebarMuted: "#B9CFC3", sidebarHover: "#214B3F",
    sidebarActive: "#2B584A", sidebarActiveText: "#FFFFFF", focusRing: "#246B53",
    soft: "#EEF3EF", accent: "#E4F0E9",
  },
  amethyst: {
    name: "Amethyst & Pearl", canvas: "#FAF8FC", surface: "#FFFFFF", surfaceSubtle: "#F2EDF6",
    text: "#2B2333", textMuted: "#6B6075", border: "#E5DFEB", primary: "#7045A2",
    primaryHover: "#5E378C", primaryPressed: "#4E2C77", onPrimary: "#FFFFFF",
    selectionBg: "#EEE5F6", selectionText: "#57317B", sidebarBg: "#30223E",
    sidebarText: "#F1EBF6", sidebarMuted: "#C8B9D5", sidebarHover: "#3D2B4E",
    sidebarActive: "#503860", sidebarActiveText: "#FFFFFF", focusRing: "#7045A2",
    soft: "#F2EDF6", accent: "#EEE5F6",
  },
  porcelain: {
    name: "Porcelain & Ink", canvas: "#F7F9FC", surface: "#FFFFFF", surfaceSubtle: "#EFF3F8",
    text: "#19283F", textMuted: "#596A80", border: "#DCE4EF", primary: "#284FAC",
    primaryHover: "#214292", primaryPressed: "#1B3577", onPrimary: "#FFFFFF",
    selectionBg: "#E5EDFB", selectionText: "#21458F", sidebarBg: "#EFF3F9",
    sidebarText: "#24354D", sidebarMuted: "#5B6C83", sidebarHover: "#E4EBF5",
    sidebarActive: "#D9E5F8", sidebarActiveText: "#1B408A", focusRing: "#284FAC",
    soft: "#EFF3F8", accent: "#E5EDFB",
  },
  linen: {
    name: "Linen & Bronze", canvas: "#FAF9F6", surface: "#FFFFFF", surfaceSubtle: "#F2EEE7",
    text: "#302C27", textMuted: "#6C6358", border: "#E4DFD6", primary: "#795237",
    primaryHover: "#66442E", primaryPressed: "#533723", onPrimary: "#FFFFFF",
    selectionBg: "#EFE4D7", selectionText: "#654229", sidebarBg: "#EDE9E2",
    sidebarText: "#332D26", sidebarMuted: "#6D6256", sidebarHover: "#E5DED3",
    sidebarActive: "#DED1BF", sidebarActiveText: "#4F3623", focusRing: "#795237",
    soft: "#F2EEE7", accent: "#EFE4D7",
  },
};

/** Transitional catalogue for persisted pre-UX-03 revisions. */
export const palettes: Readonly<Record<BrandPalette, ThemeTokens>> = {
  ...themes,
  indigo: themes.amethyst,
  clay: themes.linen,
};

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(themes, value);
}

export function resolveThemeId(value: unknown): ThemeId {
  if (isThemeId(value)) return value;
  if (value === "indigo") return "amethyst";
  if (value === "clay") return "linen";
  return "forest";
}

export type PublicBrand = Readonly<{
  slug: string; institutionName: string; branchName: string; monogram: string;
  palette: ThemeId; welcome: string; supportEmail: string;
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

export function validatePublicBrand(value: unknown): value is PublicBrand {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const brand = value as Record<string, unknown>;
  const nonblank = (text: unknown, maximum: number): text is string =>
    typeof text === "string" && text.trim().length > 0 && text.length <= maximum;
  return typeof brand.slug === "string" && /^[a-z0-9-]{3,80}$/.test(brand.slug)
    && nonblank(brand.institutionName, 160)
    && nonblank(brand.branchName, 160)
    && nonblank(brand.monogram, 3)
    && typeof brand.welcome === "string" && brand.welcome.length <= 180
    && typeof brand.supportEmail === "string" && brand.supportEmail.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brand.supportEmail)
    && isThemeId(brand.palette);
}
