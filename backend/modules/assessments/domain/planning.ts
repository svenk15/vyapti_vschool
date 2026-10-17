import {AssessmentsError,uuid} from './readiness';

const integer=(value:unknown,min:number,max:number)=>{if(!Number.isSafeInteger(value)||Number(value)<min||Number(value)>max)throw new AssessmentsError('VALIDATION');return Number(value);};
const text=(value:unknown,max:number)=>{if(typeof value!=='string')throw new AssessmentsError('VALIDATION');const clean=value.trim().replace(/\s+/g,' ');if(!clean||clean.length>max)throw new AssessmentsError('VALIDATION');return clean;};
const code=(value:unknown)=>{const clean=text(value,40).toUpperCase();if(!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(clean))throw new AssessmentsError('VALIDATION');return clean;};
const key=(value:unknown)=>uuid(value);

export type CreateScaleInput=Readonly<{code:string;name:string;minimumScaled:number;maximumScaled:number;precision:number;rounding:'HALF_UP'|'HALF_EVEN';key:string}>;
export function scaleInput(value:Record<string,unknown>):CreateScaleInput{
 const precision=integer(value.precision,0,3),minimumScaled=integer(value.minimumScaled,0,1_000_000_000),maximumScaled=integer(value.maximumScaled,1,1_000_000_000);
 if(maximumScaled<=minimumScaled||(value.rounding!=='HALF_UP'&&value.rounding!=='HALF_EVEN'))throw new AssessmentsError('VALIDATION');
 return {code:code(value.code),name:text(value.name,120),minimumScaled,maximumScaled,precision,rounding:value.rounding,key:key(value.key)};
}

export type PlanItemInput=Readonly<{subjectId:string;maximumScaled:number;weightBasisPoints:number;required:boolean}>;
export type CreateCycleInput=Readonly<{academicYearId:string;sectionId:string;scaleId:string;code:string;name:string;sourceCutoff:string;items:readonly PlanItemInput[];key:string}>;
export function cycleInput(value:Record<string,unknown>):CreateCycleInput{
 if(!Array.isArray(value.items)||value.items.length<1||value.items.length>30)throw new AssessmentsError('VALIDATION');
 const items=value.items.map(item=>{if(!item||typeof item!=='object'||Array.isArray(item))throw new AssessmentsError('VALIDATION');const row=item as Record<string,unknown>;if(typeof row.required!=='boolean')throw new AssessmentsError('VALIDATION');return {subjectId:uuid(row.subjectId),maximumScaled:integer(row.maximumScaled,1,1_000_000_000),weightBasisPoints:integer(row.weightBasisPoints,1,10_000),required:row.required};});
 if(new Set(items.map(item=>item.subjectId)).size!==items.length||items.filter(item=>item.required).reduce((sum,item)=>sum+item.weightBasisPoints,0)!==10_000)throw new AssessmentsError('VALIDATION');
 if(typeof value.sourceCutoff!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value.sourceCutoff)||!Number.isFinite(Date.parse(value.sourceCutoff)))throw new AssessmentsError('VALIDATION');
 return {academicYearId:uuid(value.academicYearId),sectionId:uuid(value.sectionId),scaleId:uuid(value.scaleId),code:code(value.code),name:text(value.name,160),sourceCutoff:new Date(value.sourceCutoff).toISOString(),items,key:key(value.key)};
}

export type FreezeCohortInput=Readonly<{cycleId:string;expectedVersion:number;key:string}>;
export function freezeInput(value:Record<string,unknown>):FreezeCohortInput{return {cycleId:uuid(value.cycleId),expectedVersion:integer(value.expectedVersion,1,2_147_483_647),key:key(value.key)};}

export function commandStatusInput(command:unknown,keyValue:unknown){if(command!=='CreateAssessmentScale'&&command!=='CreateAssessmentCyclePlan'&&command!=='FreezeAssessmentCohort')throw new AssessmentsError('VALIDATION');return {command,key:key(keyValue)} as const;}
