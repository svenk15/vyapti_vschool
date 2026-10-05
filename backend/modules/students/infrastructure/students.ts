import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import type { Identity } from "../../../../shared/contracts/access";
import type { EnrollmentOptions, EnrollmentResult, ExistingPersonChoice, StudentArchiveResult, StudentDetail, StudentEnrollmentHistory, StudentProfile, StudentTransferResult, StudentWorkspace } from "../../../../shared/contracts/students";
import { AccessError, capabilitiesFor } from "../../access/contracts/index";
import type { PersonIdentityPort } from "../../people/contracts/person-identity";
import type { CommandEvidenceWriter } from "../../platform/contracts/command-evidence";
import type { ReleaseManifest } from "../../tenancy/contracts/index";
import type { AttendanceStudentImpactPort, StudentRepository } from "../application/students";
import type { StudentInput } from "../domain/student";
import { displayStudentName } from "../domain/student";
import type { EnlistedRegistrationInput, EnlistedRegistrationResult, StudentRegistrationTransaction } from "../contracts/enlisted-student-registration";
import type {StudentAttendanceRosterEntry,StudentAttendanceRosterPort} from '../contracts/attendance-roster';

type Guard = { configurationVersion: number; timezone:string };
const NO_RELEASE: ReleaseManifest = { student_core:false,academic_core:false,staff_core:false,attendance:false,fees:false,admissions:false,assessments:false,family:false,communication:false,timetable:false,homework:false,transport:false,hr:false,library:false,inventory:false,health:false,analytics:false,ai:false };
const canonical = (value: unknown): string => Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : value && typeof value === "object" ? `{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(",")}}` : JSON.stringify(value);
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const inputHash = (value: unknown) => sha(canonical(value));
type Cursor = { organizationId: string; schoolId: string; accountId: string; searchHash: string; status: string; after: string };
function encodeCursor(value: Cursor, secret: string) { const payload=Buffer.from(JSON.stringify(value)).toString("base64url");return `${payload}.${createHmac("sha256",secret).update(payload).digest("base64url")}`; }
function decodeCursor(cursor: string | null, expected: Omit<Cursor,"after">, secret: string): string | null {
  if (!cursor) return null;
  if (secret.length < 32) throw new AccessError("UNAVAILABLE");
  const [payload,signature,...extra]=cursor.split(".");
  if (!payload || !signature || extra.length || !/^[A-Za-z0-9_-]{43}$/.test(signature)) throw new AccessError("INVALID_CURSOR");
  const expectedSignature=createHmac("sha256",secret).update(payload).digest("base64url");
  if (!timingSafeEqual(Buffer.from(signature),Buffer.from(expectedSignature))) throw new AccessError("INVALID_CURSOR");
  try { const value=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as Cursor;if(value.organizationId!==expected.organizationId||value.schoolId!==expected.schoolId||value.accountId!==expected.accountId||value.searchHash!==expected.searchHash||value.status!==expected.status||typeof value.after!=="string"||!/^[0-9a-f-]{36}$/i.test(value.after))throw new Error();return value.after; }
  catch { throw new AccessError("INVALID_CURSOR"); }
}
function profile(row: {id:string;personId:string;version:number;admissionNumber:string;status:string;person:{firstName:string;lastName:string};enrollments?:{id:string;yearId:string;year:{code:string;name:string}}[]}): StudentProfile {
  const latest=row.enrollments?.[0];
  return { studentId:row.id,personId:row.personId,version:row.version,admissionNumber:row.admissionNumber,displayName:displayStudentName(row.person.firstName,row.person.lastName),status:row.status as "ACTIVE"|"ARCHIVED",enrollment:latest?{enrollmentId:latest.id,yearId:latest.yearId,yearCode:latest.year.code,yearName:latest.year.name}:null };
}
function civilDate(date:Date){return date.toISOString().slice(0,10);}
function schoolToday(now:Date,timezone:string){const parts=new Intl.DateTimeFormat("en-US",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now),values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return `${values.year}-${values.month}-${values.day}`;}
function enrollmentHistory(rows:{id:string;version:number;yearId:string;validFrom:Date;validTo:Date;year:{code:string;name:string};placements:{id:string;sectionId:string;validFrom:Date;validTo:Date;rollNumber:string|null;section:{code:string;name:string;grade:{name:string}}}[]}[],rosterCounts:Map<string,number>):StudentEnrollmentHistory[]{return rows.map(row=>({enrollmentId:row.id,version:row.version,yearId:row.yearId,yearCode:row.year.code,yearName:row.year.name,validFrom:civilDate(row.validFrom),validTo:civilDate(row.validTo),placements:row.placements.map(placement=>({placementId:placement.id,sectionId:placement.sectionId,sectionCode:placement.section.code,sectionName:placement.section.name,gradeName:placement.section.grade.name,validFrom:civilDate(placement.validFrom),validTo:civilDate(placement.validTo),rollNumber:placement.rollNumber,activeRosterCount:rosterCounts.get(placement.sectionId)??0}))}));}
function enrollmentResult(row:{id:string;version:number;studentId:string;yearId:string;validFrom:Date;validTo:Date;year:{code:string;name:string};placements:{id:string;sectionId:string;validFrom:Date;validTo:Date;rollNumber:string|null;section:{code:string;name:string;grade:{name:string}}}[]},replayed:boolean,activeRosterCount:number):EnrollmentResult{
  const placement=row.placements[0]!;
  return {enrollmentId:row.id,version:row.version,studentId:row.studentId,yearId:row.yearId,yearCode:row.year.code,yearName:row.year.name,validFrom:civilDate(row.validFrom),validTo:civilDate(row.validTo),placement:{placementId:placement.id,sectionId:placement.sectionId,sectionCode:placement.section.code,sectionName:placement.section.name,gradeName:placement.section.grade.name,validFrom:civilDate(placement.validFrom),validTo:civilDate(placement.validTo),rollNumber:placement.rollNumber,activeRosterCount},replayed};
}
function fail(error: unknown): never {
  if (error instanceof AccessError) throw error;
  const value=error as {code?:string;meta?:{driverAdapterError?:{cause?:{kind?:string}}}};
  if (value.code === "P2002") throw new AccessError("CONFLICT");
  if (value.code === "P2003" || value.code === "P2025") throw new AccessError("NOT_FOUND");
  if (["P2034","40001","40P01"].includes(value.code??"") || value.code === "P2010" && value.meta?.driverAdapterError?.cause?.kind === "TransactionWriteConflict") throw new AccessError("STALE_VERSION");
  throw new AccessError("UNAVAILABLE");
}

