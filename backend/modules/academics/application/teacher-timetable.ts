import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherTimetableWeek} from '../../../../shared/contracts/timetable';
import {AccessError,uuidPattern} from '../../access/contracts/index';

const date=/^\d{4}-\d{2}-\d{2}$/;
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const monday=(value:unknown)=>{if(typeof value!=='string'||!date.test(value))throw new AccessError('VALIDATION');const parsed=new Date(`${value}T00:00:00.000Z`);if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==value||parsed.getUTCDay()!==1)throw new AccessError('VALIDATION');return value;};

export interface TeacherTimetableRepository{week(actor:Identity,organizationId:string,schoolId:string,weekStart:string):Promise<TeacherTimetableWeek>}

export function createTeacherTimetableUseCases(repository:TeacherTimetableRepository){return {
 teacherTimetableWeek(raw:Identity|null,organizationId:unknown,schoolId:unknown,weekStart:unknown){return repository.week(actor(raw),id(organizationId),id(schoolId),monday(weekStart));}
};}

export type TeacherTimetableFacade=ReturnType<typeof createTeacherTimetableUseCases>;
