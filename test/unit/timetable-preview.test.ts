import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {previewTimetable,type PreviewInput,type PreviewSlot} from '../../backend/modules/academics/domain/timetable-preview';

const person=randomUUID(),sectionA=randomUUID(),sectionB=randomUUID();
const slot=(overrides:Partial<PreviewSlot>={}):PreviewSlot=>({slotKey:randomUUID(),sectionId:sectionA,sectionLabel:'Grade 6 · A',campusId:null,teacherPersonId:person,teacherName:'Rohan Das',dayOfWeek:1,periodKey:randomUUID(),periodLabel:'Lesson 1',startLocal:'09:00',endLocal:'09:40',assignmentValidFrom:'2026-04-01',assignmentValidTo:'2027-04-01',...overrides});
const input=(slots:PreviewSlot[]):PreviewInput=>({draftId:randomUUID(),draftVersion:2,effectiveFrom:'2026-10-12',yearEndsOn:'2027-04-01',slots,calendar:{revisionId:randomUUID(),revisionNumber:1,teachingWeekdays:[1,2,3,4,5],exceptions:[]},protectedAttendanceSessions:1});

describe('TT-03 timetable preview',()=>{
 it('finds the same Teacher Person collision across assignments and keeps adjacent periods valid',()=>{const conflict=previewTimetable(input([slot(),slot({sectionId:sectionB,sectionLabel:'Grade 6 · B',periodLabel:'Lesson 1B'})]));expect(conflict.ready).toBe(false);expect(conflict.issues.map(issue=>issue.code)).toContain('TEACHER_CONFLICT');const adjacent=previewTimetable(input([slot(),slot({sectionId:sectionB,sectionLabel:'Grade 6 · B',startLocal:'09:40',endLocal:'10:20',periodLabel:'Lesson 2'})]));expect(adjacent.ready).toBe(true);expect(adjacent.counts).toMatchObject({draftSlots:2,candidateOccurrences:12,addedSlots:2,protectedAttendanceSessions:1});});
 it('excludes a nonteaching exception and reports assignment expiry inside the horizon',()=>{const value=input([slot({assignmentValidTo:'2026-10-20'})]),calendar=value.calendar!;const result=previewTimetable({...value,calendar:{...calendar,exceptions:[{date:'2026-10-12',campusId:null,isTeachingDay:false,label:'Holiday'}]}});expect(result.counts.candidateOccurrences).toBe(5);expect(result.issues).toEqual(expect.arrayContaining([expect.objectContaining({code:'ASSIGNMENT_INELIGIBLE'})]));});
 it('blocks readiness when no published calendar exists',()=>{const result=previewTimetable({...input([slot()]),calendar:null});expect(result).toMatchObject({ready:false,counts:{candidateOccurrences:0},roomValidation:'NOT_APPLICABLE'});expect(result.issues[0]?.code).toBe('CALENDAR_UNAVAILABLE');});
});
