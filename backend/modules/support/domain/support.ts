import {AccessError} from '../../access/contracts/index';
import type {SupportCapability,SupportReferralState} from '../../../../shared/contracts/support';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const supportId=(value:unknown)=>{if(typeof value!=='string'||!UUID.test(value))throw new AccessError('VALIDATION');return value;};
export const supportKey=(value:unknown)=>{if(typeof value!=='string'||value.length<16||value.length>160||!/^[A-Za-z0-9._:-]+$/.test(value))throw new AccessError('VALIDATION');return value;};
export const supportVersion=(value:unknown)=>{if(!Number.isInteger(value)||Number(value)<1)throw new AccessError('VALIDATION');return Number(value);};
const text=(value:unknown,min:number,max:number)=>{if(typeof value!=='string')throw new AccessError('VALIDATION');const normalized=value.trim().replace(/\s+/g,' ');if(normalized.length<min||normalized.length>max)throw new AccessError('VALIDATION');return normalized;};
export const capability=(value:unknown):SupportCapability=>{if(!['REFERRAL_CREATE','SPECIALIST','POLICY_STEWARD','HANDOFF_RECORD'].includes(String(value)))throw new AccessError('VALIDATION');return value as SupportCapability;};
export const referralCreateInput=(value:unknown)=>{const v=value as Record<string,unknown>;return {studentId:supportId(v.studentId),specialistAccountId:supportId(v.specialistAccountId),factualConcern:text(v.factualConcern,20,2000),key:supportKey(v.key)};};
export const referralTransitionInput=(value:unknown)=>{const v=value as Record<string,unknown>,action=String(v.action).toUpperCase();if(!['ACKNOWLEDGE','RETURN','CLOSE'].includes(action))throw new AccessError('VALIDATION');return {action:action as 'ACKNOWLEDGE'|'RETURN'|'CLOSE',expectedVersion:supportVersion(v.expectedVersion),key:supportKey(v.key)};};
export const procedureInput=(value:unknown)=>{const v=value as Record<string,unknown>;return {title:text(v.title,8,120),instruction:text(v.instruction,20,1200),contactLabel:text(v.contactLabel,3,160),responsibleAccountId:supportId(v.responsibleAccountId),key:supportKey(v.key)};};
export const handoffInput=(value:unknown)=>{const v=value as Record<string,unknown>;return {procedureId:supportId(v.procedureId),procedureVersion:supportVersion(v.procedureVersion),safeReference:text(v.safeReference,8,500),key:supportKey(v.key)};};
export const handoffAckInput=(value:unknown)=>{const v=value as Record<string,unknown>;return {expectedVersion:supportVersion(v.expectedVersion),key:supportKey(v.key)};};
export function nextReferralState(current:SupportReferralState,action:'ACKNOWLEDGE'|'RETURN'|'CLOSE'):SupportReferralState{if(action==='ACKNOWLEDGE'&&current==='SENT')return 'ACKNOWLEDGED';if(action==='RETURN'&&(current==='SENT'||current==='ACKNOWLEDGED'))return 'RETURNED';if(action==='CLOSE'&&(current==='ACKNOWLEDGED'||current==='RETURNED'))return 'CLOSED';throw new AccessError('CONFLICT');}
