import {createHash} from 'node:crypto';
import type {AssessmentReportDocument,AssessmentReportSource} from '../../../../shared/contracts/assessment-publications';

const escape=(value:string)=>value.normalize('NFC').replace(/[^\x20-\x7e]/g,'?').replace(/([\\()])/g,'\\$1');
export function renderSyntheticAssessmentReport(source:AssessmentReportSource,generatedAt:string):AssessmentReportDocument{
 const lines=[
  'SYNTHETIC DEVELOPMENT REPORT — NOT AN OFFICIAL SCHOOL RECORD',
  source.schoolName,
  `Student: ${source.studentName} (${source.admissionNumber})`,
  `Academic period: ${source.academicPeriod}`,
  `Assessment cycle: ${source.cycleName}`,
  `Report reference: ${source.reportReference}`,
  `Template: ${source.templateName} v${source.templateVersion}`,
  ...source.subjects.map(row=>`${row.name}: ${row.outcome}`),
  `Configured signatory: ${source.signatoryName}, ${source.signatoryTitle}`,
  `Generated for immediate publication: ${generatedAt}`,
  'No signature image or legal signature is asserted.'
 ];
 const commands=['BT','/F1 11 Tf','54 770 Td',...lines.flatMap((line,index)=>[index?'0 -20 Td':'',`(${escape(line)}) Tj`]).filter(Boolean),'ET'].join('\n'),objects=[
  '<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(commands)} >>\nstream\n${commands}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
 ];
 let pdf='%PDF-1.4\n',offsets=[0];for(let i=0;i<objects.length;i++){offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}const xref=Buffer.byteLength(pdf);pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(offset=>String(offset).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;const bytes=new Uint8Array(Buffer.from(pdf));return {filename:`${source.reportReference.toLowerCase()}.pdf`,bytes,sha256:createHash('sha256').update(bytes).digest('hex')};
}
