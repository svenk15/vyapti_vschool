import {describe,expect,it} from 'vitest';
import {calendarEntryRange,calendarWeek,civilDateInTimezone,isCalendarDateComplete} from '../../components/landing-calendar-model';

describe('landing calendar presentation model',()=>{
 it('derives timed event days in the branch timezone',()=>{
  expect(civilDateInTimezone('2026-10-18T20:00:00.000Z','Asia/Kolkata')).toBe('2026-10-19');
  expect(calendarEntryRange({kind:'TIMED',startsAt:'2026-10-18T20:00:00.000Z',endsAt:'2026-10-19T20:00:00.000Z'},'Asia/Kolkata')).toEqual({startsOn:'2026-10-19',endsOn:'2026-10-20'});
 });
 it('preserves inclusive date-only all-day ranges',()=>{
  expect(calendarEntryRange({kind:'ALL_DAY',startsOn:'2026-10-19',endsOn:'2026-10-21'},'Pacific/Kiritimati')).toEqual({startsOn:'2026-10-19',endsOn:'2026-10-21'});
 });
 it('bounds successful-empty copy to a complete loaded range',()=>{
  expect(calendarWeek('2026-10-21')).toEqual({from:'2026-10-19',to:'2026-10-25'});
  expect(isCalendarDateComplete('2026-10-21',{from:'2026-10-19',to:'2026-10-25',complete:true})).toBe(true);
  expect(isCalendarDateComplete('2026-10-26',{from:'2026-10-19',to:'2026-10-25',complete:true})).toBe(false);
  expect(isCalendarDateComplete('2026-10-21',{from:'2026-10-19',to:'2026-10-25',complete:false})).toBe(false);
 });
});
