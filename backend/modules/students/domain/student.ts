import { AccessError, uuidPattern } from "../../access/contracts/index";

export type StudentIdentityInput = Readonly<
  | {kind:"NEW";firstName:string;lastName:string}
  | {kind:"EXISTING";personId:string}
>;
export type LegacyStudentRegistrationInput = Readonly<{firstName:string;lastName:string;existingPersonId:string|null}>;
export type StudentInput = Readonly<{ identity:StudentIdentityInput; admissionNumber:string; admittedOn:string; legacyReceiptInput:LegacyStudentRegistrationInput|null }>;

export class StudentRegistrationValidationError extends AccessError {
  constructor(public readonly field:"identity"|"firstName"|"lastName"|"admissionNumber"|"admittedOn"){super("VALIDATION");}
}

function personName(value: unknown, required: boolean,field:"firstName"|"lastName"): string {
  if (typeof value !== "string") throw new StudentRegistrationValidationError(field);
  const normalized = value.normalize("NFC").trim();
  if ((required && !normalized) || normalized.length > 100 || /[\u0000-\u001f\u007f]/.test(normalized)) throw new StudentRegistrationValidationError(field);
  return normalized;
}

type CurrentStudentInput={identity:unknown;admissionNumber:unknown;admittedOn:unknown};
type LegacyStudentInput={firstName:unknown;lastName?:unknown;admissionNumber:unknown;admittedOn:unknown;existingPersonId?:unknown};
export function studentInput(input: CurrentStudentInput|LegacyStudentInput): StudentInput {
  let identity:StudentIdentityInput,legacyReceiptInput:LegacyStudentRegistrationInput|null=null;
  if("identity" in input){
    if(!input.identity||typeof input.identity!=="object"||Array.isArray(input.identity))throw new StudentRegistrationValidationError("identity");
    const candidate=input.identity as Record<string,unknown>;
    if(candidate.kind==="NEW")identity={kind:"NEW",firstName:personName(candidate.firstName,true,"firstName"),lastName:personName(candidate.lastName??"",false,"lastName")};
    else if(candidate.kind==="EXISTING")identity={kind:"EXISTING",personId:uuidField(candidate.personId,"identity")};
    else throw new StudentRegistrationValidationError("identity");
  }else{
    const firstName=personName(input.firstName,true,"firstName"),lastName=personName(input.lastName??"",false,"lastName"),existingPersonId=input.existingPersonId==null||input.existingPersonId===""?null:uuidField(input.existingPersonId,"identity");
    identity=existingPersonId?{kind:"EXISTING",personId:existingPersonId}:{kind:"NEW",firstName,lastName};
    legacyReceiptInput={firstName,lastName,existingPersonId};
  }
  if (typeof input.admissionNumber !== "string") throw new StudentRegistrationValidationError("admissionNumber");
  const admissionNumber = input.admissionNumber.normalize("NFC").trim();
  if (!admissionNumber || admissionNumber.length > 40 || /[\u0000-\u001f\u007f]/.test(admissionNumber)) throw new StudentRegistrationValidationError("admissionNumber");
  return {identity,admissionNumber,admittedOn:civilDateField(input.admittedOn,"admittedOn"),legacyReceiptInput};
}

export type StudentSearchBy = "combined"|"name"|"admissionNumber";
export type StudentSort = "name"|"admissionNumber"|"status";
export type StudentSortOrder = "asc"|"desc";
export type StudentListQuery = Readonly<{search:string;by:StudentSearchBy;sort:StudentSort;order:StudentSortOrder;cursor:string|null;limit:number;status:"ACTIVE"|"ARCHIVED"|"ALL"}>;

