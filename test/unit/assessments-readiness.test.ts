import {describe,expect,it} from 'vitest';
import {AssessmentsError,reconcile} from '../../backend/modules/assessments/domain/readiness';
describe('assessment readiness reconciliation',()=>{it('keeps numeric zero represented as numeric and missing separate',()=>{expect(reconcile(5,['NUMERIC','NUMERIC','ABSENT','EXCUSED'])).toEqual({numeric:2,notAssessed:0,absent:1,excused:1,missing:1});});it('rejects more outcomes than frozen slots',()=>{expect(()=>reconcile(1,['NUMERIC','ABSENT'])).toThrow(AssessmentsError);});});
