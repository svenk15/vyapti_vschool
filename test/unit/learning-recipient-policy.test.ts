import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {recipientPolicyInput} from '../../backend/modules/learning/domain/recipient-policy';

const id=()=>randomUUID();
describe('Learning recipient policy input',()=>{
 it('normalizes an exact confirmed extension command',()=>{const due='2026-11-03T04:30:00.000Z';expect(recipientPolicyInput({recipientId:id(),expectedVersion:2,action:'EXTEND',effectiveDueAt:due,reason:'  Approved   medical extension  ',confirmed:true,key:id()})).toMatchObject({expectedVersion:2,action:'EXTEND',effectiveDueAt:due,reason:'Approved medical extension',confirmed:true});});
 it('rejects unknown fields, missing confirmation and invalid action-specific dates',()=>{const base={recipientId:id(),expectedVersion:0,reason:'Approved exception',confirmed:true,key:id()};expect(()=>recipientPolicyInput({...base,action:'EXCUSE',effectiveDueAt:null,extra:true})).toThrow('VALIDATION');expect(()=>recipientPolicyInput({...base,action:'EXTEND',effectiveDueAt:null})).toThrow('VALIDATION');expect(()=>recipientPolicyInput({...base,action:'EXCUSE',effectiveDueAt:'2026-11-03T04:30:00Z'})).toThrow('VALIDATION');expect(()=>recipientPolicyInput({...base,action:'EXCUSE',effectiveDueAt:null,confirmed:false})).toThrow('VALIDATION');});
});
