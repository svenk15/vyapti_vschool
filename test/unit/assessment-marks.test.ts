import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {markInput} from '../../backend/modules/assessments/domain/marks';

const id=()=>randomUUID();
const base=()=>({cycleId:id(),planItemId:id(),cohortMemberId:id(),state:'NUMERIC',scoreScaled:0,expectedOutcomeVersion:0,reviewed:true,key:id()});

describe('assessment mark revision input',()=>{
 it('preserves a numeric zero and the explicit reviewed acknowledgement',()=>{expect(markInput(base())).toMatchObject({state:'NUMERIC',scoreScaled:0,expectedOutcomeVersion:0,reviewed:true});});
 it('requires an integer numeric score',()=>{expect(()=>markInput({...base(),scoreScaled:1.5})).toThrow();expect(()=>markInput({...base(),scoreScaled:null})).toThrow();});
 it('keeps non-score outcomes distinct and requires a null score',()=>{for(const state of ['ABSENT','EXCUSED','NOT_ASSESSED'] as const)expect(markInput({...base(),state,scoreScaled:null})).toMatchObject({state,scoreScaled:null});expect(()=>markInput({...base(),state:'ABSENT',scoreScaled:0})).toThrow();});
 it('rejects unreviewed and invalid expected versions',()=>{expect(()=>markInput({...base(),reviewed:false})).toThrow();expect(()=>markInput({...base(),expectedOutcomeVersion:-1})).toThrow();});
});
