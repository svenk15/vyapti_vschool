import {AccessError,uuidPattern} from '../../access/contracts/index';

const object=(value:unknown)=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');return value as Record<string,unknown>;};
const exact=(input:Record<string,unknown>,allowed:string[])=>{if(Object.keys(input).some(key=>!allowed.includes(key)))throw new AccessError('VALIDATION');};
const integer=(value:unknown,min:number)=>{if(!Number.isInteger(value)||Number(value)<min)throw new AccessError('VALIDATION');return Number(value);};
const uuid=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();};
export const privateResponseText=(value:unknown)=>{if(typeof value!=='string')throw new AccessError('VALIDATION');const text=value.normalize('NFC').replace(/\r\n?/g,'\n');if(text.trim().length<1||text.length>10_000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text))throw new AccessError('VALIDATION');return text;};
export function saveStudentDraftInput(value:unknown){const input=object(value);exact(input,['studentId','expectedVersion','text','key']);return {studentId:uuid(input.studentId),expectedVersion:integer(input.expectedVersion,0),text:privateResponseText(input.text),key:uuid(input.key)};}
export function submitStudentWorkInput(value:unknown){const input=object(value);exact(input,['studentId','reviewedAssignmentVersion','expectedDraftVersion','key']);return {studentId:uuid(input.studentId),reviewedAssignmentVersion:integer(input.reviewedAssignmentVersion,1),expectedDraftVersion:integer(input.expectedDraftVersion,1),key:uuid(input.key)};}
