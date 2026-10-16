import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {LeadershipRegisterCoverage} from '../../../../shared/contracts/attendance';
import type {LeadershipAttendanceExportInput,LeadershipReportSnapshot,LeadershipReportSnapshotSummary,LeadershipSnapshotAvailability} from '../../../../shared/contracts/reporting';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export interface LeadershipSnapshotSourcePort {
 attendanceCoverage(actor:Identity,organizationId:string,schoolId:string,input:LeadershipAttendanceExportInput&Readonly<{limit:50}>):Promise<LeadershipRegisterCoverage>;
}
export interface LeadershipSnapshotRepository {
 availability(actor:Identity,organizationId:string,schoolId:string):Promise<LeadershipSnapshotAvailability>;
 list(actor:Identity,organizationId:string,schoolId:string):Promise<readonly LeadershipReportSnapshotSummary[]>;
 get(actor:Identity,organizationId:string,schoolId:string,id:string):Promise<LeadershipReportSnapshot>;
 capture(actor:Identity,organizationId:string,schoolId:string,input:Readonly<{query:LeadershipAttendanceExportInput;key:string;payload:LeadershipRegisterCoverage}>):Promise<LeadershipReportSnapshot>;
 remove(actor:Identity,organizationId:string,schoolId:string,input:Readonly<{id:string;expectedVersion:number;key:string;confirmed:true}>):Promise<Readonly<{id:string;version:number;removedAt:string;replayed:boolean}>>;
 grant(operator:OperatorPrincipal,input:Readonly<{organizationId:string;schoolId:string;accountId:string}>):Promise<Readonly<{grantId:string;version:number}>>;
 revoke(operator:OperatorPrincipal,input:Readonly<{organizationId:string;schoolId:string;accountId:string}>):Promise<Readonly<{grantId:string;version:number}>>;
}

const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const key=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};

export function createLeadershipSnapshotUseCases(source:LeadershipSnapshotSourcePort,repository:LeadershipSnapshotRepository){return {
 snapshotAvailability(actorValue:Identity|null,organizationId:unknown,schoolId:unknown){return repository.availability(actor(actorValue),id(organizationId),id(schoolId));},
 listSnapshots(actorValue:Identity|null,organizationId:unknown,schoolId:unknown){return repository.list(actor(actorValue),id(organizationId),id(schoolId));},
 getSnapshot(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,snapshotId:unknown){return repository.get(actor(actorValue),id(organizationId),id(schoolId),id(snapshotId));},
 async captureAttendanceSnapshot(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:Readonly<{query:LeadershipAttendanceExportInput;key:unknown}>){const current=actor(actorValue),organization=id(organizationId),school=id(schoolId),intent=key(input.key),report=await source.attendanceCoverage(current,organization,school,{...input.query,limit:50});if(report.awaiting.total>report.awaiting.items.length)throw new AccessError('VALIDATION');return repository.capture(current,organization,school,{query:input.query,key:intent,payload:report});},
 removeSnapshot(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:Readonly<{id:unknown;expectedVersion:unknown;key:unknown;confirmed:unknown}>){if(!Number.isSafeInteger(input.expectedVersion)||Number(input.expectedVersion)<1||input.confirmed!==true)throw new AccessError('VALIDATION');return repository.remove(actor(actorValue),id(organizationId),id(schoolId),{id:id(input.id),expectedVersion:Number(input.expectedVersion),key:key(input.key),confirmed:true});},
 grantSnapshotManager(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown}){return repository.grant(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId)});},
 revokeSnapshotManager(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown}){return repository.revoke(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId)});}
};}
export type LeadershipSnapshotFacade=ReturnType<typeof createLeadershipSnapshotUseCases>;
