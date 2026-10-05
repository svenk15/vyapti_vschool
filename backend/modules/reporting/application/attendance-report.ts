import type {Identity} from '../../../../shared/contracts/access';
import type {AttendanceReport,AttendanceReportInput as PublicAttendanceReportInput} from '../../../../shared/contracts/reporting';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {encodeAttendanceCsv,type AttendanceExportRow} from '../domain/export-csv';
export type AttendanceReportInput=PublicAttendanceReportInput;
export type AttendanceExportFilters=Readonly<{fromDate:string;toDate:string;yearId:string|null;sectionId:string|null;subjectId:string|null}>;
export type AttendanceExportResult=Readonly<{csv:string;filename:string;rowCount:number;contentHash:string;exportRunId:string;generatedAt:string}>;
export interface AttendanceReportRepository {
 overview(actor:Identity,organizationId:string,schoolId:string,input:{fromDate:string;toDate:string;yearId:string|null;sectionId:string|null;subjectId:string|null;cursor:string|null;limit:number}):Promise<AttendanceReport>;
 exportRows(actor:Identity,organizationId:string,schoolId:string,filters:AttendanceExportFilters):Promise<readonly AttendanceExportRow[]>;
 recordExport(actor:Identity,organizationId:string,schoolId:string,input:{filters:AttendanceExportFilters;state:'GENERATED'|'FAILED';rowCount:number;csv?:string}):Promise<{exportRunId:string;contentHash:string|null;generatedAt:string}>;
}
const date=(v:unknown)=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)){throw new AccessError('VALIDATION');}const d=new Date(`${v}T00:00:00.000Z`);if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==v)throw new AccessError('VALIDATION');return v;};
const optionalId=(v:unknown)=>{if(v===undefined||v===null||v==='')return null;if(typeof v!=='string'||!uuidPattern.test(v))throw new AccessError('VALIDATION');return v;};
export function createAttendanceReportUseCases(repository:AttendanceReportRepository){
 const scope=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor||!uuidPattern.test(actor.accountId)||!Number.isSafeInteger(actor.tokenVersion))throw new AccessError('UNAUTHENTICATED');if(typeof organizationId!=='string'||!uuidPattern.test(organizationId)||typeof schoolId!=='string'||!uuidPattern.test(schoolId))throw new AccessError('VALIDATION');return {actor,organizationId,schoolId};};
 const filters=(input:AttendanceReportInput):AttendanceExportFilters=>{const fromDate=date(input.fromDate),toDate=date(input.toDate),span=(Date.parse(`${toDate}T00:00:00Z`)-Date.parse(`${fromDate}T00:00:00Z`))/86400000;if(span<=0||span>31)throw new AccessError('VALIDATION');return {fromDate,toDate,yearId:optionalId(input.yearId),sectionId:optionalId(input.sectionId),subjectId:optionalId(input.subjectId)};};
 return {
  overview(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:AttendanceReportInput){const s=scope(actor,organizationId,schoolId),f=filters(input),cursor=input.cursor===undefined||input.cursor===null||input.cursor===''?null:typeof input.cursor==='string'?input.cursor:(()=>{throw new AccessError('VALIDATION')})(),limit=input.limit===undefined?50:input.limit;if(typeof limit!=='number'||!Number.isInteger(limit)||limit<1||limit>100)throw new AccessError('VALIDATION');return repository.overview(s.actor,s.organizationId,s.schoolId,{...f,cursor,limit});},
  async exportAttendance(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:AttendanceReportInput):Promise<AttendanceExportResult>{const s=scope(actor,organizationId,schoolId),f=filters(input);let rows:readonly AttendanceExportRow[];try{rows=await repository.exportRows(s.actor,s.organizationId,s.schoolId,f);}catch(error){if(!(error instanceof AccessError&&['UNAUTHENTICATED','FORBIDDEN','NOT_FOUND','VALIDATION','MODULE_NOT_LICENSED','MODULE_DISABLED','RELEASE_UNAVAILABLE'].includes(error.code))){try{await repository.recordExport(s.actor,s.organizationId,s.schoolId,{filters:f,state:'FAILED',rowCount:0});}catch{/* Preserve the original failure; an unavailable database cannot persist failure metadata. */}}throw error;}
   if(rows.length>10000)throw new AccessError('VALIDATION');const csv=encodeAttendanceCsv(rows),record=await repository.recordExport(s.actor,s.organizationId,s.schoolId,{filters:f,state:'GENERATED',rowCount:rows.length,csv});return {csv,filename:`attendance-report-${f.fromDate.replaceAll('-','')}-${f.toDate.replaceAll('-','')}.csv`,rowCount:rows.length,contentHash:record.contentHash!,exportRunId:record.exportRunId,generatedAt:record.generatedAt};
  }
 };
}
