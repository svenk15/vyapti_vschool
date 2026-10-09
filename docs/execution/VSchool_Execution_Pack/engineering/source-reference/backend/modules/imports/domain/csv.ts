export type RosterFields=Readonly<{externalStudentId:string;firstName:string;lastName:string;admissionNumber:string;gradeCode:string;sectionCode:string;rollNumber:string|null}>;
export type ParsedRosterRow=Readonly<{rowNumber:number;fields:RosterFields;errors:readonly {column:string;code:string;message:string}[]}>;
export type CsvErrorCode='FILE_TOO_LARGE'|'EMPTY_FILE'|'INVALID_UTF8'|'MALFORMED_CSV'|'INVALID_HEADERS'|'TOO_MANY_ROWS'|'CELL_TOO_LARGE';
export class CsvInputError extends Error{constructor(readonly code:CsvErrorCode,readonly rowNumber?:number,readonly column?:string){super(code);this.name='CsvInputError';}}
export const MAX_CSV_BYTES=2*1024*1024,MAX_DATA_ROWS=1000,MAX_CELL_BYTES=4096;
const required=['external_student_id','student_first_name','admission_number','grade','section'] as const;
const allowed=new Set([...required,'student_last_name','roll_number']);
const enc=new TextEncoder();
function parseRecords(text:string):string[][]{
 const records:string[][]=[];let row:string[]=[],cell='',quoted=false,closed=false;
 const pushCell=()=>{row.push(cell);cell='';closed=false;};
 const pushRow=()=>{pushCell();records.push(row);row=[];};
 for(let i=0;i<text.length;i++){
  const char=text[i]!;
  if(quoted){if(char==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=char;continue;}
  if(closed){if(char===','){pushCell();continue;}if(char==='\n'){pushRow();continue;}if(char==='\r'&&text[i+1]==='\n'){pushRow();i++;continue;}throw new CsvInputError('MALFORMED_CSV',records.length+1);}
  if(char==='"'){if(cell.length!==0)throw new CsvInputError('MALFORMED_CSV',records.length+1);quoted=true;continue;}
  if(char===','){pushCell();continue;}
  if(char==='\n'){pushRow();continue;}
  if(char==='\r'){if(text[i+1]!=='\n')throw new CsvInputError('MALFORMED_CSV',records.length+1);pushRow();i++;continue;}
  cell+=char;
 }
 if(quoted)throw new CsvInputError('MALFORMED_CSV',records.length+1);
 if(cell.length||row.length||closed)pushRow();
 return records;
}
const clean=(value:string)=>value.normalize('NFC').trim();
function rowFields(values:Record<string,string>,rowNumber:number):ParsedRosterRow{
 const errors:{column:string;code:string;message:string}[]=[],field=(column:string,code:string,label:string,requiredField=false,max=160)=>{const value=clean(values[column]??'');if((requiredField&&!value)||value.length>max||/[\u0000-\u001f\u007f]/.test(value)){errors.push({column,code,message:label});return '';}return value;};
 const externalStudentId=field('external_student_id','INVALID_EXTERNAL_ID','Enter a source ID up to 100 characters.',true,100),firstName=field('student_first_name','INVALID_FIRST_NAME','Enter a first name up to 100 characters.',true,100),lastName=field('student_last_name','INVALID_LAST_NAME','Enter a last name up to 100 characters.',false,100),admissionNumber=field('admission_number','INVALID_ADMISSION','Enter an admission number up to 40 characters.',true,40),gradeCode=field('grade','INVALID_GRADE','Enter a configured grade code.',true,40),sectionCode=field('section','INVALID_SECTION','Enter a configured section code.',true,40),rawRoll=clean(values.roll_number??'');
 if(gradeCode&&!/^[A-Z0-9][A-Z0-9_-]{0,39}$/.test(gradeCode))errors.push({column:'grade',code:'INVALID_GRADE_CODE',message:'Use the exact configured grade code.'});
 if(sectionCode&&!/^[A-Z0-9][A-Z0-9_-]{0,39}$/.test(sectionCode))errors.push({column:'section',code:'INVALID_SECTION_CODE',message:'Use the exact configured section code.'});
 if(rawRoll.length>30||/[\u0000-\u001f\u007f]/.test(rawRoll))errors.push({column:'roll_number',code:'INVALID_ROLL_NUMBER',message:'Roll number must be at most 30 characters.'});
 return {rowNumber,fields:{externalStudentId,firstName,lastName,admissionNumber,gradeCode,sectionCode,rollNumber:rawRoll||null},errors};
}
export function parseRosterCsv(bytes:Uint8Array):ParsedRosterRow[]{
 if(bytes.byteLength>MAX_CSV_BYTES)throw new CsvInputError('FILE_TOO_LARGE');
 let text:string;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new CsvInputError('INVALID_UTF8');}
 if(text.charCodeAt(0)===0xfeff)text=text.slice(1);
 const records=parseRecords(text);if(!records.length||records.length===1&&records[0]!.length===1&&records[0]![0]==='')throw new CsvInputError('EMPTY_FILE');
 const headers=records[0]!.map(value=>value.trim());if(headers.some(value=>!allowed.has(value))||new Set(headers).size!==headers.length||required.some(value=>!headers.includes(value))||headers.length<required.length)throw new CsvInputError('INVALID_HEADERS',1);
 if(records.length-1>MAX_DATA_ROWS)throw new CsvInputError('TOO_MANY_ROWS');
 const rows=records.slice(1).map((cells,index)=>{
  if(cells.length!==headers.length)throw new CsvInputError('MALFORMED_CSV',index+2);
  const values=Object.fromEntries(headers.map((header,col)=>[header,cells[col]??'']));
  for(let column=0;column<headers.length;column++)if(enc.encode(cells[column]??'').length>MAX_CELL_BYTES)throw new CsvInputError('CELL_TOO_LARGE',index+2,headers[column]);
  return rowFields(values,index+2);
 });
 const externalIds=new Set<string>(),admissions=new Set<string>();
 return rows.map(row=>{const errors=[...row.errors];if(row.fields.externalStudentId&&externalIds.has(row.fields.externalStudentId))errors.push({column:'external_student_id',code:'DUPLICATE_EXTERNAL_ID',message:'This source ID appears more than once in the file.'});else if(row.fields.externalStudentId)externalIds.add(row.fields.externalStudentId);if(row.fields.admissionNumber&&admissions.has(row.fields.admissionNumber))errors.push({column:'admission_number',code:'DUPLICATE_ADMISSION_NUMBER',message:'This admission number appears more than once in the file.'});else if(row.fields.admissionNumber)admissions.add(row.fields.admissionNumber);return {...row,errors};});
}
export function validCivilDate(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [year,month,day]=value.split('-').map(Number),date=new Date(Date.UTC(year,month-1,day));return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day;}
