import type {Identity} from '../../../../shared/contracts/access';
import type {DiscardTimetableDraft,SaveTimetableDraft,TimetableDraftContext,TimetableDraftResult} from '../../../../shared/contracts/timetable';
import {AccessError} from '../../access/contracts/index';
import {validateTimetableDraft} from '../domain/timetable-draft';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,key=/^[\x21-\x7e]{16,100}$/,date=/^\d{4}-\d{2}-\d{2}$/;
export interface TimetableDraftRepository{context(actor:Identity,organizationId:string,schoolId:string,yearId:string,effectiveFrom:string):Promise<TimetableDraftContext>;save(actor:Identity,organizationId:string,schoolId:string,input:SaveTimetableDraft):Promise<TimetableDraftResult>;discard(actor:Identity,organizationId:string,schoolId:string,input:DiscardTimetableDraft):Promise<TimetableDraftResult>}
const id=(v:unknown)=>{if(typeof v!=='string'||!uuid.test(v))throw new AccessError('VALIDATION');return v;};
const actor=(v:Identity|null)=>{if(!v||!uuid.test(v.accountId)||!Number.isSafeInteger(v.tokenVersion))throw new AccessError('UNAUTHENTICATED');return v;};
export function createTimetableDraftUseCases(repo:TimetableDraftRepository){return {
 draftContext(raw:Identity|null,org:unknown,school:unknown,year:unknown,effective:unknown){if(typeof effective!=='string'||!date.test(effective))throw new AccessError('VALIDATION');return repo.context(actor(raw),id(org),id(school),id(year),effective);},
 saveDraft(raw:Identity|null,org:unknown,school:unknown,input:SaveTimetableDraft){if(!key.test(input.key))throw new AccessError('VALIDATION');return repo.save(actor(raw),id(org),id(school),validateTimetableDraft(input));},
 discardDraft(raw:Identity|null,org:unknown,school:unknown,input:DiscardTimetableDraft){if(!uuid.test(input.draftId)||!Number.isSafeInteger(input.expectedVersion)||input.expectedVersion<1||!key.test(input.key)||typeof input.reason!=='string'||input.reason.trim().length<5||input.reason.trim().length>500)throw new AccessError('VALIDATION');return repo.discard(actor(raw),id(org),id(school),{...input,reason:input.reason.normalize('NFC').trim()});}
};}
export type TimetableDraftFacade=ReturnType<typeof createTimetableDraftUseCases>;
