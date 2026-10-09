import {AccessError,uuidPattern} from '../../access/contracts/index';
import type {AttendanceCorrectionChange,AttendanceMarkEntry,AttendanceStatus} from '../../../../shared/contracts/attendance';

function version(value:unknown){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<1)throw new AccessError('VALIDATION');return value;}
function key(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
function exactKeys(value:object,allowed:readonly string[]){if(Object.keys(value).some(name=>!allowed.includes(name)))throw new AccessError('VALIDATION');}
export function cancellationPermissions(status:unknown):readonly ('class.manage'|'attendance.correct')[]{if(status==='SCHEDULED'||status==='OPEN')return ['class.manage'];if(status==='SUBMITTED')return ['attendance.correct'];if(status==='CANCELLED')return ['class.manage','attendance.correct'];throw new AccessError('CONFLICT');}
export function openSessionInput(input:{expectedVersion:unknown;key:unknown}){exactKeys(input,['expectedVersion','key']);return {expectedVersion:version(input.expectedVersion),key:key(input.key)};}
export function cancelSessionInput(input:{expectedVersion:unknown;reason:unknown;key:unknown}){exactKeys(input,['expectedVersion','reason','key']);if(typeof input.reason!=='string')throw new AccessError('VALIDATION');const reason=input.reason.normalize('NFC').trim();if(reason.length<5||reason.length>500||/[\u0000-\u001f\u007f]/.test(reason))throw new AccessError('VALIDATION');return {expectedVersion:version(input.expectedVersion),reason,key:key(input.key)};}
export function commandStatusInput(command:unknown,keyValue:unknown):{command:'attendance.submit'|'attendance.cancel';key:string}{if(command!=='attendance.submit'&&command!=='attendance.cancel')throw new AccessError('NOT_FOUND');return {command,key:key(keyValue)};}
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
export function correctSessionInput(input:{expectedVersion:unknown;changes:unknown;reason:unknown;key:unknown}){
 exactKeys(input,['expectedVersion','changes','reason','key']);
 if(typeof input.reason!=='string')throw new AccessError('VALIDATION');const reason=input.reason.normalize('NFC').trim();if(reason.length<5||reason.length>500||/[\u0000-\u001f]/.test(reason))throw new AccessError('VALIDATION');
 if(!Array.isArray(input.changes)||input.changes.length<1||input.changes.length>200)throw new AccessError('VALIDATION');
 const seen=new Set<string>(),changes:AttendanceCorrectionChange[]=input.changes.map(value=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');const entry=value as Record<string,unknown>;exactKeys(entry,['studentId','status','lateMinutes']);
  if(typeof entry.studentId!=='string'||!uuidPattern.test(entry.studentId))throw new AccessError('VALIDATION');const studentId=entry.studentId.toLowerCase();if(seen.has(studentId))throw new AccessError('VALIDATION');seen.add(studentId);
  if(!['PRESENT','ABSENT','LATE','EXCUSED'].includes(String(entry.status)))throw new AccessError('VALIDATION');const status=entry.status as AttendanceStatus;
  if(status==='LATE'){if(typeof entry.lateMinutes!=='number'||!Number.isInteger(entry.lateMinutes)||entry.lateMinutes<1||entry.lateMinutes>480)throw new AccessError('VALIDATION');return {studentId,status,lateMinutes:entry.lateMinutes};}
  if(entry.lateMinutes!==undefined)throw new AccessError('VALIDATION');return {studentId,status};
 });
 return {expectedVersion:version(input.expectedVersion),changes,reason,key:key(input.key)};
}
