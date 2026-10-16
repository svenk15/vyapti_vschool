import type {LeadershipRegisterCoverage} from '../../../../shared/contracts/attendance';
import type {LeadershipLearningOverview} from '../../../../shared/contracts/learning';

export type AttendanceExportRow=Readonly<{
 schoolDate:string;sessionId:string;sectionCode:string;subjectCode:string;studentAdmissionNumber:string;
 studentName:string;status:'PRESENT'|'ABSENT'|'LATE'|'EXCUSED';lateMinutes:number|null;sessionState:'SUBMITTED';
}>;

const csvCell=(raw:string|number|null)=>{
 const value=raw===null?'':String(raw);
 const safe=/^[\u0000-\u0020]*[=+@-]/.test(value)?`'${value}`:value;
 return `"${safe.replaceAll('"','""')}"`;
};

export function encodeAttendanceCsv(rows:readonly AttendanceExportRow[]):string{
 const header=['schoolDate','sessionId','sectionCode','subjectCode','studentAdmissionNumber','studentName','status','lateMinutes','sessionState'];
 return [header.map(csvCell).join(','),...rows.map(row=>[row.schoolDate,row.sessionId,row.sectionCode,row.subjectCode,row.studentAdmissionNumber,row.studentName,row.status,row.lateMinutes,row.sessionState].map(csvCell).join(','))].join('\r\n')+'\r\n';
}

export function encodeLeadershipAttendanceCoverageCsv(report:LeadershipRegisterCoverage):string{
 const header=['rowKind','definitionVersion','asOf','schoolDate','timezone','duePolicy','scheduled','due','received','awaiting','notDue','cancelled','sessionId','section','subject','expectedTeacher','sessionStatus','startsAt','dueAt'];
 const summary:(string|number|null)[]=['SUMMARY',report.definitionVersion,report.asOf,report.schoolDate,report.timezone,report.duePolicy,report.counts.scheduled,report.counts.due,report.counts.received,report.counts.awaiting,report.counts.notDue,report.counts.cancelled,null,null,null,null,null,null,null];
 const evidence:(string|number|null)[][]=report.awaiting.items.map(item=>['AWAITING_REGISTER',report.definitionVersion,report.asOf,report.schoolDate,report.timezone,report.duePolicy,null,null,null,null,null,null,item.id,item.sectionName,item.subjectName,item.teacherName,item.status,item.startsAt,item.dueAt]);
 return [header,summary,...evidence].map(row=>row.map(value=>csvCell(value)).join(',')).join('\r\n')+'\r\n';
}

export function encodeLeadershipAssignmentCompletionCsv(report:LeadershipLearningOverview):string{
 const header=['rowKind','definitionVersion','asOf','timezone','fromDate','toDateExclusive','denominatorPolicy','assignments','expectedDue','submitted','awaiting','upcoming','assignmentId','assignmentVersionId','title','class','subject','dueAt','due','assignmentExpected','assignmentSubmitted','assignmentAwaiting'];
 const summary:(string|number|null)[]=['SUMMARY',report.definitionVersion,report.asOf,report.timezone,report.query.fromDate,report.query.toDate,report.denominatorPolicy,report.counts.assignments,report.counts.expectedPairs,report.counts.submittedPairs,report.counts.awaitingPairs,report.counts.upcomingPairs,null,null,null,null,null,null,null,null,null,null];
 const evidence:(string|number|null)[][]=report.assignments.items.map(item=>['ASSIGNMENT',report.definitionVersion,report.asOf,report.timezone,report.query.fromDate,report.query.toDate,report.denominatorPolicy,null,null,null,null,null,item.assignmentId,item.assignmentVersionId,item.title,item.classLabel,item.subjectName,item.dueAt,item.due?'true':'false',item.expectedPairs,item.submittedPairs,item.awaitingPairs]);
 return [header,summary,...evidence].map(row=>row.map(value=>csvCell(value)).join(',')).join('\r\n')+'\r\n';
}
