import {describe,expect,it} from 'vitest';
import {calendarExport} from '../../backend/modules/events/domain/calendar-export';
import {agendaQuery,eventFields} from '../../backend/modules/events/domain/events';

describe('Events agenda domain',()=>{
 it('accepts only the approved typed event categories and agenda filters',()=>{
  expect(eventFields({category:'HOLIDAY',title:'School holiday',description:'The branch is closed for the published school holiday.',scheduleKind:'ALL_DAY',startsOn:'2026-10-20',endsOn:'2026-10-20',audienceKind:'BRANCH',sectionId:null})).toMatchObject({category:'HOLIDAY',startsOn:'2026-10-20'});
  expect(()=>eventFields({category:'GENERAL',title:'Legacy',description:'New writes must choose an approved category.',scheduleKind:'ALL_DAY',startsOn:'2026-10-20',endsOn:'2026-10-20',audienceKind:'BRANCH',sectionId:null})).toThrow('VALIDATION');
  expect(agendaQuery({from:'2026-10-16',category:'CLASS_EVENT'})).toEqual({from:'2026-10-16',category:'CLASS_EVENT'});
  expect(agendaQuery({from:'',category:'ALL'})).toEqual({from:null,category:null});
  expect(()=>agendaQuery({from:'16-10-2026',category:'MEETING'})).toThrow('VALIDATION');
 });

 it('exports only minimal escaped event facts with exclusive all-day end',()=>{
  const result=calendarExport([{id:'00000000-0000-4000-8000-000000000001',status:'CANCELED',revision:3,version:2,category:'MEETING',title:'Family, meeting',description:'Review; details',schedule:{kind:'ALL_DAY',startsOn:'2026-10-20',endsOn:'2026-10-20'},audience:{kind:'BRANCH',sectionId:null,label:'Entire branch'},publishedAt:'2026-10-16T10:00:00.000Z',canceledAt:'2026-10-17T10:00:00.000Z',recipientCount:3}],'Example School','2026-10-16');
  expect(result.filename).toBe('school-calendar-2026-10-16.ics');
  expect(result.body).toContain('SUMMARY:Family\\, meeting');
  expect(result.body).toContain('DESCRIPTION:Meeting · Review\\; details');
  expect(result.body).toContain('DTEND;VALUE=DATE:20261021');
  expect(result.body).toContain('STATUS:CANCELLED');
  expect(result.body).not.toContain('recipientCount');
 });
});
