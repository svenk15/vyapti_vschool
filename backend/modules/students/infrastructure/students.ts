import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import type { Identity } from "../../../../shared/contracts/access";
import type { ExistingPersonChoice, StudentDetail, StudentProfile, StudentWorkspace } from "../../../../shared/contracts/students";
import { AccessError, capabilitiesFor } from "../../access/contracts/index";
import type { PersonIdentityPort } from "../../people/contracts/person-identity";
import type { CommandEvidenceWriter } from "../../platform/contracts/command-evidence";
import type { ReleaseManifest } from "../../tenancy/contracts/index";
import type { StudentRepository } from "../application/students";
import type { StudentInput } from "../domain/student";
import { displayStudentName } from "../domain/student";

type Guard = { configurationVersion: number };
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
function profile(row: {id:string;personId:string;version:number;admissionNumber:string;status:string;person:{firstName:string;lastName:string}}): StudentProfile {
  return { studentId:row.id,personId:row.personId,version:row.version,admissionNumber:row.admissionNumber,displayName:displayStudentName(row.person.firstName,row.person.lastName),status:row.status as "ACTIVE"|"ARCHIVED",enrollment:null };
}
function fail(error: unknown): never {
  if (error instanceof AccessError) throw error;
  const value=error as {code?:string;meta?:{driverAdapterError?:{cause?:{kind?:string}}}};
  if (value.code === "P2002") throw new AccessError("CONFLICT");
  if (value.code === "P2003" || value.code === "P2025") throw new AccessError("NOT_FOUND");
  if (["P2034","40001","40P01"].includes(value.code??"") || value.code === "P2010" && value.meta?.driverAdapterError?.cause?.kind === "TransactionWriteConflict") throw new AccessError("STALE_VERSION");
  throw new AccessError("UNAVAILABLE");
}

export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly db:PrismaClient,private readonly evidence:(tx:Prisma.TransactionClient)=>CommandEvidenceWriter,private readonly people:PersonIdentityPort,private readonly now:()=>Date=()=>new Date(),private readonly cursorSecret="",private readonly manifest:ReleaseManifest=NO_RELEASE){}

  private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string,permission:"student.manage"|"student.read",lock:boolean):Promise<Guard>{
    if(lock) await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`;
    const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});
    if(!account||account.status!=="ACTIVE"||account.tokenVersion!==actor.tokenVersion) throw new AccessError("UNAUTHENTICATED");
    if(lock) await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR SHARE`;
    const organization=await tx.organization.findFirst({where:{id:organizationId,status:"ACTIVE"},select:{id:true}});
    if(!organization) throw new AccessError("NOT_FOUND");
    if(lock) await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${organizationId}::uuid AND id=${schoolId}::uuid FOR UPDATE`;
    const school=await tx.school.findFirst({where:{organizationId,id:schoolId,status:"ACTIVE"},select:{configurationVersion:true}});
    if(!school) throw new AccessError("NOT_FOUND");
    const membership=await tx.schoolMembership.findFirst({where:{accountId:actor.accountId,organizationId,schoolId,status:"ACTIVE"},select:{grants:{select:{code:true}}}});
    if(!membership||!capabilitiesFor(membership.grants.map(grant=>grant.code as "SCHOOL_ADMIN"|"TEACHER")).includes(permission)) throw new AccessError("FORBIDDEN");
    if(!this.manifest.student_core) throw new AccessError("RELEASE_UNAVAILABLE");
    const now=this.now(),entitlement=await tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId:"student_core"}}}),activation=await tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId:"student_core"}}});
    if(!entitlement||entitlement.state!=="ACTIVE"||entitlement.startsAt>now||(entitlement.endsAt!==null&&entitlement.endsAt<=now)) throw new AccessError("MODULE_NOT_LICENSED");
    if(!activation||activation.state!=="ACTIVE") throw new AccessError("MODULE_DISABLED");
    return {configurationVersion:school.configurationVersion};
  }

  async list(actor:Identity,organizationId:string,schoolId:string,query:{search:string;cursor:string|null;limit:number;status:"ACTIVE"|"ARCHIVED"|"ALL"}):Promise<StudentWorkspace>{try{return await this.db.$transaction(async tx=>{
    await this.guard(tx,actor,organizationId,schoolId,"student.read",false);
    if(this.cursorSecret.length<32) throw new AccessError("UNAVAILABLE");
    const searchHash=sha(query.search),scope={organizationId,schoolId,accountId:actor.accountId,searchHash,status:query.status},after=decodeCursor(query.cursor,scope,this.cursorSecret);
    const where:Prisma.StudentWhereInput={organizationId,schoolId,...(query.status!=="ALL"?{status:query.status}:{}),...(after?{id:{gt:after}}:{}),...(query.search?{OR:[{admissionNumber:{contains:query.search,mode:"insensitive"}},{person:{firstName:{contains:query.search,mode:"insensitive"}}},{person:{lastName:{contains:query.search,mode:"insensitive"}}}]}:{})};
    const rows=await tx.student.findMany({where,orderBy:{id:"asc"},take:query.limit+1,include:{person:{select:{firstName:true,lastName:true}}}}),hasMore=rows.length>query.limit,items=rows.slice(0,query.limit);
    const nextCursor=hasMore&&items.length?encodeCursor({...scope,after:items.at(-1)!.id},this.cursorSecret):null;
    return {items:items.map(profile),nextCursor};
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

  async get(actor:Identity,organizationId:string,schoolId:string,studentId:string):Promise<StudentDetail>{try{return await this.db.$transaction(async tx=>{
    await this.guard(tx,actor,organizationId,schoolId,"student.read",false);
    const row=await tx.student.findFirst({where:{id:studentId,organizationId,schoolId},include:{person:{select:{firstName:true,lastName:true}}}});
    if(!row) throw new AccessError("NOT_FOUND");
    return {...profile(row),history:[]};
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

  async findExistingPeople(actor:Identity,organizationId:string,schoolId:string,exactName:string):Promise<readonly ExistingPersonChoice[]>{try{return await this.db.$transaction(async tx=>{
    await this.guard(tx,actor,organizationId,schoolId,"student.manage",false);
    return (await this.people.findExactName(tx,organizationId,exactName)).map(person=>({personId:person.id,displayName:displayStudentName(person.firstName,person.lastName)}));
  },{isolationLevel:"RepeatableRead",timeout:10000,maxWait:10000});}catch(error){return fail(error);}}

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
}
