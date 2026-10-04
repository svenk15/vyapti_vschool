import {describe,expect,it} from 'vitest';
import {CsvInputError,parseRosterCsv} from '../../backend/modules/imports/domain/csv';

const headers='external_student_id,student_first_name,admission_number,grade,section,student_last_name,roll_number';
const parse=(text:string)=>parseRosterCsv(new TextEncoder().encode(text));

describe('STUDENT_ROSTER_V1 CSV contract',()=>{
 it('accepts UTF-8 BOM, quoted commas and newlines, optional fields and preserves leading zeroes',()=>{
  const rows=parse(`\uFEFF${headers}\nSRC-01,"Casey, Jr",0007,G8,A,Casey,0003\n`);
  expect(rows).toEqual([{rowNumber:2,fields:{externalStudentId:'SRC-01',firstName:'Casey, Jr',lastName:'Casey',admissionNumber:'0007',gradeCode:'G8',sectionCode:'A',rollNumber:'0003'},errors:[]}]);
  expect(parse('external_student_id,student_first_name,admission_number,grade,section\nSRC,Casey,0001,G8,A')[0]?.fields.lastName).toBe('');
 });
 it('reports duplicate external and admission identifiers as row errors',()=>{
  const rows=parse(`${headers}\nSRC,Casey,0001,G8,A,,\nSRC,Riley,0001,G8,A,,`);
  expect(rows[1]?.errors.map(error=>error.code)).toEqual(['DUPLICATE_EXTERNAL_ID','DUPLICATE_ADMISSION_NUMBER']);
 });
 it('rejects malformed, oversized and unsupported files with stable codes',()=>{
  for(const [input,code] of [['','EMPTY_FILE'],['x'.repeat(1), 'INVALID_HEADERS'],[`${headers}\n"unterminated`, 'MALFORMED_CSV'],[`${headers}\nSRC,N,1,G8,A,${'x'.repeat(4097)},`, 'CELL_TOO_LARGE'],[`${headers}\n${Array.from({length:1001},(_,i)=>`S${i},N,${i},G8,A`).join('\n')}`,'TOO_MANY_ROWS']] as const){
   try{parse(input);throw new Error('expected CSV validation failure');}catch(error){expect(error).toBeInstanceOf(CsvInputError);expect((error as CsvInputError).code).toBe(code);}
  }
  expect(()=>parseRosterCsv(new Uint8Array(2*1024*1024+1))).toThrowError(expect.objectContaining({code:'FILE_TOO_LARGE'}));
  expect(()=>parseRosterCsv(new Uint8Array([0xff,0xfe]))).toThrowError(expect.objectContaining({code:'INVALID_UTF8'}));
  expect(()=>parse(`${headers},unexpected\nSRC,Casey,1,G8,A,,`)).toThrowError(expect.objectContaining({code:'INVALID_HEADERS'}));
 });
});
