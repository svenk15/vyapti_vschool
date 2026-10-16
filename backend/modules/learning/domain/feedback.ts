import {AccessError,uuidPattern} from '../../access/contracts/index';

const object=(value:unknown)=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');return value as Record<string,unknown>;};
const exact=(input:Record<string,unknown>,allowed:string[])=>{if(Object.keys(input).some(key=>!allowed.includes(key)))throw new AccessError('VALIDATION');};
const integer=(value:unknown,min:number)=>{if(!Number.isInteger(value)||Number(value)<min)throw new AccessError('VALIDATION');return Number(value);};
const uuid=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();};
export const feedbackText=(value:unknown)=>{if(typeof value!=='string')throw new AccessError('VALIDATION');const text=value.normalize('NFC').replace(/\r\n?/g,'\n').trim();if(!text||text.length>4000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text))throw new AccessError('VALIDATION');return text;};
export function saveFeedbackInput(value:unknown){const input=object(value);exact(input,['expectedRevision','strength','nextStep','key']);return {expectedRevision:integer(input.expectedRevision,0),strength:feedbackText(input.strength),nextStep:feedbackText(input.nextStep),key:uuid(input.key)};}
export function publishFeedbackInput(value:unknown){const input=object(value);exact(input,['expectedRevision','reviewedSubmissionId','key']);return {expectedRevision:integer(input.expectedRevision,1),reviewedSubmissionId:uuid(input.reviewedSubmissionId),key:uuid(input.key)};}
