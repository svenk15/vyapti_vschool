import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AttendancePupilReviewSnapshotResult,LeadershipPupilPatternReview} from '../../../../shared/contracts/attendance';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export type PupilReviewQuery=Readonly<{fromDate:string;toDate:string;threshold:number}>;
export type PupilReviewSnapshotInput=PupilReviewQuery&Readonly<{studentId:string;key:string;requestId:string}>;
export interface AttendancePupilReviewRepository {
 review(actor:Identity,organizationId:string,schoolId:string,input:PupilReviewQuery):Promise<LeadershipPupilPatternReview>;
 snapshot(actor:Identity,organizationId:string,schoolId:string,input:PupilReviewSnapshotInput):Promise<AttendancePupilReviewSnapshotResult>;
 grant(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;studentId:string}):Promise<{grantId:string;version:number}>;
 revoke(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;studentId:string}):Promise<{grantId:string;version:number}>;
}
const identity=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const date=(value:unknown)=>{if(typeof value!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)||new Date(`${value}T00:00:00.000Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;};
const key=(value:unknown)=>{if(typeof value!=='string'||value.length<16||value.length>120||!/^[A-Za-z0-9_-]+$/.test(value))throw new AccessError('VALIDATION');return value;};
const query=(input:Record<string,unknown>):PupilReviewQuery=>{const fromDate=date(input.fromDate),toDate=date(input.toDate),threshold=input.threshold;if(typeof threshold!=='number'||!Number.isInteger(threshold)||threshold<1||threshold>90)throw new AccessError('VALIDATION');const days=Math.floor((new Date(`${toDate}T00:00:00Z`).getTime()-new Date(`${fromDate}T00:00:00Z`).getTime())/86400000)+1;if(days<1||days>90)throw new AccessError('VALIDATION');return {fromDate,toDate,threshold};};

export function createAttendancePupilReviewUseCases(repository:AttendancePupilReviewRepository){return {
 review(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){return repository.review(identity(actorValue),id(organizationId),id(schoolId),query(input));},
 snapshot(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){const q=query(input);return repository.snapshot(identity(actorValue),id(organizationId),id(schoolId),{...q,studentId:id(input.studentId),key:key(input.key),requestId:id(input.requestId)});},
 grant(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown;studentId:unknown}){return repository.grant(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId),studentId:id(input.studentId)});},
 revoke(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown;studentId:unknown}){return repository.revoke(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId),studentId:id(input.studentId)});},
};}
export type AttendancePupilReviewFacade=ReturnType<typeof createAttendancePupilReviewUseCases>;
