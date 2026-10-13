import {describe,expect,it,vi} from 'vitest';
import {randomUUID} from 'node:crypto';
import {createTeacherTimetableUseCases} from '../../backend/modules/academics/application/teacher-timetable';
import {createTeacherClassesUseCases} from '../../backend/modules/academics/application/teacher-classes';

describe('TT-06 Teacher timetable application boundary',()=>{
 it('validates identity, scope, and a Monday week before calling persistence',async()=>{const repository={week:vi.fn().mockResolvedValue({weekStart:'2026-10-12',weekEndExclusive:'2026-10-19',timezone:'Asia/Kolkata',academicYear:null,publications:[],periods:[],lessons:[]})},service=createTeacherTimetableUseCases(repository),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID();await expect(service.teacherTimetableWeek(identity,organizationId,schoolId,'2026-10-12')).resolves.toMatchObject({weekStart:'2026-10-12'});expect(repository.week).toHaveBeenCalledWith(identity,organizationId,schoolId,'2026-10-12');expect(()=>service.teacherTimetableWeek(identity,organizationId,schoolId,'2026-10-13')).toThrowError(expect.objectContaining({code:'VALIDATION'}));expect(()=>service.teacherTimetableWeek(null,organizationId,schoolId,'2026-10-12')).toThrowError(expect.objectContaining({code:'UNAUTHENTICATED'}));});
});

describe('TEA-07/08 Teacher classes application boundary',()=>{
 it('validates identity, scope, date and optional offering before persistence',async()=>{const repository={workspace:vi.fn().mockResolvedValue({date:'2026-10-13',timezone:'Asia/Kolkata',classes:[],selected:null})},service=createTeacherClassesUseCases(repository),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID(),offeringId=randomUUID();await expect(service.teacherClasses(identity,organizationId,schoolId,'2026-10-13',offeringId)).resolves.toMatchObject({date:'2026-10-13'});expect(repository.workspace).toHaveBeenCalledWith(identity,organizationId,schoolId,'2026-10-13',offeringId);expect(()=>service.teacherClasses(identity,organizationId,schoolId,'13-10-2026')).toThrowError(expect.objectContaining({code:'VALIDATION'}));expect(()=>service.teacherClasses(null,organizationId,schoolId,'2026-10-13')).toThrowError(expect.objectContaining({code:'UNAUTHENTICATED'}));});
});
