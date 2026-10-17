export type DocumentUploadState='QUARANTINED'|'READY'|'INVALID'|'BLOCKED'|'SCAN_UNAVAILABLE';
export type DocumentUploadResult=Readonly<{uploadId:string;assetId:string|null;state:DocumentUploadState;version:number;replayed:boolean;mediaType:string|null;size:number}>;
