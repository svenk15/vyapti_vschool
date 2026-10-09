import {AccessError,uuidPattern} from '../../access/contracts/index';
import type {AcademicTermRecord} from '../../../../shared/contracts/academics';
const datePattern=/^\d{4}-\d{2}-\d{2}$/;
export function civilDate(value:unknown):string{
 if(typeof value!=='string'||!datePattern.test(value))throw new AccessError('VALIDATION');
 const [year,month,day]=value.split('-').map(Number),date=new Date(Date.UTC(year,month-1,day));
 if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)throw new AccessError('VALIDATION');
 return value;
}
export function code(value:unknown):string{
 if(typeof value!=='string')throw new AccessError('VALIDATION');const normalized=value.normalize('NFC').trim().toUpperCase();
 if(normalized.length<1||normalized.length>40||!/^[A-Z0-9][A-Z0-9_-]*$/.test(normalized))throw new AccessError('VALIDATION');return normalized;
}
export function name(value:unknown):string{
 if(typeof value!=='string')throw new AccessError('VALIDATION');const normalized=value.normalize('NFC').trim();
 if(normalized.length<1||normalized.length>160||/[\u0000-\u001f]/.test(normalized))throw new AccessError('VALIDATION');return normalized;
}
export function positiveVersion(value:unknown):number{if(!Number.isSafeInteger(value)||Number(value)<1||Number(value)>2147483646)throw new AccessError('VALIDATION');return Number(value);}
export function identifier(value:unknown):string{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
export function validateRange(startValue:unknown,endValue:unknown){const startsOn=civilDate(startValue),endsOn=civilDate(endValue);if(startsOn>=endsOn)throw new AccessError('VALIDATION');return {startsOn,endsOn};}
export function validateTerms(raw:unknown,year:{startsOn:string;endsOn:string}):Omit<AcademicTermRecord,'id'>[]{
 if(!Array.isArray(raw)||raw.length>24)throw new AccessError('VALIDATION');
 const terms=raw.map(item=>{if(!item||typeof item!=='object')throw new AccessError('VALIDATION');const value=item as Record<string,unknown>,range=validateRange(value.startsOn,value.endsOn);return {code:code(value.code),name:name(value.name),...range};});
 if(new Set(terms.map(t=>t.code)).size!==terms.length)throw new AccessError('CONFLICT');
 terms.sort((a,b)=>a.startsOn.localeCompare(b.startsOn)||a.endsOn.localeCompare(b.endsOn));
 for(let i=0;i<terms.length;i++){const term=terms[i]!;if(term.startsOn<year.startsOn||term.endsOn>year.endsOn)throw new AccessError('VALIDATION');if(i&&terms[i-1]!.endsOn>term.startsOn)throw new AccessError('VALIDATION');}
 return terms;
}
