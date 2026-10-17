import {AccessError,uuidPattern} from '../../access/contracts/index';

export const DOCUMENT_MAX_BYTES=10*1024*1024;
export const DOCUMENT_BRANCH_QUOTA_BYTES=100*1024*1024;
export const DOCUMENT_MAX_ATTACHMENTS=5;
export const DOCUMENT_MEDIA_TYPES=['application/pdf','image/jpeg','image/png'] as const;
export type DocumentMediaType=typeof DOCUMENT_MEDIA_TYPES[number];
export type DocumentSafetyState='QUARANTINED'|'READY'|'INVALID'|'BLOCKED'|'SCAN_UNAVAILABLE';
export type ScanVerdict='CLEAN'|'BLOCKED'|'ERROR'|'UNAVAILABLE';

const keyPattern=/^[-A-Za-z0-9_:.]{16,100}$/;
const hashPattern=/^[0-9a-f]{64}$/;
export function documentId(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;}
export function documentKey(value:unknown){if(typeof value!=='string'||!keyPattern.test(value))throw new AccessError('VALIDATION');return value;}
export function documentHash(value:unknown){if(typeof value!=='string'||!hashPattern.test(value))throw new AccessError('VALIDATION');return value;}
export function documentSize(value:unknown){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<1||value>DOCUMENT_MAX_BYTES)throw new AccessError('VALIDATION');return value;}
export function documentVersion(value:unknown){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<1)throw new AccessError('VALIDATION');return value;}
export function documentClassification(value:unknown){if(typeof value!=='string'||!/^[A-Z][A-Z0-9_]{1,39}$/.test(value))throw new AccessError('VALIDATION');return value;}
export function documentReason(value:unknown){if(typeof value!=='string')throw new AccessError('VALIDATION');const result=value.normalize('NFC').trim();if(result.length<10||result.length>500||/[\u0000-\u001f\u007f]/.test(result))throw new AccessError('VALIDATION');return result;}
export function documentMediaType(value:unknown):DocumentMediaType{if(!DOCUMENT_MEDIA_TYPES.includes(value as DocumentMediaType))throw new AccessError('VALIDATION');return value as DocumentMediaType;}
export function displayFilename(value:unknown){
 if(typeof value!=='string')throw new AccessError('VALIDATION');
 const normalized=value.normalize('NFC').replaceAll('\\','/').split('/').at(-1)?.replace(/[\u0000-\u001f\u007f]/g,'').trim()??'';
 if(!normalized||normalized.length>180||normalized==='.'||normalized==='..')throw new AccessError('VALIDATION');
 return normalized;
}
export function extensionFor(mediaType:DocumentMediaType){return mediaType==='application/pdf'?'.pdf':mediaType==='image/jpeg'?'.jpg':'.png';}
export function filenameMatches(name:string,mediaType:DocumentMediaType){const lower=name.toLowerCase();return mediaType==='application/pdf'?lower.endsWith('.pdf'):mediaType==='image/jpeg'?(lower.endsWith('.jpg')||lower.endsWith('.jpeg')):lower.endsWith('.png');}
export function detectMediaType(bytes:Uint8Array):DocumentMediaType|null{
 if(bytes.length>=5&&bytes[0]===0x25&&bytes[1]===0x50&&bytes[2]===0x44&&bytes[3]===0x46&&bytes[4]===0x2d)return 'application/pdf';
 if(bytes.length>=3&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'image/jpeg';
 if(bytes.length>=8&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47&&bytes[4]===0x0d&&bytes[5]===0x0a&&bytes[6]===0x1a&&bytes[7]===0x0a)return 'image/png';
 return null;
}
export function safetyState(verdict:ScanVerdict):DocumentSafetyState{return verdict==='CLEAN'?'READY':verdict==='BLOCKED'?'BLOCKED':'SCAN_UNAVAILABLE';}
