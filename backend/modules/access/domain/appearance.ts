import type {BranchThemeUpdateInput,ThemeId,ThemeUpdateInput} from '../../../../shared/contracts/branding';
import {isThemeId} from '../../../../shared/contracts/branding';
import {AccessError,uuidPattern} from './policy';

function revision(value:unknown):number {
  if(!Number.isSafeInteger(value)||Number(value)<1||Number(value)>2147483646)throw new AccessError('VALIDATION');
  return Number(value);
}
function key(value:unknown):string {
  if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');
  return value.toLowerCase();
}
function reason(value:unknown):string {
  if(typeof value!=='string')throw new AccessError('VALIDATION');
  const normalized=value.normalize('NFC').trim();
  if(normalized.length<5||normalized.length>500||/[\u0000-\u001f]/.test(normalized))throw new AccessError('VALIDATION');
  return normalized;
}
export function themeId(value:unknown):ThemeId {
  if(!isThemeId(value))throw new AccessError('VALIDATION');
  return value;
}
export function institutionThemeInput(raw:unknown):ThemeUpdateInput {
  if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');
  const input=raw as Record<string,unknown>;
  return {themeId:themeId(input.themeId),expectedVersion:revision(input.expectedVersion),key:key(input.key),reason:reason(input.reason)};
}
export function branchThemeInput(raw:unknown):BranchThemeUpdateInput {
  if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');
  const input=raw as Record<string,unknown>;
  return {themeId:input.themeId===null?null:themeId(input.themeId),expectedVersion:revision(input.expectedVersion),key:key(input.key),reason:reason(input.reason)};
}
