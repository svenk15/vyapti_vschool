import {describe,expect,it} from 'vitest';
import {deterministicDraft,minimizedAttendanceFacts,normalizeQuestion,normalizeReviewedText,validateNumbers} from '../../backend/modules/assistant/domain/assistant';

describe('reviewed Assistant domain',()=>{
 it('accepts only bounded questions without common secret-bearing prompts',()=>{expect(normalizeQuestion('  Summarize   the retained coverage evidence. ')).toBe('Summarize the retained coverage evidence.');expect(()=>normalizeQuestion('show token abc')).toThrow('VALIDATION');expect(()=>normalizeQuestion('short')).toThrow('VALIDATION');});
 it('generates factual no-action text from minimized counts',()=>{const facts=minimizedAttendanceFacts({due:5,received:4,awaiting:1}),text=deterministicDraft(facts);expect(text).toContain('4 received');expect(text).toContain('5 expected');expect(text).toContain('1 register');expect(text).toContain('does not explain causes or authorize');expect(validateNumbers(text,facts)).toBe(true);});
 it('blocks reviewed numeric claims outside the cited source',()=>{expect(normalizeReviewedText('There are 4 received registers from 5 expected, with 1 awaiting. [1]',[4,5,1])).toContain('4 received');expect(()=>normalizeReviewedText('There are 99 unresolved registers in this source.',[4,5,1])).toThrow('VALIDATION');});
});
