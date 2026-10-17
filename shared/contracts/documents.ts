export type DocumentUploadState='QUARANTINED'|'READY'|'INVALID'|'BLOCKED'|'SCAN_UNAVAILABLE';
export type DocumentUploadResult=Readonly<{uploadId:string;assetId:string|null;state:DocumentUploadState;version:number;replayed:boolean;mediaType:string|null;size:number}>;
export type DocumentPromotionResult=Readonly<{documentId:string;versionId:string;grantId:string;versionNo:number;grantVersion:number;replayed:boolean}>;
export type DocumentGrantRevocationResult=Readonly<{grantId:string;version:number;status:'REVOKED';replayed:boolean}>;
export type DocumentDownloadMetadata=Readonly<{versionId:string;grantId:string;filename:string;mediaType:'application/pdf'|'image/jpeg'|'image/png';size:number}>;