export class PrismaStudentRepository implements StudentRepository,StudentAttendanceRosterPort {
  constructor(private readonly db:PrismaClient,private readonly evidence:(tx:Prisma.TransactionClient)=>CommandEvidenceWriter,private readonly people:PersonIdentityPort,private readonly now:()=>Date=()=>new Date(),private readonly cursorSecret="",private readonly manifest:ReleaseManifest=NO_RELEASE,private readonly attendanceImpact:AttendanceStudentImpactPort={async hasFrozenSessions(){throw new AccessError("UNAVAILABLE");}}){}

  private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string,permission:"student.manage"|"student.read",lock:boolean,modules:readonly ("student_core"|"academic_core")[]=["student_core"]):Promise<Guard>{
    if(lock) await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`;
    const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});
    if(!account||account.status!=="ACTIVE"||account.tokenVersion!==actor.tokenVersion) throw new AccessError("UNAUTHENTICATED");
    if(lock) await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR SHARE`;
    const organization=await tx.organization.findFirst({where:{id:organizationId,status:"ACTIVE"},select:{id:true}});
    if(!organization) throw new AccessError("NOT_FOUND");
    if(lock) await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${organizationId}::uuid AND id=${schoolId}::uuid FOR UPDATE`;
    const school=await tx.school.findFirst({where:{organizationId,id:schoolId,status:"ACTIVE"},select:{configurationVersion:true,timezone:true}});
    if(!school) throw new AccessError("NOT_FOUND");
    const membership=await tx.schoolMembership.findFirst({where:{accountId:actor.accountId,organizationId,schoolId,status:"ACTIVE"},select:{grants:{select:{code:true}}}});
    if(!membership||!capabilitiesFor(membership.grants.map(grant=>grant.code as "SCHOOL_ADMIN"|"TEACHER")).includes(permission)) throw new AccessError("FORBIDDEN");
    const now=this.now();
    for(const moduleId of modules){
      if(!this.manifest[moduleId])throw new AccessError("RELEASE_UNAVAILABLE");
      const entitlement=await tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId}}}),activation=await tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId}}});
      if(!entitlement||entitlement.state!=="ACTIVE"||entitlement.startsAt>now||(entitlement.endsAt!==null&&entitlement.endsAt<=now))throw new AccessError("MODULE_NOT_LICENSED");
      if(!activation||activation.state!=="ACTIVE")throw new AccessError("MODULE_DISABLED");
    }
    return {configurationVersion:school.configurationVersion,timezone:school.timezone};
  }
  private async moduleActive(tx:Prisma.TransactionClient,organizationId:string,schoolId:string,moduleId:"student_core"|"academic_core"){
    if(!this.manifest[moduleId])return false;const now=this.now(),[entitlement,activation]=await Promise.all([tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId}}}),tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId}}})]);
    return !!entitlement&&entitlement.state==="ACTIVE"&&entitlement.startsAt<=now&&(entitlement.endsAt===null||entitlement.endsAt>now)&&activation?.state==="ACTIVE";
  }
  private async enrollmentTimeline(tx:Prisma.TransactionClient,organizationId:string,schoolId:string,enrollmentId:string,today:string){
    const rows=await tx.enrollment.findMany({where:{id:enrollmentId,organizationId,schoolId},include:{year:{select:{code:true,name:true}},placements:{where:{organizationId,schoolId},orderBy:{validFrom:"asc"},include:{section:{select:{code:true,name:true,grade:{select:{name:true}}}}}}}});
    if(!rows.length)throw new AccessError("NOT_FOUND");
    const todayDate=new Date(`${today}T00:00:00.000Z`),counts=await tx.sectionPlacement.groupBy({by:["sectionId"],where:{organizationId,schoolId,validFrom:{lte:todayDate},validTo:{gt:todayDate},enrollment:{is:{year:{is:{status:"OPEN"}}}}},_count:{_all:true}});
    return enrollmentHistory(rows,new Map(counts.map(count=>[count.sectionId,count._count._all])));
  }

  async list(actor:Identity,organizationId:string,schoolId:string,query:{search:string;cursor:string|null;limit:number;status:"ACTIVE"|"ARCHIVED"|"ALL"}):Promise<StudentWorkspace>{try{return await this.db.$transaction(async tx=>{
    await this.guard(tx,actor,organizationId,schoolId,"student.read",false);
    if(this.cursorSecret.length<32) throw new AccessError("UNAVAILABLE");
    const searchHash=sha(query.search),scope={organizationId,schoolId,accountId:actor.accountId,searchHash,status:query.status},after=decodeCursor(query.cursor,scope,this.cursorSecret);
    const where:Prisma.StudentWhereInput={organizationId,schoolId,...(query.status!=="ALL"?{status:query.status}:{}),...(after?{id:{gt:after}}:{}),...(query.search?{OR:[{admissionNumber:{contains:query.search,mode:"insensitive"}},{person:{firstName:{contains:query.search,mode:"insensitive"}}},{person:{lastName:{contains:query.search,mode:"insensitive"}}}]}:{})};
    const rows=await tx.student.findMany({where,orderBy:{id:"asc"},take:query.limit+1,include:{person:{select:{firstName:true,lastName:true}}}}),hasMore=rows.length>query.limit,items=rows.slice(0,query.limit),academicActive=await this.moduleActive(tx,organizationId,schoolId,"academic_core"),enrollments=academicActive&&items.length?await tx.enrollment.findMany({where:{organizationId,schoolId,studentId:{in:items.map(item=>item.id)}},orderBy:{validFrom:"desc"},include:{year:{select:{code:true,name:true}}}}):[],latest=new Map<string,typeof enrollments[number]>();for(const enrollment of enrollments)if(!latest.has(enrollment.studentId))latest.set(enrollment.studentId,enrollment);
    const nextCursor=hasMore&&items.length?encodeCursor({...scope,after:items.at(-1)!.id},this.cursorSecret):null;
    return {items:items.map(item=>profile({...item,enrollments:latest.has(item.id)?[latest.get(item.id)!]:[]})),nextCursor};
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

  async get(actor:Identity,organizationId:string,schoolId:string,studentId:string):Promise<StudentDetail>{try{return await this.db.$transaction(async tx=>{
    const guard=await this.guard(tx,actor,organizationId,schoolId,"student.read",false);
    const row=await tx.student.findFirst({where:{id:studentId,organizationId,schoolId},include:{person:{select:{firstName:true,lastName:true}}}});
    if(!row) throw new AccessError("NOT_FOUND");
    if(!await this.moduleActive(tx,organizationId,schoolId,"academic_core"))return {...profile(row),history:[]};
    const enrollments=await tx.enrollment.findMany({where:{organizationId,schoolId,studentId},orderBy:{validFrom:"desc"},include:{year:{select:{code:true,name:true}},placements:{where:{organizationId,schoolId},orderBy:{validFrom:"asc"},include:{section:{select:{code:true,name:true,grade:{select:{name:true}}}}}}}}),today=schoolToday(this.now(),guard.timezone),todayDate=new Date(`${today}T00:00:00.000Z`),counts=await tx.sectionPlacement.groupBy({by:["sectionId"],where:{organizationId,schoolId,validFrom:{lte:todayDate},validTo:{gt:todayDate},enrollment:{is:{year:{is:{status:"OPEN"}}}}},_count:{_all:true}}),rosterCounts=new Map(counts.map(count=>[count.sectionId,count._count._all]));
    return {...profile({...row,enrollments}),history:enrollmentHistory(enrollments,rosterCounts)};
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

  async findExistingPeople(actor:Identity,organizationId:string,schoolId:string,exactName:string):Promise<readonly ExistingPersonChoice[]>{try{return await this.db.$transaction(async tx=>{
    await this.guard(tx,actor,organizationId,schoolId,"student.manage",false);
    return (await this.people.findExactName(tx,organizationId,exactName)).map(person=>({personId:person.id,displayName:displayStudentName(person.firstName,person.lastName)}));
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

  async enrollmentOptions(actor:Identity,organizationId:string,schoolId:string,studentId:string):Promise<EnrollmentOptions>{try{return await this.db.$transaction(async tx=>{
    const guard=await this.guard(tx,actor,organizationId,schoolId,"student.manage",false,["student_core","academic_core"]),student=await tx.student.findFirst({where:{id:studentId,organizationId,schoolId},select:{id:true,status:true,enrollments:{select:{yearId:true}}}});if(!student)throw new AccessError("NOT_FOUND");if(student.status!=="ACTIVE")throw new AccessError("CONFLICT");
    const years=await tx.academicYear.findMany({where:{organizationId,schoolId,status:"OPEN"},orderBy:{startsOn:"desc"},include:{sections:{where:{organizationId,schoolId,active:true},orderBy:[{grade:{sortOrder:"asc"}},{code:"asc"}],include:{grade:{select:{name:true}}}}}});
    return {today:schoolToday(this.now(),guard.timezone),enrolledYearIds:student.enrollments.map(enrollment=>enrollment.yearId),years:years.filter(year=>year.sections.length>0).map(year=>({yearId:year.id,code:year.code,name:year.name,startsOn:civilDate(year.startsOn),endsOn:civilDate(year.endsOn),sections:year.sections.map(section=>({sectionId:section.id,code:section.code,name:section.name,gradeName:section.grade.name}))}))};
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

  async listForSession(transaction:object,actor:Identity,organizationId:string,schoolId:string,sectionId:string,schoolDate:string):Promise<readonly StudentAttendanceRosterEntry[]>{
    if(!transaction||typeof transaction!=='object')throw new AccessError('UNAVAILABLE');const tx=transaction as Prisma.TransactionClient;
    try{
      await this.guard(tx,actor,organizationId,schoolId,'student.read',false,['student_core','academic_core']);
      const rows=await tx.$queryRaw<StudentAttendanceRosterEntry[]>`WITH current_placements AS MATERIALIZED (
        SELECT organization_id,school_id,enrollment_id,year_id,section_id,roll_number
        FROM vs_students_section_placement
        WHERE organization_id=${organizationId}::uuid AND school_id=${schoolId}::uuid AND section_id=${sectionId}::uuid AND valid_from<=${schoolDate}::date AND valid_to>${schoolDate}::date
      )
        SELECT st.id::text AS "studentId", st.version AS "studentVersion", e.version AS "enrollmentVersion", btrim(concat_ws(' ', p.first_name, p.last_name)) AS "displayName", pl.roll_number AS "rollNumber"
        FROM current_placements pl
        JOIN vs_students_enrollment e ON e.organization_id=pl.organization_id AND e.school_id=pl.school_id AND e.id=pl.enrollment_id AND e.year_id=pl.year_id
        JOIN vs_students_student st ON st.organization_id=e.organization_id AND st.school_id=e.school_id AND st.id=e.student_id
        JOIN vs_people_person p ON p.organization_id=st.organization_id AND p.id=st.person_id
        JOIN vs_academics_section sec ON sec.organization_id=pl.organization_id AND sec.school_id=pl.school_id AND sec.id=pl.section_id AND sec.year_id=pl.year_id
        JOIN vs_academics_academic_year y ON y.organization_id=e.organization_id AND y.school_id=e.school_id AND y.id=e.year_id
        WHERE y.status='OPEN' AND sec.active=true AND st.status='ACTIVE' AND e.valid_from<=${schoolDate}::date AND e.valid_to>${schoolDate}::date
        ORDER BY st.id LIMIT 201`;
      if(rows.length>200)throw new AccessError('ROSTER_TOO_LARGE');if(rows.length===0)throw new AccessError('EMPTY_ROSTER');const seen=new Set<string>();for(const row of rows){if(seen.has(row.studentId))throw new AccessError('CONFLICT');seen.add(row.studentId);}return rows;
    }catch(error){return fail(error);}
  }

  async enroll(actor:Identity,organizationId:string,schoolId:string,input:{studentId:string;yearId:string;sectionId:string;validFrom:string;validTo:string;rollNumber:string|null;key:string}):Promise<EnrollmentResult>{try{return await this.db.$transaction(async tx=>{
    const guard=await this.guard(tx,actor,organizationId,schoolId,"student.manage",true,["student_core","academic_core"]),command="StudentEnrolled",hash=inputHash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,...input});
    const prior=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key}}});
    if(prior){if(prior.inputHash!==hash)throw new AccessError("IDEMPOTENCY_CONFLICT");const id=(prior.response as {enrollmentId?:unknown}).enrollmentId;if(typeof id!=="string")throw new AccessError("UNAVAILABLE");const row=await tx.enrollment.findFirst({where:{id,organizationId,schoolId},include:{year:{select:{code:true,name:true}},placements:{where:{organizationId,schoolId},orderBy:{validFrom:"asc"},take:1,include:{section:{select:{code:true,name:true,grade:{select:{name:true}}}}}}}});if(!row)throw new AccessError("NOT_FOUND");const today=schoolToday(this.now(),guard.timezone),active=row.placements[0]?.validFrom<=new Date(`${today}T00:00:00.000Z`)&&row.placements[0]?.validTo>new Date(`${today}T00:00:00.000Z`);const count=active?await tx.sectionPlacement.count({where:{organizationId,schoolId,sectionId:row.placements[0]!.sectionId,validFrom:{lte:new Date(`${today}T00:00:00.000Z`)},validTo:{gt:new Date(`${today}T00:00:00.000Z`)},enrollment:{is:{year:{is:{status:"OPEN"}}}}}}):0;return enrollmentResult(row,true,count);}
    const student=await tx.student.findFirst({where:{id:input.studentId,organizationId,schoolId},select:{id:true,status:true}});if(!student)throw new AccessError("NOT_FOUND");if(student.status!=="ACTIVE")throw new AccessError("CONFLICT");
    const year=await tx.academicYear.findFirst({where:{id:input.yearId,organizationId,schoolId},select:{id:true,code:true,name:true,startsOn:true,endsOn:true,status:true}});if(!year)throw new AccessError("NOT_FOUND");if(year.status!=="OPEN")throw new AccessError("CONFLICT");
    const section=await tx.section.findFirst({where:{id:input.sectionId,organizationId,schoolId},select:{id:true,yearId:true,active:true}});if(!section)throw new AccessError("NOT_FOUND");if(section.yearId!==year.id)throw new AccessError("VALIDATION");if(!section.active)throw new AccessError("CONFLICT");
    if(input.validFrom>=input.validTo||input.validFrom<civilDate(year.startsOn)||input.validTo>civilDate(year.endsOn))throw new AccessError("VALIDATION");
    if(await tx.enrollment.findFirst({where:{organizationId,schoolId,studentId:student.id,yearId:year.id},select:{id:true}}))throw new AccessError("CONFLICT");
    const now=this.now(),enrollmentId=randomUUID(),placementId=randomUUID(),validFrom=new Date(`${input.validFrom}T00:00:00.000Z`),validTo=new Date(`${input.validTo}T00:00:00.000Z`);
    await tx.enrollment.create({data:{id:enrollmentId,organizationId,schoolId,studentId:student.id,yearId:year.id,validFrom,validTo,version:1}});
    await tx.sectionPlacement.create({data:{id:placementId,organizationId,schoolId,enrollmentId,yearId:year.id,sectionId:section.id,validFrom,validTo,rollNumber:input.rollNumber}});
    const next=guard.configurationVersion+1,changed=await tx.school.updateMany({where:{organizationId,id:schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:next,version:{increment:1}}});if(changed.count!==1)throw new AccessError("STALE_VERSION");
    const row=await tx.enrollment.findFirst({where:{id:enrollmentId,organizationId,schoolId},include:{year:{select:{code:true,name:true}},placements:{where:{id:placementId,organizationId,schoolId},include:{section:{select:{code:true,name:true,grade:{select:{name:true}}}}}}}});if(!row)throw new AccessError("UNAVAILABLE");
    const today=schoolToday(now,guard.timezone),todayDate=new Date(`${today}T00:00:00.000Z`),active=validFrom<=todayDate&&validTo>todayDate,count=active?await tx.sectionPlacement.count({where:{organizationId,schoolId,sectionId:section.id,validFrom:{lte:todayDate},validTo:{gt:todayDate},enrollment:{is:{year:{is:{status:"OPEN"}}}}}}):0,result=enrollmentResult(row,false,count),occurredAt=now.toISOString(),safeReceipt={enrollmentId,studentId:student.id,yearId:year.id,placementId,version:1,status:"ENROLLED"};
    await this.evidence(tx).append({organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash:hash,response:{...safeReceipt,resourceId:enrollmentId},before:{},after:{version:1,status:"ACTIVE"},reason:"Student enrollment",requestId:randomUUID(),occurredAt,resourceType:"Enrollment",module:"students"});
    return result;
  },{isolationLevel:"Serializable",timeout:15000,maxWait:10000});}catch(error){return fail(error);}}

  async create(actor:Identity,organizationId:string,schoolId:string,input:StudentInput&{key:string}):Promise<StudentProfile&{replayed:boolean}>{try{return await this.db.$transaction(async tx=>{
    const guard=await this.guard(tx,actor,organizationId,schoolId,"student.manage",true),command="StudentRegistered",hash=inputHash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,...input});
    const prior=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key}}});
    if(prior){if(prior.inputHash!==hash)throw new AccessError("IDEMPOTENCY_CONFLICT");const id=(prior.response as {studentId?:unknown}).studentId;if(typeof id!=="string")throw new AccessError("UNAVAILABLE");const row=await tx.student.findFirst({where:{id,organizationId,schoolId},include:{person:{select:{firstName:true,lastName:true}}}});if(!row)throw new AccessError("NOT_FOUND");return {...profile(row),replayed:true};}
    if(await tx.student.findFirst({where:{organizationId,schoolId,admissionNumber:input.admissionNumber},select:{id:true}}))throw new AccessError("CONFLICT");
    const person=input.existingPersonId?await this.people.findById(tx,organizationId,input.existingPersonId):await this.people.create(tx,{organizationId,firstName:input.firstName,lastName:input.lastName});
    if(!person)throw new AccessError("NOT_FOUND");
    if(await tx.student.findFirst({where:{organizationId,schoolId,personId:person.id},select:{id:true}}))throw new AccessError("CONFLICT");
    const now=this.now(),id=randomUUID();
    const row=await tx.student.create({data:{id,organizationId,schoolId,personId:person.id,admissionNumber:input.admissionNumber,status:"ACTIVE",version:1,createdAt:now},include:{person:{select:{firstName:true,lastName:true}}}});
    const result=profile(row),safeReceipt={studentId:id,version:1,status:"ACTIVE"},next=guard.configurationVersion+1,changed=await tx.school.updateMany({where:{organizationId,id:schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:next,version:{increment:1}}});
    if(changed.count!==1)throw new AccessError("STALE_VERSION");
    const occurredAt=now.toISOString(),requestId=randomUUID();
    await this.evidence(tx).append({organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash:hash,response:{...safeReceipt,resourceId:id},before:{},after:{version:1,status:"ACTIVE"},reason:"Student registration",requestId,occurredAt:occurredAt,resourceType:"Student",module:"students"});
    return {...result,replayed:false};
  },{isolationLevel:"Serializable",timeout:15000,maxWait:10000});}catch(error){return fail(error);}}

  async transfer(actor:Identity,organizationId:string,schoolId:string,enrollmentId:string,input:{expectedVersion:number;toSectionId:string;effectiveDate:string;rollNumber?:string;reason:string;key:string}):Promise<StudentTransferResult>{try{return await this.db.$transaction(async tx=>{
    const guard=await this.guard(tx,actor,organizationId,schoolId,"student.manage",true,["student_core","academic_core"]),command="StudentPlacementTransferred",hash=inputHash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,enrollmentId,...input}),scope={organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key};
    const prior=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:scope}});
    if(prior){if(prior.inputHash!==hash)throw new AccessError("IDEMPOTENCY_CONFLICT");const id=(prior.response as {enrollmentId?:unknown}).enrollmentId;if(typeof id!=="string")throw new AccessError("UNAVAILABLE");const enrollment=await tx.enrollment.findFirst({where:{id,organizationId,schoolId},select:{version:true,studentId:true,yearId:true}});if(!enrollment)throw new AccessError("NOT_FOUND");return {enrollmentId:id,version:enrollment.version,studentId:enrollment.studentId,yearId:enrollment.yearId,history:await this.enrollmentTimeline(tx,organizationId,schoolId,id,schoolToday(this.now(),guard.timezone)),replayed:true};}
    const enrollment=await tx.enrollment.findFirst({where:{id:enrollmentId,organizationId,schoolId},include:{student:{select:{id:true,status:true}},year:{select:{id:true,code:true,name:true,startsOn:true,endsOn:true,status:true}},placements:{where:{organizationId,schoolId},orderBy:{validFrom:"asc"}}}});
    if(!enrollment)throw new AccessError("NOT_FOUND");if(enrollment.student.status!=="ACTIVE"||enrollment.year.status!=="OPEN")throw new AccessError("CONFLICT");if(enrollment.version!==input.expectedVersion)throw new AccessError("STALE_VERSION");
    const today=schoolToday(this.now(),guard.timezone),todayDate=new Date(`${today}T00:00:00.000Z`),old=enrollment.placements.find(p=>p.validFrom<=todayDate&&p.validTo>todayDate);
    if(!old)throw new AccessError("CONFLICT");const oldStart=civilDate(old.validFrom),oldEnd=civilDate(old.validTo);if(input.effectiveDate<today||input.effectiveDate<=oldStart||input.effectiveDate>=oldEnd||input.effectiveDate<civilDate(enrollment.year.startsOn)||input.effectiveDate>=civilDate(enrollment.year.endsOn))throw new AccessError("VALIDATION");
    if(enrollment.placements.some(p=>p.validFrom>todayDate))throw new AccessError("CONFLICT");
    const ordered=enrollment.placements;for(let index=1;index<ordered.length;index++)if(ordered[index-1]!.validTo>ordered[index]!.validFrom)throw new AccessError("CONFLICT");
    const destination=await tx.section.findFirst({where:{id:input.toSectionId,organizationId,schoolId,yearId:enrollment.yearId},select:{id:true,active:true}});if(!destination)throw new AccessError("NOT_FOUND");if(!destination.active)throw new AccessError("CONFLICT");if(destination.id===old.sectionId)throw new AccessError("CONFLICT");
    if(await this.attendanceImpact.hasFrozenSessions(tx,{organizationId,schoolId,sectionIds:[old.sectionId,destination.id],fromDate:input.effectiveDate,toDate:oldEnd}))throw new AccessError("ROSTER_IN_USE");
    const changed=await tx.sectionPlacement.updateMany({where:{id:old.id,organizationId,schoolId,enrollmentId:enrollment.id,validTo:old.validTo},data:{validTo:new Date(`${input.effectiveDate}T00:00:00.000Z`)}});if(changed.count!==1)throw new AccessError("STALE_VERSION");
    await tx.sectionPlacement.create({data:{id:randomUUID(),organizationId,schoolId,enrollmentId:enrollment.id,yearId:enrollment.yearId,sectionId:destination.id,validFrom:new Date(`${input.effectiveDate}T00:00:00.000Z`),validTo:old.validTo,rollNumber:input.rollNumber===undefined?old.rollNumber:input.rollNumber}});
    const nextVersion=enrollment.version+1,updated=await tx.enrollment.updateMany({where:{id:enrollment.id,organizationId,schoolId,version:input.expectedVersion},data:{version:nextVersion}});if(updated.count!==1)throw new AccessError("STALE_VERSION");
    const schoolUpdated=await tx.school.updateMany({where:{organizationId,id:schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:{increment:1},version:{increment:1}}});if(schoolUpdated.count!==1)throw new AccessError("STALE_VERSION");
    const occurredAt=this.now().toISOString(),response={enrollmentId:enrollment.id,studentId:enrollment.studentId,yearId:enrollment.yearId,version:nextVersion,status:"TRANSFERRED"};
    await this.evidence(tx).append({organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash:hash,response:{...response,resourceId:enrollment.id},before:{sectionId:old.sectionId,validFrom:oldStart,validTo:oldEnd,version:enrollment.version},after:{sectionId:destination.id,validFrom:input.effectiveDate,validTo:oldEnd,version:nextVersion},reason:input.reason,requestId:randomUUID(),occurredAt,resourceType:"Enrollment",module:"students"});
    return {enrollmentId:enrollment.id,version:nextVersion,studentId:enrollment.studentId,yearId:enrollment.yearId,history:await this.enrollmentTimeline(tx,organizationId,schoolId,enrollment.id,today),replayed:false};
  },{isolationLevel:"ReadCommitted",timeout:15000,maxWait:10000});}catch(error){return fail(error);}}

  async archive(actor:Identity,organizationId:string,schoolId:string,studentId:string,input:{expectedVersion:number;reason:string;key:string}):Promise<StudentArchiveResult>{try{return await this.db.$transaction(async tx=>{
    const guard=await this.guard(tx,actor,organizationId,schoolId,"student.manage",true,["student_core","academic_core"]),command="StudentArchived",hash=inputHash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,studentId,...input}),scope={organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key};
    const prior=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:scope}});
    if(prior){if(prior.inputHash!==hash)throw new AccessError("IDEMPOTENCY_CONFLICT");const response=prior.response as {studentId?:unknown;version?:unknown;status?:unknown};if(response.studentId!==studentId||typeof response.version!=="number"||response.status!=="ARCHIVED")throw new AccessError("UNAVAILABLE");return {studentId,version:response.version,status:"ARCHIVED",replayed:true};}
    const student=await tx.student.findFirst({where:{id:studentId,organizationId,schoolId},select:{id:true,status:true,version:true}});if(!student)throw new AccessError("NOT_FOUND");if(student.status!=="ACTIVE")throw new AccessError("CONFLICT");if(student.version!==input.expectedVersion)throw new AccessError("STALE_VERSION");
    const today=schoolToday(this.now(),guard.timezone),todayDate=new Date(`${today}T00:00:00.000Z`),[futureEnrollment,futurePlacement]=await Promise.all([tx.enrollment.findFirst({where:{organizationId,schoolId,studentId,validTo:{gt:todayDate}},select:{id:true}}),tx.sectionPlacement.findFirst({where:{organizationId,schoolId,enrollment:{is:{studentId}},validTo:{gt:todayDate}},select:{id:true}})]);if(futureEnrollment||futurePlacement)throw new AccessError("STUDENT_IN_USE");
    const version=student.version+1,changed=await tx.student.updateMany({where:{id:student.id,organizationId,schoolId,status:"ACTIVE",version:input.expectedVersion},data:{status:"ARCHIVED",version}});if(changed.count!==1)throw new AccessError("STALE_VERSION");
    const schoolUpdated=await tx.school.updateMany({where:{organizationId,id:schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:{increment:1},version:{increment:1}}});if(schoolUpdated.count!==1)throw new AccessError("STALE_VERSION");
    const occurredAt=this.now().toISOString(),response={studentId,version,status:"ARCHIVED" as const};await this.evidence(tx).append({organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash:hash,response:{...response,resourceId:studentId},before:{status:"ACTIVE",version:student.version},after:{status:"ARCHIVED",version},reason:input.reason,requestId:randomUUID(),occurredAt,resourceType:"Student",module:"students"});return {...response,replayed:false};
  },{isolationLevel:"Serializable",timeout:15000,maxWait:10000});}catch(error){return fail(error);}}

  async registerAndEnroll(transaction:StudentRegistrationTransaction,actor:Identity,input:EnlistedRegistrationInput):Promise<EnlistedRegistrationResult>{
    const tx=transaction as Prisma.TransactionClient;
    try {
      const guard=await this.guard(tx,actor,input.organizationId,input.schoolId,"student.manage",false,["student_core","academic_core"]);
      const command="ImportedStudentRegistered",hash=inputHash({schemaVersion:1,actorAccountId:actor.accountId,...input});
      const prior=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{organizationId:input.organizationId,schoolId:input.schoolId,actorAccountId:actor.accountId,command,key:input.key}}});
      if(prior){if(prior.inputHash!==hash)throw new AccessError("IDEMPOTENCY_CONFLICT");const value=prior.response as {studentId?:unknown;enrollmentId?:unknown};if(typeof value.studentId!=="string"||typeof value.enrollmentId!=="string")throw new AccessError("UNAVAILABLE");return {studentId:value.studentId,enrollmentId:value.enrollmentId,replayed:true};}
      const year=await tx.academicYear.findFirst({where:{id:input.yearId,organizationId:input.organizationId,schoolId:input.schoolId,status:"OPEN"},select:{id:true,startsOn:true,endsOn:true}});if(!year)throw new AccessError("CONFLICT");
      const section=await tx.section.findFirst({where:{id:input.sectionId,organizationId:input.organizationId,schoolId:input.schoolId,yearId:year.id,active:true},select:{id:true,gradeId:true,campusId:true}});if(!section)throw new AccessError("CONFLICT");
      const validFrom=new Date(`${input.validFrom}T00:00:00.000Z`),validTo=new Date(`${input.validTo}T00:00:00.000Z`);if(validFrom>=validTo||validFrom<year.startsOn||validTo>year.endsOn)throw new AccessError("CONFLICT");
      if(await tx.student.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,admissionNumber:input.admissionNumber},select:{id:true}}))throw new AccessError("CONFLICT");
      const person=input.existingPersonId?await this.people.findById(tx,input.organizationId,input.existingPersonId):await this.people.create(tx,{organizationId:input.organizationId,firstName:input.firstName,lastName:input.lastName});if(!person)throw new AccessError("NOT_FOUND");
      if(await tx.student.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,personId:person.id},select:{id:true}}))throw new AccessError("CONFLICT");
      const now=this.now(),studentId=randomUUID(),enrollmentId=randomUUID(),placementId=randomUUID();
      await tx.student.create({data:{id:studentId,organizationId:input.organizationId,schoolId:input.schoolId,personId:person.id,admissionNumber:input.admissionNumber,status:"ACTIVE",version:1,createdAt:now}});
      await tx.enrollment.create({data:{id:enrollmentId,organizationId:input.organizationId,schoolId:input.schoolId,studentId,yearId:year.id,validFrom,validTo,version:1}});
      await tx.sectionPlacement.create({data:{id:placementId,organizationId:input.organizationId,schoolId:input.schoolId,enrollmentId,yearId:year.id,sectionId:section.id,validFrom,validTo,rollNumber:input.rollNumber}});
      const changed=await tx.school.updateMany({where:{organizationId:input.organizationId,id:input.schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:{increment:1},version:{increment:1}}});if(changed.count!==1)throw new AccessError("STALE_VERSION");
      const occurredAt=now.toISOString(),response={studentId,enrollmentId,placementId,resourceId:studentId,version:1,status:"ENROLLED"};
      await this.evidence(tx).append({organizationId:input.organizationId,schoolId:input.schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash:hash,response,before:{},after:{status:"ACTIVE",enrollment:"ENROLLED"},reason:"Imported student registration",requestId:randomUUID(),occurredAt,resourceType:"Student",module:"students"});
      return {studentId,enrollmentId,replayed:false};
    } catch(error) { return fail(error); }
  }
}
