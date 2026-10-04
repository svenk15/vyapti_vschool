import type { BrandPalette,PublicBrand } from './branding';
export type BrandFields=Readonly<{displayName:string;branchLabel:string;palette:BrandPalette;welcome:string;supportEmail:string;locale:string;logoAssetId:string|null}>;
export type PublishedBrand=Readonly<{id:string;revision:number;fields:BrandFields;publishedAt:string}>;
export type BrandingWorkspace=Readonly<{profileId:string|null;slug:string|null;version:number;draft:BrandFields|null;published:PublishedBrand|null;history:readonly PublishedBrand[];hostChallenge:Readonly<{hostname:string;txtName:string;state:'PENDING'|'VERIFIED'|'REVOKED'}>|null}>;
export type PublicBrandRecord=Readonly<{brand:PublicBrand;logoUrl:string|null;revisionId:string}>;
export type BrandingCommandResult=Readonly<{profileId:string;revisionId:string;revision:number;version:number;publishedAt:string|null;replayed:boolean}>;
