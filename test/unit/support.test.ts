import {describe,expect,it} from 'vitest';
import {handoffInput,nextReferralState,procedureInput,referralCreateInput} from '../../backend/modules/support/domain/support';

describe('D16 restricted support invariants',()=>{
 it('accepts a bounded factual referral and stable key',()=>{expect(referralCreateInput({studentId:'00000000-0000-4000-8000-000000000001',specialistAccountId:'00000000-0000-4000-8000-000000000002',factualConcern:'The pupil left the lesson twice after visible distress.',key:'support-referral-key-0001'}).factualConcern).toContain('visible distress');});
 it('keeps the referral lifecycle closed',()=>{expect(nextReferralState('SENT','ACKNOWLEDGE')).toBe('ACKNOWLEDGED');expect(nextReferralState('RETURNED','CLOSE')).toBe('CLOSED');expect(()=>nextReferralState('SENT','CLOSE')).toThrow('CONFLICT');});
 it('validates school-authored procedures and minimum handoff references',()=>{expect(procedureInput({title:'Urgent school contact',instruction:'Contact the designated school lead using the approved staff channel.',contactLabel:'Designated school lead',responsibleAccountId:'00000000-0000-4000-8000-000000000001',key:'support-procedure-key-01'}).title).toBe('Urgent school contact');expect(handoffInput({procedureId:'00000000-0000-4000-8000-000000000001',procedureVersion:1,safeReference:'Offline contact completed at 10:30.',key:'support-handoff-key-0001'}).procedureVersion).toBe(1);});
});
