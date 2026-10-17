import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {assignReportInput,publishReportInput,reportReason,withdrawReportInput} from '../../backend/modules/assessments/domain/publication';
import {reportDigest} from '../../backend/modules/assessments/infrastructure/publication-digest';

describe('assessment report publication contract',()=>{
 it('normalizes only the approved immediate publication inputs',()=>{const key=randomUUID(),reportRevisionId=randomUUID(),templateId=randomUUID(),publisherAccountId=randomUUID(),handoffId=randomUUID(),publicationId=randomUUID(),documentVersionId=randomUUID(),documentGrantId=randomUUID();expect(assignReportInput({reportRevisionId,templateId,publisherAccountId,audience:'BOTH',key})).toEqual({reportRevisionId,templateId,publisherAccountId,audience:'BOTH',key});expect(publishReportInput({handoffId,expectedVersion:1,documentVersionId,documentGrantId,key})).toEqual({handoffId,expectedVersion:1,documentVersionId,documentGrantId,key});expect(withdrawReportInput({handoffId,publicationId,expectedVersion:2,reason:'  Incorrect result set  ',key}).reason).toBe('Incorrect result set');});
 it('rejects unsupported audiences, invalid versions and unaccountable withdrawal reasons',()=>{const id=randomUUID();expect(()=>assignReportInput({reportRevisionId:id,templateId:id,publisherAccountId:id,audience:'ALL',key:id})).toThrow('VALIDATION');expect(()=>publishReportInput({handoffId:id,expectedVersion:0,documentVersionId:id,documentGrantId:id,key:id})).toThrow('VALIDATION');expect(()=>reportReason('no')).toThrow('VALIDATION');});
 it('pins report evidence deterministically',()=>{const source={cycleId:randomUUID(),version:1,outcomes:[{revision:2,scoreScaled:8250}]};expect(reportDigest(source)).toBe(reportDigest(source));expect(reportDigest({...source,version:2})).not.toBe(reportDigest(source));});
});
