import {describe,expect,it} from 'vitest';
import {decideExceptionInput,financeCurrency,financeMinor,nextFinanceExceptionState,requestExceptionInput} from '../../backend/modules/finance/domain/finance';
const id='11111111-1111-4111-8111-111111111111',reviewer='22222222-2222-4222-8222-222222222222',key='finance-test-key-0001';
describe('Finance domain',()=>{
 it('parses exact integer minor units and rejects invalid currency',()=>{expect(financeMinor('12500')).toBe(BigInt(12500));expect(financeCurrency('INR')).toBe('INR');expect(()=>financeMinor('12.50')).toThrow('VALIDATION');expect(()=>financeCurrency('inr')).toThrow('VALIDATION');});
 it('validates minimized exception requests and strict properties',()=>{expect(requestExceptionInput({reconciliationId:id,kind:'CONCESSION',amountMinor:'5000',reviewerAccountId:reviewer,reason:'Approved fictional staff concession request.',key})).toMatchObject({kind:'CONCESSION',amountMinor:BigInt(5000)});expect(()=>requestExceptionInput({reconciliationId:id,kind:'CONCESSION',amountMinor:'5000',reviewerAccountId:reviewer,reason:'Reason',key,studentId:id})).toThrow('VALIDATION');});
 it('requires a rejection reason and permits one transition from pending',()=>{expect(decideExceptionInput({action:'APPROVE',expectedVersion:1,reason:null,key})).toMatchObject({action:'APPROVE'});expect(()=>decideExceptionInput({action:'REJECT',expectedVersion:1,reason:null,key})).toThrow('VALIDATION');expect(nextFinanceExceptionState('PENDING','REJECT')).toBe('REJECTED');expect(()=>nextFinanceExceptionState('APPROVED','APPROVE')).toThrow('CONFLICT');});
});
