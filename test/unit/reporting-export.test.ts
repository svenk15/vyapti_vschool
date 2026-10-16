import {describe,expect,it} from 'vitest';
import {encodeAttendanceCsv,type AttendanceExportRow} from '../../backend/modules/reporting/domain/export-csv';

const row:AttendanceExportRow={schoolDate:'2026-10-05',sessionId:'f39c4ebc-e782-40e8-8799-d4579264cf95',sectionCode:'G8-A',subjectCode:'MATH',studentAdmissionNumber:'A-10',studentName:'Avery Example',status:'LATE',lateMinutes:5,sessionState:'SUBMITTED'};
describe('RPT-02 attendance CSV',()=>{
 it('emits a stable UTF-8 CSV header, CRLF rows and correctly escaped quotes without a BOM',()=>{
  const csv=encodeAttendanceCsv([row,{...row,studentName:'Taylor "Tay" Example'}]);expect(csv.charCodeAt(0)).not.toBe(0xfeff);expect(csv.split('\r\n')).toHaveLength(4);expect(csv).toContain('"schoolDate","sessionId","sectionCode","subjectCode","studentAdmissionNumber","studentName","status","lateMinutes","sessionState"');expect(csv).toContain('"Taylor ""Tay"" Example"');
 });
 it.each(['=1+1',' +SUM(A1:A2)','\t@cmd','-2+3'])('neutralizes spreadsheet formula prefix %s after leading whitespace/control characters',value=>{
  expect(encodeAttendanceCsv([{...row,studentName:value}])).toContain(`"'${value}"`);
 });
});
