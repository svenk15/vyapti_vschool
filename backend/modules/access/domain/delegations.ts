import type {LeadershipDelegationAction} from '../../../../shared/contracts/access';
import {AccessError,uuidPattern} from './policy';

export const leadershipDelegationActions = [
  'leadership.read',
  'attendance.read_leadership',
  'timetable.read_leadership',
  'timetable.cover.approve',
  'learning.read_leadership',
  'communication.read_leadership',
] as const satisfies readonly LeadershipDelegationAction[];

function clean(value:unknown,max:number){
  if(typeof value!=='string')throw new AccessError('VALIDATION');
  const result=value.normalize('NFC').trim();
  if(!result||result.length>max||/[\u0000-\u001f\u007f]/.test(result))throw new AccessError('VALIDATION');
  return result;
}
function instant(value:unknown){
  if(typeof value!=='string')throw new AccessError('VALIDATION');
  const result=new Date(value);
  if(!Number.isFinite(result.getTime())||result.toISOString()!==value)throw new AccessError('VALIDATION');
  return result;
}
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}

export function normalizeDelegationIssue(value:unknown){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');
  const input=value as Record<string,unknown>,startsAt=instant(input.startsAt),endsAt=instant(input.endsAt);
  if(endsAt<=startsAt||endsAt.getTime()-startsAt.getTime()>30*24*60*60*1000)throw new AccessError('VALIDATION');
  if(!Array.isArray(input.actions)||input.actions.length===0)throw new AccessError('VALIDATION');
  const actions=[...new Set(input.actions.map(action=>{
    if(typeof action!=='string'||!leadershipDelegationActions.includes(action as LeadershipDelegationAction))throw new AccessError('VALIDATION');
    return action as LeadershipDelegationAction;
  }))].sort();
  if(!actions.includes('leadership.read'))throw new AccessError('VALIDATION');
  return {organizationId:id(input.organizationId),schoolId:id(input.schoolId),employeeId:id(input.employeeId),actions,startsAt,endsAt,reason:clean(input.reason,500),key:id(input.key)};
}

export function normalizeDelegationRevoke(value:unknown){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');
  const input=value as Record<string,unknown>;
  if(!Number.isInteger(input.expectedVersion)||Number(input.expectedVersion)<1)throw new AccessError('VALIDATION');
  return {organizationId:id(input.organizationId),schoolId:id(input.schoolId),delegationId:id(input.delegationId),expectedVersion:Number(input.expectedVersion),reason:clean(input.reason,500),key:id(input.key)};
}
