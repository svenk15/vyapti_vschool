import type {CoordinationVerificationFacade} from '../contracts/leadership-verification';
import type {CoordinationRequest,CoordinationRequestSummary} from '../../../../shared/contracts/coordination';
import type {DecisionDetail,DecisionResult,DecisionSummary} from '../../../../shared/contracts/decisions';
import {AccessError} from '../../access/contracts/index';
import type {DecisionCommand,DecisionOwnerAdapter,ValidDecisionListInput} from '../../leadership/contracts/decisions';

const summary=(request:CoordinationRequestSummary):DecisionSummary=>{
 if(!request.can.verify||request.status!=='AWAITING_VERIFICATION'||!request.resolution)throw new AccessError('NOT_FOUND');
 const learning=request.source.type!=='ATTENDANCE_SESSION';return {owner:'COORDINATION_VERIFICATION',itemId:request.id,version:request.version,reference:`COORD-${request.id.toUpperCase()}`,typeLabel:learning?'Learning follow-up verification':'Attendance follow-up verification',title:`${request.source.sectionName} · ${request.source.subjectName}`,description:`${learning?request.source.title:request.source.schoolDate} · ${request.resolution.kind.replaceAll('_',' ').toLowerCase()}`,state:'READY',submittedAt:request.updatedAt,dueAt:request.dueAt,source:request.source,allowedActions:['VERIFY','RETURN']};
};
const referenceId=(value:string|null)=>{if(!value)return undefined;const match=/^COORD-([0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})$/i.exec(value);return match?.[1].toLowerCase()??'00000000-0000-4000-8000-000000000000';};

export class CoordinationVerificationDecisionAdapter implements DecisionOwnerAdapter {
 readonly owner='COORDINATION_VERIFICATION' as const;
 constructor(private readonly coordination:CoordinationVerificationFacade){}
 async list(actor:Parameters<DecisionOwnerAdapter['list']>[0],organizationId:string,schoolId:string,input:ValidDecisionListInput){const queue=await this.coordination.list(actor,organizationId,schoolId,{status:'AWAITING_VERIFICATION',requestId:referenceId(input.reference),decisionType:input.type,duePeriod:input.due,sort:input.sort,order:input.order,cursor:input.cursor,limit:input.limit}),items:DecisionSummary[]=[];for(const request of queue.items)if(request.can.verify&&request.resolution)items.push(summary(request));return {items,nextCursor:queue.nextCursor,timezone:queue.timezone};}
 async get(actor:Parameters<DecisionOwnerAdapter['get']>[0],organizationId:string,schoolId:string,itemId:string):Promise<DecisionDetail>{const request:CoordinationRequest=await this.coordination.get(actor,organizationId,schoolId,itemId),base=summary(request);return {...base,proposer:request.resolution!.proposer,resolution:{kind:request.resolution!.kind,revision:request.resolution!.revision,reason:request.resolution!.reason},returnHref:`/leadership/coordination/${request.id}`};}
 async decide(actor:Parameters<DecisionOwnerAdapter['decide']>[0],organizationId:string,schoolId:string,itemId:string,input:DecisionCommand):Promise<DecisionResult>{const payload={requestId:itemId,expectedVersion:input.expectedVersion,reason:input.reason,key:input.key},result=input.action==='VERIFY'?await this.coordination.verify(actor,organizationId,schoolId,payload):await this.coordination.returnResolution(actor,organizationId,schoolId,payload);return {owner:this.owner,itemId:result.requestId,version:result.version,state:result.status==='RESOLVED'?'RESOLVED':'RETURNED',replayed:result.replayed};}
}
