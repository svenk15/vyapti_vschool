import type {Identity} from '../../../../shared/contracts/access';
import type {StudentAttendanceHistoryPort} from '../../attendance/contracts/student-history';
import type {StudentTimetablePort} from '../../academics/contracts/student-timetable';
import {requiredUuid,StudentPortalError} from '../domain/portal-policy';
const date=(value:unknown)=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(`${value}T00:00:00.000Z`).toISOString().slice(0,10)!==value)throw new StudentPortalError('VALIDATION');return value;};
export function createStudentPortalReadUseCases(attendance:StudentAttendanceHistoryPort,timetable:StudentTimetablePort){return {
 attendance(identity:Identity,studentId:unknown,from:unknown,until:unknown){const start=date(from),end=date(until);if(start>end)throw new StudentPortalError('VALIDATION');return attendance.history(identity,requiredUuid(studentId),start,end);},
 timetable(identity:Identity,studentId:unknown,weekStart:unknown){return timetable.week(identity,requiredUuid(studentId),date(weekStart));}
};}
