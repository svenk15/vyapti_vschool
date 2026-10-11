import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {startApplicationInput} from '../../backend/modules/admissions/domain/application';

describe('SA-38 admission application input',()=>{
  const valid=()=>({applicantName:'  Nila   Example  ',contactEmail:' NILA@EXAMPLE.TEST ',gradeId:randomUUID(),cycleId:randomUUID(),noticeProvided:true,key:randomUUID()});

  it('normalizes purpose-bound applicant fields without changing selected identities',()=>{
    expect(startApplicationInput(valid())).toMatchObject({applicantName:'Nila Example',contactEmail:'nila@example.test',noticeProvided:true});
  });

  it.each([
    {applicantName:''},
    {contactEmail:'not-an-email'},
    {gradeId:'not-a-uuid'},
    {cycleId:'not-a-uuid'},
    {noticeProvided:false},
    {key:'short'},
  ])('rejects invalid or unacknowledged input %#',override=>{
    expect(()=>startApplicationInput({...valid(),...override})).toThrow('VALIDATION');
  });
});
