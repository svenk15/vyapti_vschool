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
