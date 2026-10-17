import type {CoordinationRequestKind,CoordinationSourceSummary} from '../../../../shared/contracts/coordination';
import {AccessError} from '../../access/contracts/index';
import type {CoordinationSourceAdapter} from '../contracts/source-adapter';

export class CoordinationSourceRegistry {
 private readonly adapters:Map<CoordinationSourceSummary['type'],CoordinationSourceAdapter>;
 constructor(adapters:readonly CoordinationSourceAdapter[]){
  this.adapters=new Map();
  for(const adapter of adapters){if(this.adapters.has(adapter.sourceType))throw new Error(`Duplicate Coordination source adapter: ${adapter.sourceType}`);this.adapters.set(adapter.sourceType,adapter);}
 }
 resolve(sourceType:unknown,requestKind:unknown):CoordinationSourceAdapter{
  if(typeof sourceType!=='string'||typeof requestKind!=='string')throw new AccessError('VALIDATION');
  const adapter=this.adapters.get(sourceType as CoordinationSourceSummary['type']);
  if(!adapter||!adapter.requestKinds.includes(requestKind as CoordinationRequestKind))throw new AccessError('NOT_FOUND');
  return adapter;
 }
}
