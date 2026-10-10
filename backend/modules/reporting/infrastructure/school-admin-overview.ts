import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {ModuleId} from '../../../../shared/contracts/modules';
import type {SchoolAdminException,SchoolAdminOverview,SchoolReadinessItem} from '../../../../shared/contracts/reporting';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest} from '../../tenancy/contracts/index';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';
import type {SchoolAdminOverviewRepository} from '../application/school-admin-overview';
import {responsibleRoleForSetup} from '../domain/setup-responsibility';

type Scope={organizationId:string;schoolId:string};
const localDate=(instant:Date,timezone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(instant);

export class PrismaSchoolAdminOverviewRepository implements SchoolAdminOverviewRepository {
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly now:()=>Date=()=>new Date(),private readonly databaseContext?:VerifiedDatabaseContextPort){}

 private async authorize(tx:Prisma.TransactionClient,actor:Identity,scope:Scope){
  if(!this.databaseContext)throw new AccessError('UNAVAILABLE');
  await this.databaseContext.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:scope.organizationId,branchId:scope.schoolId});
  const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  const [organization,school,membership]=await Promise.all([
   tx.organization.findFirst({where:{id:scope.organizationId,status:'ACTIVE'},select:{id:true}}),
   tx.school.findFirst({where:{organizationId:scope.organizationId,id:scope.schoolId,status:'ACTIVE'},select:{timezone:true}}),
   tx.schoolMembership.findFirst({where:{...scope,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}}),
  ]);
  if(!organization||!school)throw new AccessError('NOT_FOUND');
  const capabilities=membership?capabilitiesFor(membership.grants.map(grant=>grant.code as 'SCHOOL_ADMIN'|'TEACHER')):[];
  if(!membership||!capabilities.includes('school.manage'))throw new AccessError('FORBIDDEN');
  return school.timezone;
 }

 async get(actor:Identity,organizationId:string,schoolId:string):Promise<SchoolAdminOverview>{
  try{return await this.db.$transaction(async tx=>{
   const scope={organizationId,schoolId},timezone=await this.authorize(tx,actor,scope),asOf=this.now(),today=localDate(asOf,timezone);
   const [entitlements,activations,campusCount]=await Promise.all([
    tx.organizationEntitlement.findMany({where:{organizationId},select:{moduleId:true,state:true,startsAt:true,endsAt:true}}),
    tx.branchActivation.findMany({where:{organizationId,schoolId},select:{moduleId:true,state:true}}),
    tx.campus.count({where:{...scope,status:'ACTIVE'}}),
   ]);
   const entitlementById=new Map(entitlements.map(row=>[row.moduleId,row])),activationById=new Map(activations.map(row=>[row.moduleId,row]));
   const effective=(moduleId:ModuleId)=>{const entitlement=entitlementById.get(moduleId),activation=activationById.get(moduleId);return this.manifest[moduleId]&&entitlement?.state==='ACTIVE'&&entitlement.startsAt<=asOf&&(entitlement.endsAt===null||entitlement.endsAt>asOf)&&activation?.state==='ACTIVE';};
   const readiness:SchoolReadinessItem[]=[{id:'school',label:'School information',complete:campusCount>0,count:campusCount,detail:campusCount?`${campusCount} active campus${campusCount===1?'':'es'} configured`:'Add an active campus to finish school information',href:'/admin/school',responsibleRole:responsibleRoleForSetup('school')}];
   if(effective('academic_core')){
    const [yearCount,gradeCount,subjectCount,sectionCount]=await Promise.all([
     tx.academicYear.count({where:{...scope,status:{in:['DRAFT','OPEN']},calendar:{currentRevisionId:{not:null}}}}),
     tx.gradeLevel.count({where:{...scope,active:true}}),tx.subject.count({where:{...scope,active:true}}),tx.section.count({where:{...scope,active:true}}),
    ]),complete=yearCount>0&&gradeCount>0&&subjectCount>0&&sectionCount>0;
    readiness.push({id:'academics',label:'Academic structure',complete,count:gradeCount+sectionCount+subjectCount,detail:complete?`${sectionCount} active section${sectionCount===1?'':'s'} with a published calendar`:'Add a published calendar, grade, section and subject',href:'/admin/academics',responsibleRole:responsibleRoleForSetup('academics')});
   }
   if(effective('staff_core')){
    const [employees,assignments]=await Promise.all([tx.employee.count({where:{...scope,status:'ACTIVE'}}),tx.teacherAssignment.count({where:{...scope,validFrom:{lte:new Date(`${today}T00:00:00.000Z`)},validTo:{gt:new Date(`${today}T00:00:00.000Z`)}}})]),complete=employees>0&&assignments>0;
    readiness.push({id:'staff',label:'Staff and teaching assignments',complete,count:employees,detail:complete?`${employees} active staff profile${employees===1?'':'s'}; ${assignments} current assignment${assignments===1?'':'s'}`:'Add active staff and at least one current teaching assignment',href:'/admin/teachers',responsibleRole:responsibleRoleForSetup('staff')});
   }
   if(effective('student_core')){
    const [row]=await tx.$queryRaw<{students:number}[]>`SELECT COUNT(DISTINCT st.id)::int AS students FROM vs_students_student st JOIN vs_students_enrollment e ON e.organization_id=st.organization_id AND e.school_id=st.school_id AND e.student_id=st.id JOIN vs_students_section_placement p ON p.organization_id=e.organization_id AND p.school_id=e.school_id AND p.enrollment_id=e.id AND p.year_id=e.year_id WHERE st.organization_id=${organizationId}::uuid AND st.school_id=${schoolId}::uuid AND st.status='ACTIVE' AND e.valid_from<=${today}::date AND e.valid_to>${today}::date AND p.valid_from<=${today}::date AND p.valid_to>${today}::date`;
    const students=row?.students??0;readiness.push({id:'students',label:'Students and enrollment',complete:students>0,count:students,detail:students?`${students} currently enrolled student${students===1?'':'s'}`:'Register and enroll a student in a current section',href:'/admin/students',responsibleRole:responsibleRoleForSetup('students')});
   }
   if(effective('attendance')){const sessions=await tx.attendanceSession.count({where:scope});readiness.push({id:'attendance',label:'Attendance sessions',complete:sessions>0,count:sessions,detail:sessions?`${sessions} scheduled session${sessions===1?'':'s'}`:'Schedule the first attendance session',href:'/admin/attendance/sessions',responsibleRole:responsibleRoleForSetup('attendance')});}
   const exceptions:SchoolAdminException[]=[];
   if(effective('attendance')){const count=await tx.attendanceSession.count({where:{...scope,schoolDate:new Date(`${today}T00:00:00.000Z`),startsAt:{lte:asOf},status:{in:['SCHEDULED','OPEN']}}});if(count)exceptions.push({id:'attendance',label:'Attendance needs attention',count,detail:`${count} started session${count===1?' has':'s have'} no submitted register`,href:'/admin/attendance/sessions'});}
   if(effective('student_core')){const count=await tx.importJob.count({where:{...scope,state:{in:['REVIEW','CONFIRMED','RUNNING','COMPLETED_WITH_ERRORS','FAILED']}}});if(count)exceptions.push({id:'imports',label:'Roster imports need review',count,detail:`${count} import job${count===1?'':'s'} require a decision or follow-up`,href:'/admin/imports'});}
   const [pendingMemberships,pendingInvites]=await Promise.all([tx.schoolMembership.count({where:{...scope,status:'PENDING'}}),tx.accessInvite.count({where:{...scope,acceptedAt:null,revokedAt:null,expiresAt:{gt:asOf},deliveryStatus:{in:['PENDING_DELIVERY','FAILED']}}})]),pendingStaff=pendingMemberships+pendingInvites;
   if(pendingStaff)exceptions.push({id:'staff',label:'Staff access pending',count:pendingStaff,detail:`${pendingStaff} membership or invitation item${pendingStaff===1?'':'s'} need attention`,href:'/admin/users'});
   const completeCount=readiness.filter(item=>item.complete).length;
   return {asOf:asOf.toISOString(),readiness,exceptions,completeCount,totalCount:readiness.length};
  },{isolationLevel:'RepeatableRead',timeout:20000,maxWait:10000});}catch(error){if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}
 }
}
