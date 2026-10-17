import type {AssessmentOutcomeState} from '../../../../shared/contracts/assessments';
export class AssessmentsError extends Error{constructor(public readonly code:'UNAUTHENTICATED'|'FORBIDDEN'|'NOT_FOUND'|'UNAVAILABLE'|'VALIDATION'|'CONFLICT'|'STALE_VERSION'|'IDEMPOTENCY_CONFLICT'){super(code);}}
export function reconcile(requiredSlots:number,outcomes:readonly AssessmentOutcomeState[]){
 if(!Number.isSafeInteger(requiredSlots)||requiredSlots<0||outcomes.length>requiredSlots)throw new AssessmentsError('VALIDATION');
 const counts={numeric:0,notAssessed:0,absent:0,excused:0};for(const state of outcomes){if(state==='NUMERIC')counts.numeric++;else if(state==='NOT_ASSESSED')counts.notAssessed++;else if(state==='ABSENT')counts.absent++;else counts.excused++;}
 return {...counts,missing:requiredSlots-outcomes.length};
}
export function uuid(value:unknown){if(typeof value!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new AssessmentsError('VALIDATION');return value;}
