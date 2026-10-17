import {describe,expect,it} from 'vitest';
import {createInput as coordinationCreateInput} from '../../backend/modules/coordination/domain/requests';
import {nextFacilitiesState,reportIncidentInput,transitionIncidentInput} from '../../backend/modules/facilities/domain/facilities';

describe('D18 Facilities invariants',()=>{
 it('requires a bounded factual impact and increasing affected interval',()=>{
  const result=reportIncidentInput({facility:'North classroom block',affectedFrom:'2026-10-19T08:00:00.000Z',affectedTo:'2026-10-19T11:00:00.000Z',impact:'The first-floor water supply is unavailable for normal use.',coordinatorAccountId:'00000000-0000-4000-8000-000000000001',key:'facilities-report-key-01'});
  expect(result.facility).toBe('North classroom block');
  expect(()=>reportIncidentInput({...result,affectedFrom:'2026-10-19T12:00:00.000Z',affectedTo:'2026-10-19T11:00:00.000Z',key:'facilities-report-key-02'})).toThrow('VALIDATION');
 });
 it('keeps the lifecycle closed and requires factual restoration evidence',()=>{
  expect(nextFacilitiesState('OPEN','ACKNOWLEDGE')).toBe('INVESTIGATING');
  expect(nextFacilitiesState('INVESTIGATING','PROPOSE_RESTORATION')).toBe('RESTORATION_PROPOSED');
  expect(nextFacilitiesState('RESTORATION_PROPOSED','VERIFY_RESTORATION')).toBe('VERIFIED_RESTORED');
  expect(nextFacilitiesState('VERIFIED_RESTORED','CLOSE')).toBe('CLOSED');
  expect(()=>nextFacilitiesState('OPEN','CLOSE')).toThrow('CONFLICT');
  expect(()=>transitionIncidentInput({action:'PROPOSE_RESTORATION',expectedVersion:2,evidence:'short',key:'facilities-transition-key-01'})).toThrow('VALIDATION');
 });
 it('accepts only the registered Facilities source and follow-up pair',()=>{
  const input={sourceType:'FACILITIES_INCIDENT',sourceId:'00000000-0000-4000-8000-000000000001',kind:'FACILITIES_FOLLOW_UP',concern:'OTHER',note:'Coordinate the factual Facilities impact and restoration.',dueLocal:'2026-10-19T12:00',assigneeAccountId:'00000000-0000-4000-8000-000000000002',assignmentReason:'Exact assigned Facilities coordinator.',key:'facilities-followup-key-01'};
  expect(coordinationCreateInput(input).kind).toBe('FACILITIES_FOLLOW_UP');
  expect(()=>coordinationCreateInput({...input,kind:'MEETING_FOLLOW_UP',key:'facilities-followup-key-02'})).toThrow('VALIDATION');
 });
});
