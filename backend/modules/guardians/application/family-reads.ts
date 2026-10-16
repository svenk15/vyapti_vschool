import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianAttendancePort} from '../../attendance/contracts/guardian-history';
import type {GuardianTimetablePort} from '../../academics/contracts/guardian-timetable';
import {GuardianError,requiredUuid} from '../domain/policy';
const date=(value:unknown)=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(`${value}T00:00:00.000Z`).toISOString().slice(0,10)!==value)throw new GuardianError('VALIDATION');return value;};
export function createFamilyReadUseCases(attendance:GuardianAttendancePort,timetable:GuardianTimetablePort){return {
 attendance(identity:Identity,studentId:unknown,from:unknown,until:unknown){const start=date(from),end=date(until);if(start>end)throw new GuardianError('VALIDATION');return attendance.history(identity,requiredUuid(studentId),start,end);},
 timetable(identity:Identity,studentId:unknown,weekStart:unknown){return timetable.week(identity,requiredUuid(studentId),date(weekStart));}
};}
