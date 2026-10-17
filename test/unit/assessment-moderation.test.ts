import {describe,expect,it} from 'vitest';
import {moderationDigest,respondModerationInput,submitModerationInput} from '../../backend/modules/assessments/domain/moderation';

const id=(value:number)=>`00000000-0000-4000-8000-${String(value).padStart(12,'0')}`;
describe('assessment moderation contract',()=>{
 it('validates exact submission and bounded response versions',()=>{expect(submitModerationInput({cycleId:id(1),planItemId:id(2),expectedModerationVersion:0,key:id(3)})).toMatchObject({expectedModerationVersion:0});expect(respondModerationInput({moderationId:id(1),informationRequestId:id(2),expectedModerationVersion:2,expectedInformationVersion:1,responseText:'  Evidence checked.  ',key:id(3)}).responseText).toBe('Evidence checked.');expect(()=>respondModerationInput({moderationId:id(1),informationRequestId:id(2),expectedModerationVersion:2,expectedInformationVersion:1,responseText:'',key:id(3)})).toThrow('VALIDATION');});
 it('orders the complete evidence tuple by frozen cohort identity',()=>{const rows=[2,1].map(n=>({cycleId:id(1),planItemId:id(2),scaleId:id(3),cohortMemberId:id(n+10),outcomeId:id(n+20),revision:n,state:n===1?'NUMERIC':'ABSENT',scoreScaled:n===1?0:null})),tuple=moderationDigest(rows);expect(tuple[0]?.[3]).toBe(id(11));expect(tuple[0]?.at(-1)).toBe(0);expect(tuple[1]?.at(-1)).toBeNull();});
});
