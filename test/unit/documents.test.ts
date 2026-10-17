import {describe,expect,it} from 'vitest';
import {AccessError} from '../../backend/modules/access/contracts/index';
import {DOCUMENT_BRANCH_QUOTA_BYTES,DOCUMENT_MAX_ATTACHMENTS,DOCUMENT_MAX_BYTES,detectMediaType,displayFilename,documentMediaType,filenameMatches,safetyState} from '../../backend/modules/documents/domain/documents';
import {sha256} from '../../backend/modules/documents/infrastructure/hashing';

describe('Documents safe-file domain',()=>{
 it('uses the approved synthetic limits and detects only the initial signature allowlist',()=>{expect(DOCUMENT_MAX_BYTES).toBe(10*1024*1024);expect(DOCUMENT_MAX_ATTACHMENTS).toBe(5);expect(DOCUMENT_BRANCH_QUOTA_BYTES).toBe(100*1024*1024);expect(detectMediaType(Uint8Array.from([0x25,0x50,0x44,0x46,0x2d]))).toBe('application/pdf');expect(detectMediaType(Uint8Array.from([0xff,0xd8,0xff,0x00]))).toBe('image/jpeg');expect(detectMediaType(Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))).toBe('image/png');expect(detectMediaType(new TextEncoder().encode('<svg/>'))).toBeNull();});
 it('normalizes a display name while rejecting path tricks, mismatches and unsupported media',()=>{expect(displayFilename('folder\\report.pdf')).toBe('report.pdf');expect(filenameMatches('photo.JPEG','image/jpeg')).toBe(true);expect(filenameMatches('report.png','application/pdf')).toBe(false);expect(()=>displayFilename('../')).toThrow(AccessError);expect(()=>documentMediaType('text/html')).toThrow(AccessError);});
 it('never promotes error or unavailable scanner evidence',()=>{expect(safetyState('CLEAN')).toBe('READY');expect(safetyState('BLOCKED')).toBe('BLOCKED');expect(safetyState('ERROR')).toBe('SCAN_UNAVAILABLE');expect(safetyState('UNAVAILABLE')).toBe('SCAN_UNAVAILABLE');expect(sha256(new TextEncoder().encode('same'))).toMatch(/^[0-9a-f]{64}$/);});
});