export function studentListQuery(input: { search?: unknown; by?:unknown; sort?:unknown; order?:unknown; cursor?: unknown; limit?: unknown; status?: unknown }):StudentListQuery {
  if (input.search !== undefined && typeof input.search !== "string") throw new AccessError("VALIDATION");
  const search = typeof input.search === "string" ? input.search.normalize("NFC").trim() : "";
  if (search.length > 100 || /[\u0000-\u001f\u007f]/.test(search)) throw new AccessError("VALIDATION");
  const limit = input.limit === undefined ? 50 : Number(input.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new AccessError("VALIDATION");
  const status = input.status === undefined ? "ACTIVE" : input.status;
  if (status !== "ACTIVE" && status !== "ARCHIVED" && status !== "ALL") throw new AccessError("VALIDATION");
  const checkedStatus = status as "ACTIVE"|"ARCHIVED"|"ALL";
  const by=input.by===undefined?"combined":input.by;
  if(by!=="combined"&&by!=="name"&&by!=="admissionNumber")throw new AccessError("VALIDATION");
  const sort=input.sort===undefined?"name":input.sort;
  if(sort!=="name"&&sort!=="admissionNumber"&&sort!=="status")throw new AccessError("VALIDATION");
  const order=input.order===undefined?"asc":input.order;
  if(order!=="asc"&&order!=="desc")throw new AccessError("VALIDATION");
  const cursor = input.cursor == null || input.cursor === "" ? null : input.cursor;
  if (cursor !== null && (typeof cursor !== "string" || cursor.length > 2048)) throw new AccessError("INVALID_CURSOR");
  return { search, by, sort, order, cursor: cursor as string | null, limit, status: checkedStatus };
}

export type ExistingPersonReference = Readonly<
  | { kind: "PERSON_ID"; personId: string }
  | { kind: "ADMISSION_NUMBER"; admissionNumber: string }
>;

export function existingPersonReference(kind: unknown, value: unknown): ExistingPersonReference {
  if (kind === "PERSON_ID") return { kind, personId: uuid(value) };
  if (kind === "ADMISSION_NUMBER") {
    if (typeof value !== "string") throw new AccessError("VALIDATION");
    const admissionNumber = value.normalize("NFC").trim();
    if (!admissionNumber || admissionNumber.length > 40 || /[\u0000-\u001f\u007f]/.test(admissionNumber)) throw new AccessError("VALIDATION");
    return { kind, admissionNumber };
  }
  throw new AccessError("VALIDATION");
}

function civilDate(value:unknown):string{
  if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new AccessError("VALIDATION");
  const [year,month,day]=value.split("-").map(Number),date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)throw new AccessError("VALIDATION");
  return value;
}
function civilDateField(value:unknown,field:"admittedOn"){try{return civilDate(value);}catch{throw new StudentRegistrationValidationError(field);}}
function uuidField(value:unknown,field:"identity"){if(typeof value!=="string"||!uuidPattern.test(value))throw new StudentRegistrationValidationError(field);return value.toLowerCase();}
function addCivilDay(value:string):string{
  const [year,month,day]=value.split("-").map(Number),next=new Date(Date.UTC(year,month-1,day+1));
  if(next.getUTCFullYear()>9999)throw new AccessError("VALIDATION");
  return `${next.getUTCFullYear().toString().padStart(4,"0")}-${(next.getUTCMonth()+1).toString().padStart(2,"0")}-${next.getUTCDate().toString().padStart(2,"0")}`;
}
export function enrollmentInput(input:{studentId:unknown;yearId:unknown;sectionId:unknown;startsOn:unknown;lastDay:unknown;rollNumber?:unknown}){
  const startsOn=civilDate(input.startsOn),lastDay=civilDate(input.lastDay);
  if(startsOn>lastDay)throw new AccessError("VALIDATION");
  let rollNumber:string|null=null;
  if(input.rollNumber!==undefined&&input.rollNumber!==null&&input.rollNumber!==""){
    if(typeof input.rollNumber!=="string")throw new AccessError("VALIDATION");
    rollNumber=input.rollNumber.normalize("NFC").trim();
    if(rollNumber.length>30||/[\u0000-\u001f\u007f]/.test(rollNumber))throw new AccessError("VALIDATION");
  }
  return {studentId:uuid(input.studentId),yearId:uuid(input.yearId),sectionId:uuid(input.sectionId),validFrom:startsOn,validTo:addCivilDay(lastDay),rollNumber};
}
function reasonText(value:unknown):string{if(typeof value!=="string")throw new AccessError("VALIDATION");const result=value.normalize("NFC").trim();if(result.length<5||result.length>500||/[\u0000-\u001f\u007f]/.test(result))throw new AccessError("VALIDATION");return result;}
function expectedVersion(value:unknown):number{if(typeof value!=="number"||!Number.isSafeInteger(value)||value<1)throw new AccessError("VALIDATION");return value;}
export function transferInput(input:{expectedVersion:unknown;toSectionId:unknown;effectiveDate:unknown;rollNumber?:unknown;reason:unknown}){
  let rollNumber:string|undefined;
  if(input.rollNumber!==undefined){if(input.rollNumber===null||typeof input.rollNumber!=="string")throw new AccessError("VALIDATION");rollNumber=input.rollNumber.normalize("NFC").trim();if(rollNumber.length>30||/[\u0000-\u001f\u007f]/.test(rollNumber))throw new AccessError("VALIDATION");}
  return {expectedVersion:expectedVersion(input.expectedVersion),toSectionId:uuid(input.toSectionId),effectiveDate:civilDate(input.effectiveDate),rollNumber,reason:reasonText(input.reason)};
}
export function archiveInput(input:{expectedVersion:unknown;reason:unknown}){return {expectedVersion:expectedVersion(input.expectedVersion),reason:reasonText(input.reason)};}
export function nameCorrectionInput(input:{expectedPersonVersion:unknown;firstName:unknown;lastName?:unknown;reason:unknown}){return {expectedPersonVersion:expectedVersion(input.expectedPersonVersion),firstName:input.firstName,lastName:input.lastName,reason:reasonText(input.reason)};}
export function admissionDateCorrectionInput(input:{expectedVersion:unknown;admittedOn:unknown;reason:unknown}){return {expectedVersion:expectedVersion(input.expectedVersion),admittedOn:civilDate(input.admittedOn),reason:reasonText(input.reason)};}
function uuid(value:unknown){if(typeof value!=="string"||!uuidPattern.test(value))throw new AccessError("VALIDATION");return value.toLowerCase();}

export function displayStudentName(firstName: string, lastName: string): string { return `${firstName} ${lastName}`.trim(); }
