import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {privateResponseText,saveStudentDraftInput,submitStudentWorkInput} from '../../backend/modules/learning/domain/submissions';

describe('Learning text submissions',()=>{
  it('normalizes a private text response without trimming authored content',()=>{
    expect(privateResponseText('  First line\r\nSecond line  ')).toBe('  First line\nSecond line  ');
  });

  it('rejects empty, control-character and oversized responses',()=>{
    for(const value of ['   ','answer\u0000text','x'.repeat(10_001)])expect(()=>privateResponseText(value)).toThrow('VALIDATION');
  });

  it('accepts only the exact versioned draft and submission command shapes',()=>{
    const studentId=randomUUID(),key=randomUUID();
    expect(saveStudentDraftInput({studentId,expectedVersion:0,text:'My response',key})).toEqual({studentId,expectedVersion:0,text:'My response',key});
    expect(submitStudentWorkInput({studentId,reviewedAssignmentVersion:1,expectedDraftVersion:2,key})).toEqual({studentId,reviewedAssignmentVersion:1,expectedDraftVersion:2,key});
    expect(()=>saveStudentDraftInput({studentId,expectedVersion:0,text:'My response',key,teacherCanRead:true})).toThrow('VALIDATION');
    expect(()=>submitStudentWorkInput({studentId,reviewedAssignmentVersion:1,expectedDraftVersion:0,key})).toThrow('VALIDATION');
  });
});
