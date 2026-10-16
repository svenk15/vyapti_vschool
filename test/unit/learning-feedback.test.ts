import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {feedbackText,publishFeedbackInput,saveFeedbackInput} from '../../backend/modules/learning/domain/feedback';

describe('Learning feedback commands',()=>{
 it('normalizes both bounded Student-facing fields',()=>{
  expect(feedbackText('  Clear evidence\r\nWell explained  ')).toBe('Clear evidence\nWell explained');
  const key=randomUUID();
  expect(saveFeedbackInput({expectedRevision:0,strength:' Clear example ',nextStep:' Add a labelled diagram ',key})).toEqual({expectedRevision:0,strength:'Clear example',nextStep:'Add a labelled diagram',key});
 });
 it('rejects missing, oversized, control-character and additional fields',()=>{
  const key=randomUUID();
  for(const text of ['', '   ',`unsafe\u0000text`,'x'.repeat(4001)])expect(()=>feedbackText(text)).toThrow('VALIDATION');
  expect(()=>saveFeedbackInput({expectedRevision:0,strength:'Clear',nextStep:'Specific',key,score:10})).toThrow('VALIDATION');
 });
 it('pins publication to an exact accepted submission and revision',()=>{
  const key=randomUUID(),reviewedSubmissionId=randomUUID();
  expect(publishFeedbackInput({expectedRevision:2,reviewedSubmissionId,key})).toEqual({expectedRevision:2,reviewedSubmissionId,key});
  expect(()=>publishFeedbackInput({expectedRevision:0,reviewedSubmissionId,key})).toThrow('VALIDATION');
 });
});
