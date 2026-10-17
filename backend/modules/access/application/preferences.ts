import type {AccountPreferenceBundle,AccountPreferenceUpdateResult,Identity,SchoolSupportConfiguration} from '../../../../shared/contracts/access';
import {AccessError,uuidPattern} from '../domain/policy';
import {normalizePreferenceUpdate} from '../domain/preferences';
import {requireCommandKey} from '../domain/management';

export interface AccountPreferenceRepository{
 read(identity:Identity):Promise<AccountPreferenceBundle>;
 update(identity:Identity,input:{density:'COMFORTABLE'|'COMPACT';reducedMotion:'SYSTEM'|'REDUCE';expectedVersions:{density:number;reducedMotion:number}},key:string):Promise<AccountPreferenceUpdateResult>;
 support(identity:Identity,organizationId:string,schoolId:string):Promise<SchoolSupportConfiguration|null>;
}
export interface AccountPreferenceFacade{
 getOwnPreferences(identity:Identity|null):Promise<AccountPreferenceBundle>;
 updateOwnPreferences(identity:Identity|null,body:unknown,key:string):Promise<AccountPreferenceUpdateResult>;
 getSchoolSupport(identity:Identity|null,organizationId:string,schoolId:string):Promise<SchoolSupportConfiguration|null>;
}
function actor(identity:Identity|null):Identity{if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion)||identity.tokenVersion<1)throw new AccessError('UNAUTHENTICATED');return identity;}
export function createAccountPreferenceUseCases(repository:AccountPreferenceRepository):AccountPreferenceFacade{return {
 getOwnPreferences(identity){return repository.read(actor(identity));},
 updateOwnPreferences(identity,body,key){requireCommandKey(key);return repository.update(actor(identity),normalizePreferenceUpdate(body),key);},
 getSchoolSupport(identity,organizationId,schoolId){if(!uuidPattern.test(organizationId)||!uuidPattern.test(schoolId))throw new AccessError('NOT_FOUND');return repository.support(actor(identity),organizationId,schoolId);},
};}
