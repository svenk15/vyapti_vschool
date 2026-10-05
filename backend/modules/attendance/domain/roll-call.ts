import {AccessError,uuidPattern} from '../../access/contracts/index';
import type {AttendanceMarkEntry,AttendanceStatus} from '../../../../shared/contracts/attendance';

function version(value:unknown){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<1)throw new AccessError('VALIDATION');return value;}
function key(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
function exactKeys(value:object,allowed:readonly string[]){if(Object.keys(value).some(name=>!allowed.includes(name)))throw new AccessError('VALIDATION');}
export function openSessionInput(input:{expectedVersion:unknown;key:unknown}){exactKeys(input,['expectedVersion','key']);return {expectedVersion:version(input.expectedVersion),key:key(input.key)};}
export function submitSessionInput(input:{expectedVersion:unknown;rosterRevision:unknown;entries:unknown;key:unknown}){
 exactKeys(input,['expectedVersion','rosterRevision','entries','key']);
 if(typeof input.rosterRevision!=='string'||!/^[a-f0-9]{64}$/.test(input.rosterRevision))throw new AccessError('VALIDATION');
 if(!Array.isArray(input.entries)||input.entries.length<1||input.entries.length>200)throw new AccessError('VALIDATION');
 const seen=new Set<string>(),entries:AttendanceMarkEntry[]=input.entries.map((value)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');const entry=value as Record<string,unknown>;exactKeys(entry,['studentId','status','lateMinutes']);
  if(typeof entry.studentId!=='string'||!uuidPattern.test(entry.studentId))throw new AccessError('VALIDATION');const studentId=entry.studentId.toLowerCase();if(seen.has(studentId))throw new AccessError('VALIDATION');seen.add(studentId);
  if(!['PRESENT','ABSENT','LATE','EXCUSED'].includes(String(entry.status)))throw new AccessError('VALIDATION');const status=entry.status as AttendanceStatus;
  if(status==='LATE'){if(typeof entry.lateMinutes!=='number'||!Number.isInteger(entry.lateMinutes)||entry.lateMinutes<1||entry.lateMinutes>480)throw new AccessError('VALIDATION');return {studentId,status,lateMinutes:entry.lateMinutes};}
  if(entry.lateMinutes!==undefined)throw new AccessError('VALIDATION');return {studentId,status};
 });
 return {expectedVersion:version(input.expectedVersion),rosterRevision:input.rosterRevision,entries,key:key(input.key)};
}
