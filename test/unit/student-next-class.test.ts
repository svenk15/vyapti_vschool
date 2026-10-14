import {describe,expect,it} from 'vitest';
import {nextStudentClass} from '../../backend/modules/academics/application/student-next-class';
import type {StudentSelfTimetableWeek} from '../../shared/contracts/student-portal';

const week:StudentSelfTimetableWeek={studentId:'student',timezone:'Asia/Kolkata',weekStart:'2026-10-12',weekEndExclusive:'2026-10-19',days:[],lessons:[
 {occurrenceId:'later',date:'2026-10-14',periodKey:'p2',startsAt:'2026-10-14T06:30:00.000Z',endsAt:'2026-10-14T07:10:00.000Z',subjectName:'Science',sectionName:'Grade 8 · Section A',teacherName:'Mira Sen'},
 {occurrenceId:'past',date:'2026-10-14',periodKey:'p0',startsAt:'2026-10-14T03:30:00.000Z',endsAt:'2026-10-14T04:10:00.000Z',subjectName:'English',sectionName:'Grade 8 · Section A',teacherName:'Mira Sen'},
 {occurrenceId:'next',date:'2026-10-14',periodKey:'p1',startsAt:'2026-10-14T05:30:00.000Z',endsAt:'2026-10-14T06:10:00.000Z',subjectName:'Mathematics',sectionName:'Grade 8 · Section A',teacherName:'Mira Sen'},
 {occurrenceId:'tomorrow',date:'2026-10-15',periodKey:'p3',startsAt:'2026-10-15T03:30:00.000Z',endsAt:'2026-10-15T04:10:00.000Z',subjectName:'History',sectionName:'Grade 8 · Section A',teacherName:'Mira Sen'},
]};

describe('Student next class projection',()=>{
 it('selects the earliest remaining class on the exact school-local date without mutating the week',()=>{const lessons=[...week.lessons];expect(nextStudentClass(week,'2026-10-14',new Date('2026-10-14T05:00:00.000Z'))).toMatchObject({occurrenceId:'next',subjectName:'Mathematics'});expect(week.lessons).toEqual(lessons);});
 it('returns no class once the final class has started or on another date',()=>{expect(nextStudentClass(week,'2026-10-14',new Date('2026-10-14T06:31:00.000Z'))).toBeNull();expect(nextStudentClass(week,'2026-10-13',new Date('2026-10-13T00:00:00.000Z'))).toBeNull();});
});
