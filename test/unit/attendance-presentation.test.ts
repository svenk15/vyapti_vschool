import {describe,it,expect} from 'vitest';
import {validDay,shiftDay,registerSummary,registerState,safeAttendanceReturn,schoolTimeInstant} from '../../components/attendance/presentation';
import type {AttendanceSessionRecord} from '../../shared/contracts/attendance';
const session=(status:AttendanceSessionRecord['status'],startsAt:string):AttendanceSessionRecord=>({id:crypto.randomUUID(),version:1,status,schoolDate:'2026-10-24',startsAt,endsAt:'2026-10-24T12:00:00.000Z',offering:{id:'offering',subjectName:'Maths',sectionName:'A'}});
describe('Attendance presentation boundaries',()=>{
 it('converts inclusive periods across leap and month boundaries without local timezone arithmetic',()=>{expect(shiftDay('2024-02-29',1)).toBe('2024-03-01');expect(shiftDay('2026-12-31',1)).toBe('2027-01-01');expect(validDay('2026-02-29')).toBe(false);expect(validDay('2026-13-01')).toBe(false);});
 it('keeps missing registers distinct from absences and excludes future and cancelled sessions',()=>{const now='2026-10-24T10:00:00.000Z',rows=[session('SUBMITTED','2026-10-24T09:00:00.000Z'),session('OPEN','2026-10-24T10:00:00.000Z'),session('SCHEDULED','2026-10-24T09:30:00.000Z'),session('SCHEDULED','2026-10-24T11:00:00.000Z'),session('CANCELLED','2026-10-24T09:00:00.000Z')];expect(registerSummary(rows,now)).toEqual({due:3,submitted:1,missing:2,upcoming:1});expect(registerState(rows[2],now)).toBe('Not started');expect(registerState(rows[3],now)).toBe('Upcoming');});
 it('retains directory queries without accepting an external or unrelated return destination',()=>{expect(safeAttendanceReturn('/admin/reports/attendance?q=A&fromDate=2026-10-24')).toBe('/admin/reports/attendance?q=A&fromDate=2026-10-24');for(const value of ['https://evil.invalid','//evil.invalid','/admin/../../evil','/admin/students'])expect(safeAttendanceReturn(value)).toBe('/admin/attendance/sessions?view=monitor');});
});

describe('School-local scheduling',()=>{
 it('serializes India wall time independently of the browser timezone',()=>{expect(schoolTimeInstant('2026-10-24','09:30','Asia/Kolkata')).toBe('2026-10-24T04:00:00.000Z');});
 it('uses the correct offset on either side of daylight saving',()=>{expect(schoolTimeInstant('2026-01-15','09:00','America/New_York')).toBe('2026-01-15T14:00:00.000Z');expect(schoolTimeInstant('2026-07-15','09:00','America/New_York')).toBe('2026-07-15T13:00:00.000Z');});
 it('rejects nonexistent and ambiguous wall times instead of silently shifting a session',()=>{expect(()=>schoolTimeInstant('2026-03-08','02:30','America/New_York')).toThrow('does not exist');expect(()=>schoolTimeInstant('2026-11-01','01:30','America/New_York')).toThrow('occurs twice');});
 it('rejects impossible dates and times',()=>{expect(()=>schoolTimeInstant('2026-02-29','09:00','Asia/Kolkata')).toThrow();expect(()=>schoolTimeInstant('2026-10-24','24:00','Asia/Kolkata')).toThrow();});
});
