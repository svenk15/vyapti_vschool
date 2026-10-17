import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {FacilitiesCandidate,FacilitiesCapability,FacilitiesCommandResult,FacilitiesCommandStatus,FacilitiesIncidentDetail,FacilitiesIncidentSummary} from '../../../../shared/contracts/facilities';
import {facilityCapability,facilityId,facilityKey,reportIncidentInput,transitionIncidentInput} from '../domain/facilities';
import {AccessError} from '../../access/contracts/index';
type Scope={organizationId:string;schoolId:string};
export interface FacilitiesRepository{
 grant(operator:OperatorPrincipal,input:Scope&{accountId:string;capability:FacilitiesCapability}):Promise<{grantId:string;version:number}>;
 candidates(actor:Identity,scope:Scope):Promise<readonly FacilitiesCandidate[]>;
 report(actor:Identity,input:Scope&ReturnType<typeof reportIncidentInput>&{requestId:string}):Promise<FacilitiesCommandResult>;
 list(actor:Identity,scope:Scope):Promise<readonly FacilitiesIncidentSummary[]>;
 get(actor:Identity,scope:Scope,id:string):Promise<FacilitiesIncidentDetail>;
 transition(actor:Identity,input:Scope&ReturnType<typeof transitionIncidentInput>&{id:string;requestId:string}):Promise<FacilitiesCommandResult>;
 status(actor:Identity,scope:Scope,key:string):Promise<FacilitiesCommandStatus>;
}
const scoped=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:facilityId(organizationId),schoolId:facilityId(schoolId)};};
export function createFacilitiesUseCases(repository:FacilitiesRepository){return {
 grant:(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown;capability:unknown})=>repository.grant(operator,{organizationId:facilityId(input.organizationId),schoolId:facilityId(input.schoolId),accountId:facilityId(input.accountId),capability:facilityCapability(input.capability)}),
 candidates(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.candidates(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 report(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.report(s.actor,{...s,...reportIncidentInput(input),requestId});},
 list(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.list(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 get(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown){const s=scoped(actor,organizationId,schoolId);return repository.get(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId},facilityId(id));},
 transition(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.transition(s.actor,{...s,id:facilityId(id),...transitionIncidentInput(input),requestId});},
 status(actor:Identity|null,organizationId:unknown,schoolId:unknown,key:unknown){const s=scoped(actor,organizationId,schoolId);return repository.status(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId},facilityKey(key));},
};}
