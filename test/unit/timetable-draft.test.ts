import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {createTimetableDraftUseCases,type TimetableDraftRepository} from '../../backend/modules/academics/application/timetable-draft';
const identity={accountId:randomUUID(),tokenVersion:1},org=randomUUID(),school=randomUUID();
const slot=()=>({slotKey:randomUUID(),sectionId:randomUUID(),offeringId:randomUUID(),teacherAssignmentId:randomUUID(),dayOfWeek:1,periodKey:randomUUID(),position:1});
const input=()=>({academicYearId:randomUUID(),dayPatternId:randomUUID(),effectiveFrom:'2026-04-01',expectedVersion:0,slots:[slot()],key:randomUUID(),reason:'Save weekly draft'});
describe('TT-02 timetable draft use cases',()=>{
 it('passes a valid bounded weekly draft to the owner port',async()=>{let received:unknown;const repo={save:async(...args:unknown[])=>{received=args;return {id:randomUUID(),academicYearId:'',dayPatternId:'',effectiveFrom:'2026-04-01',state:'DRAFT' as const,version:1,slots:[],replayed:false};}} as unknown as TimetableDraftRepository;const command=input();await createTimetableDraftUseCases(repo).saveDraft(identity,org,school,command);expect(received).toEqual([identity,org,school,command]);});
 it('rejects duplicate cells, invalid positions, unsupported days and oversized drafts',()=>{const use=createTimetableDraftUseCases({} as TimetableDraftRepository),base=input(),first=base.slots[0]!;expect(()=>use.saveDraft(identity,org,school,{...base,slots:[first,{...first,slotKey:randomUUID(),position:2}]})).toThrow('CONFLICT');expect(()=>use.saveDraft(identity,org,school,{...base,slots:[{...first,position:2}]})).toThrow('VALIDATION');expect(()=>use.saveDraft(identity,org,school,{...base,slots:[{...first,dayOfWeek:8}]})).toThrow('VALIDATION');expect(()=>use.saveDraft(identity,org,school,{...base,slots:Array.from({length:101},(_,i)=>({...slot(),position:i+1}))})).toThrow('VALIDATION');});
});
