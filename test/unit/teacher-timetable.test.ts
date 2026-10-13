import {describe,expect,it,vi} from 'vitest';
import {randomUUID} from 'node:crypto';
import {createTeacherTimetableUseCases} from '../../backend/modules/academics/application/teacher-timetable';

describe('TT-06 Teacher timetable application boundary',()=>{
 it('validates identity, scope, and a Monday week before calling persistence',async()=>{const repository={week:vi.fn().mockResolvedValue({weekStart:'2026-10-12',weekEndExclusive:'2026-10-19',timezone:'Asia/Kolkata',academicYear:null,publications:[],lessons:[]})},service=createTeacherTimetableUseCases(repository),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID();await expect(service.teacherTimetableWeek(identity,organizationId,schoolId,'2026-10-12')).resolves.toMatchObject({weekStart:'2026-10-12'});expect(repository.week).toHaveBeenCalledWith(identity,organizationId,schoolId,'2026-10-12');expect(()=>service.teacherTimetableWeek(identity,organizationId,schoolId,'2026-10-13')).toThrowError(expect.objectContaining({code:'VALIDATION'}));expect(()=>service.teacherTimetableWeek(null,organizationId,schoolId,'2026-10-12')).toThrowError(expect.objectContaining({code:'UNAUTHENTICATED'}));});
});
