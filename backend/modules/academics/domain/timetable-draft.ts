import {AccessError} from '../../access/contracts/index';
import type {SaveTimetableDraft} from '../../../../shared/contracts/timetable';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,date=/^\d{4}-\d{2}-\d{2}$/;
export function validateTimetableDraft(input:SaveTimetableDraft):SaveTimetableDraft{
 if(!uuid.test(input.academicYearId)||!uuid.test(input.dayPatternId)||!date.test(input.effectiveFrom)||!Number.isSafeInteger(input.expectedVersion)||input.expectedVersion<0||!Array.isArray(input.slots)||input.slots.length>100)throw new AccessError('VALIDATION');
 const cells=new Set<string>(),keys=new Set<string>();
 const slots=input.slots.map((slot,index)=>{if(!uuid.test(slot.slotKey)||!uuid.test(slot.sectionId)||!uuid.test(slot.offeringId)||!uuid.test(slot.teacherAssignmentId)||!uuid.test(slot.periodKey)||!Number.isSafeInteger(slot.dayOfWeek)||slot.dayOfWeek<1||slot.dayOfWeek>7||!Number.isSafeInteger(slot.position)||slot.position!==index+1)throw new AccessError('VALIDATION');const cell=`${slot.sectionId}:${slot.dayOfWeek}:${slot.periodKey}`;if(keys.has(slot.slotKey)||cells.has(cell))throw new AccessError('CONFLICT');keys.add(slot.slotKey);cells.add(cell);return {...slot};});
 const reason=input.reason.normalize('NFC').trim();if(reason.length<5||reason.length>500||/[\u0000-\u001f]/.test(reason))throw new AccessError('VALIDATION');
 return {...input,reason,slots};
}
