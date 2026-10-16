import type {Identity} from '../../../../shared/contracts/access';
import type {SaveTimetablePattern,TimetablePatternContext,TimetablePatternResult} from '../../../../shared/contracts/timetable';
import {AccessError} from '../../access/contracts/index';
import {validateTimetablePattern} from '../domain/timetable';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,key=/^[\x21-\x7e]{16,100}$/;
export interface TimetablePatternRepository{context(actor:Identity,organizationId:string,schoolId:string,academicYearId:string):Promise<TimetablePatternContext>;save(actor:Identity,organizationId:string,schoolId:string,input:SaveTimetablePattern):Promise<TimetablePatternResult>}
function actor(value:Identity|null){if(!value||!uuid.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function id(value:unknown){if(typeof value!=='string'||!uuid.test(value))throw new AccessError('VALIDATION');return value;}
export function createTimetablePatternUseCases(repo:TimetablePatternRepository){return {
 context(raw:Identity|null,organization:unknown,school:unknown,year:unknown){return repo.context(actor(raw),id(organization),id(school),id(year));},
 save(raw:Identity|null,organization:unknown,school:unknown,input:SaveTimetablePattern){if(!key.test(input.key))throw new AccessError('VALIDATION');return repo.save(actor(raw),id(organization),id(school),validateTimetablePattern(input));}
};}
export type TimetablePatternFacade=ReturnType<typeof createTimetablePatternUseCases>;
