import {AccessError} from '../../access/contracts/index';

export const STAFF_CATEGORIES=['TEACHING','ADMINISTRATION','SUPPORT'] as const;
export type StaffCategory=(typeof STAFF_CATEGORIES)[number];
export type StoredStaffCategory=StaffCategory|'UNCLASSIFIED';
export type EmployeeInput={firstName:string;lastName:string;contactEmail:string|null;staffNumber:string;category:StaffCategory;employedFrom:string};
function humanName(value:unknown,required:boolean,max:number):string{
 if(typeof value!=='string')throw new AccessError('VALIDATION');const normalized=value.normalize('NFC').trim();
 if((required&&normalized.length===0)||normalized.length>max||/[\u0000-\u001f\u007f]/.test(normalized))throw new AccessError('VALIDATION');return normalized;
}
export function civilDate(value:unknown):string{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new AccessError('VALIDATION');
 const [year,month,day]=value.split('-').map(Number),date=new Date(Date.UTC(year,month-1,day));
 if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)throw new AccessError('VALIDATION');return value;
}
export function staffCategory(value:unknown):StaffCategory{
 if(typeof value!=='string'||!STAFF_CATEGORIES.includes(value as StaffCategory))throw new AccessError('VALIDATION');
 return value as StaffCategory;
}
export function employeeInput(raw:{firstName:unknown;lastName?:unknown;contactEmail?:unknown;staffNumber:unknown;category:unknown;employedFrom:unknown}):EmployeeInput{
 const firstName=humanName(raw.firstName,true,100),lastName=humanName(raw.lastName??'',false,100),staffNumber=humanName(raw.staffNumber,true,40),category=staffCategory(raw.category),employedFrom=civilDate(raw.employedFrom);
 let contactEmail:string|null=null;if(raw.contactEmail!=null&&raw.contactEmail!==''){if(typeof raw.contactEmail!=='string')throw new AccessError('VALIDATION');contactEmail=raw.contactEmail.normalize('NFC').trim();if(contactEmail.length<3||contactEmail.length>254||/[\u0000-\u0020\u007f]/.test(contactEmail)||!/^[^@]+@[^@]+\.[^@]+$/.test(contactEmail))throw new AccessError('VALIDATION');}
 return {firstName,lastName,contactEmail,staffNumber,category,employedFrom};
}
export function displayName(firstName:string,lastName:string):string{return `${firstName} ${lastName}`.trim();}
