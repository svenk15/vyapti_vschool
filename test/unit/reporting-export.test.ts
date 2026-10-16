import {describe,expect,it,vi} from 'vitest';
import {encodeAttendanceCsv,encodeLeadershipAttendanceCoverageCsv,type AttendanceExportRow} from '../../backend/modules/reporting/domain/export-csv';
import type {LeadershipRegisterCoverage} from '../../shared/contracts/attendance';
import {createLeadershipExportUseCases} from '../../backend/modules/reporting/application/leadership-export';
import {AccessError} from '../../backend/modules/access/contracts';

const row:AttendanceExportRow={schoolDate:'2026-10-05',sessionId:'f39c4ebc-e782-40e8-8799-d4579264cf95',sectionCode:'G8-A',subjectCode:'MATH',studentAdmissionNumber:'A-10',studentName:'Avery Example',status:'LATE',lateMinutes:5,sessionState:'SUBMITTED'};
describe('RPT-02 attendance CSV',()=>{
 it('emits a stable UTF-8 CSV header, CRLF rows and correctly escaped quotes without a BOM',()=>{
  const csv=encodeAttendanceCsv([row,{...row,studentName:'Taylor "Tay" Example'}]);expect(csv.charCodeAt(0)).not.toBe(0xfeff);expect(csv.split('\r\n')).toHaveLength(4);expect(csv).toContain('"schoolDate","sessionId","sectionCode","subjectCode","studentAdmissionNumber","studentName","status","lateMinutes","sessionState"');expect(csv).toContain('"Taylor ""Tay"" Example"');
 });
 it.each(['=1+1',' +SUM(A1:A2)','\t@cmd','-2+3'])('neutralizes spreadsheet formula prefix %s after leading whitespace/control characters',value=>{
  expect(encodeAttendanceCsv([{...row,studentName:value}])).toContain(`"'${value}"`);
 });
});

describe('LEA-39 Principal aggregate CSV',()=>{
 it('keeps the aggregate definition and neutralizes dangerous visible evidence text',()=>{
  const report:LeadershipRegisterCoverage={asOf:'2026-10-16T06:30:00.000Z',schoolDate:'2026-10-16',timezone:'Asia/Kolkata',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',counts:{scheduled:2,due:2,received:1,awaiting:1,notDue:0,cancelled:0},query:{classId:null,status:null,teacherId:null,sort:'due',order:'asc'},filters:{classes:[],teachers:[]},awaiting:{total:1,nextCursor:null,items:[{id:'f39c4ebc-e782-40e8-8799-d4579264cf95',version:1,schoolDate:'2026-10-16',startsAt:'2026-10-16T04:00:00.000Z',endsAt:'2026-10-16T04:40:00.000Z',dueAt:'2026-10-16T04:40:00.000Z',status:'OPEN',sectionName:'=CMD()',subjectName:'Science',teacherName:' +SUM(A1:A2)'}]}};
  const csv=encodeLeadershipAttendanceCoverageCsv(report);expect(csv).toContain('"SUMMARY","register-coverage.v1"');expect(csv).toContain('"\'=CMD()"');expect(csv).toContain('"\' +SUM(A1:A2)"');expect(csv).not.toMatch(/student|roster|mark|explanation/i);
 });
 it('refuses an incomplete 50-row owner page instead of silently truncating the export',async()=>{
  const item={id:'f39c4ebc-e782-40e8-8799-d4579264cf95',version:1,schoolDate:'2026-10-16',startsAt:'2026-10-16T04:00:00.000Z',endsAt:'2026-10-16T04:40:00.000Z',dueAt:'2026-10-16T04:40:00.000Z',status:'OPEN' as const,sectionName:'Section A',subjectName:'Science',teacherName:'Teacher Example'},report:LeadershipRegisterCoverage={asOf:'2026-10-16T06:30:00.000Z',schoolDate:'2026-10-16',timezone:'Asia/Kolkata',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',counts:{scheduled:51,due:51,received:0,awaiting:51,notDue:0,cancelled:0},query:{classId:null,status:null,teacherId:null,sort:'due',order:'asc'},filters:{classes:[],teachers:[]},awaiting:{total:51,nextCursor:'more',items:Array.from({length:50},()=>item)}},record=vi.fn(),service=createLeadershipExportUseCases({attendanceCoverage:async()=>report},{availability:async()=>({canExport:true,reportTypes:['attendance-register-coverage.v1']}),record,grant:async()=>({grantId:item.id,version:1}),revoke:async()=>({grantId:item.id,version:2})});
  await expect(service.exportLeadershipAttendance({accountId:item.id,tokenVersion:1},item.id,item.id,{date:'2026-10-16'})).rejects.toEqual(new AccessError('VALIDATION'));expect(record).not.toHaveBeenCalled();
 });
});
