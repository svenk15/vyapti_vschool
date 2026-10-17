import {createHash} from 'node:crypto';
import {Prisma,type PrismaClient} from '../../../../generated/prisma/client';
import type {Identity,RoleCode} from '../../../../shared/contracts/access';
import type {LeadershipFeedbackTurnaroundOverview,LeadershipLearningAssignment,LeadershipLearningOverview} from '../../../../shared/contracts/learning';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {LeadershipLearningRepository} from '../application/leadership';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';

type Scope={organizationId:string;schoolId:string};
type Row={assignment_id:string;version_id:string;title:string;due_at:Date;class_id:string;class_label:string;subject_id:string;subject_name:string;expected_pairs:number;submitted_pairs:number;upcoming_pairs:number;excused_pairs:number};
type Counts={assignments:number;expected_pairs:number;submitted_pairs:number;upcoming_pairs:number;excused_pairs:number};
type FilterRow={class_id:string;class_label:string;subject_id:string;subject_name:string};
type TurnaroundCounts={accepted_submissions:number;first_feedback_published:number;awaiting_feedback:number;median_turnaround_seconds:number|null};
const modules=['homework','student_core','academic_core','staff_core'] as const;
const date=(value:Date)=>value.toISOString().slice(0,10);
const add=(value:string,days:number)=>{const result=new Date(`${value}T00:00:00.000Z`);result.setUTCDate(result.getUTCDate()+days);return date(result);};
const civil=(instant:Date,timezone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(instant);
const localStart=(value:string,timezone:string)=>{const target=Date.parse(`${value}T00:00:00.000Z`);let candidate=target;for(let attempt=0;attempt<4;attempt++){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(candidate)),read=(type:string)=>Number(parts.find(part=>part.type===type)?.value??0),shown=Date.UTC(read('year'),read('month')-1,read('day'),read('hour'),read('minute'),read('second')),correction=target-shown;if(!correction)break;candidate+=correction;}return new Date(candidate);};
const signature=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0,24);
const encode=(dueAt:Date,id:string,sig:string)=>Buffer.from(JSON.stringify({v:1,dueAt:dueAt.toISOString(),id,sig})).toString('base64url');
function decode(value:string|null,sig:string){if(!value)return null;try{const parsed=JSON.parse(Buffer.from(value,'base64url').toString('utf8')) as {v?:unknown;dueAt?:unknown;id?:unknown;sig?:unknown};if(parsed.v!==1||parsed.sig!==sig||typeof parsed.dueAt!=='string'||Number.isNaN(Date.parse(parsed.dueAt))||typeof parsed.id!=='string'||!/^[0-9a-f-]{36}$/i.test(parsed.id))throw new Error();return {dueAt:new Date(parsed.dueAt),id:parsed.id};}catch{throw new AccessError('VALIDATION');}}
function fail(error:unknown):never{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}

export class PrismaLeadershipLearningRepository implements LeadershipLearningRepository{
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly context:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}
 private async authorize(tx:Prisma.TransactionClient,actor:Identity,scope:Scope){
  await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:scope.organizationId,branchId:scope.schoolId});
  const [account,membership,school]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.schoolMembership.findFirst({where:{...scope,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}}),
   tx.school.findFirst({where:{organizationId:scope.organizationId,id:scope.schoolId,status:'ACTIVE'},select:{timezone:true}}),
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!membership||!capabilitiesFor(membership.grants.map(item=>item.code as RoleCode)).includes('learning.read_leadership'))throw new AccessError('FORBIDDEN');
  if(!school)throw new AccessError('NOT_FOUND');
  if(!modules.every(id=>this.manifest[id]))throw new AccessError('RELEASE_UNAVAILABLE');
  const at=this.now(),[licensed,active]=await Promise.all([
   tx.organizationEntitlement.findMany({where:{organizationId:scope.organizationId,moduleId:{in:[...modules]},state:'ACTIVE',startsAt:{lte:at},OR:[{endsAt:null},{endsAt:{gt:at}}]},select:{moduleId:true}}),
   tx.branchActivation.findMany({where:{...scope,moduleId:{in:[...modules]},state:'ACTIVE'},select:{moduleId:true}}),
  ]);
  if(new Set(licensed.map(item=>item.moduleId)).size!==modules.length)throw new AccessError('MODULE_NOT_LICENSED');
  if(new Set(active.map(item=>item.moduleId)).size!==modules.length)throw new AccessError('MODULE_DISABLED');
  return school.timezone;
 }
 async overview(actor:Identity,input:Scope&{query:import('../domain/leadership').LeadershipLearningInput}):Promise<LeadershipLearningOverview>{try{return await this.db.$transaction(async tx=>{
  const timezone=await this.authorize(tx,actor,{organizationId:input.organizationId,schoolId:input.schoolId}),asOf=this.now(),today=civil(asOf,timezone),fromDate=input.query.fromDate??add(today,-30),toDate=input.query.toDate??add(today,31),from=localStart(fromDate,timezone),to=localStart(toDate,timezone),sig=signature({fromDate,toDate,classId:input.query.classId,subjectId:input.query.subjectId}),cursor=decode(input.query.cursor,sig),classFilter=input.query.classId?Prisma.sql`AND sec.id=${input.query.classId}::uuid`:Prisma.empty,subjectFilter=input.query.subjectId?Prisma.sql`AND sub.id=${input.query.subjectId}::uuid`:Prisma.empty,after=cursor?Prisma.sql`AND (v.due_at>${cursor.dueAt} OR (v.due_at=${cursor.dueAt} AND a.id>${cursor.id}::uuid))`:Prisma.empty;
  const base=Prisma.sql`
FROM vs_learning_assignment_version v
JOIN vs_learning_assignment a ON a.organization_id=v.organization_id AND a.school_id=v.school_id AND a.id=v.assignment_id AND a.current_version_id=v.id AND a.status='PUBLISHED'
JOIN vs_academics_course_offering o ON o.organization_id=v.organization_id AND o.school_id=v.school_id AND o.id=v.offering_id
JOIN vs_academics_section sec ON sec.organization_id=o.organization_id AND sec.school_id=o.school_id AND sec.id=o.section_id
JOIN vs_academics_grade_level grade ON grade.organization_id=sec.organization_id AND grade.school_id=sec.school_id AND grade.id=sec.grade_id
JOIN vs_academics_subject sub ON sub.organization_id=o.organization_id AND sub.school_id=o.school_id AND sub.id=o.subject_id
LEFT JOIN vs_learning_assignment_recipient r ON r.organization_id=v.organization_id AND r.school_id=v.school_id AND r.assignment_version_id=v.id
LEFT JOIN vs_learning_submission_attempt attempt ON attempt.organization_id=v.organization_id AND attempt.school_id=v.school_id AND attempt.assignment_version_id=v.id AND attempt.recipient_id=r.id
LEFT JOIN LATERAL (
 SELECT effective_due_at,effective_excused
 FROM vs_learning_recipient_policy_event pe
 WHERE pe.organization_id=r.organization_id AND pe.school_id=r.school_id AND pe.recipient_id=r.id
 ORDER BY pe.event_no DESC LIMIT 1
) policy ON TRUE
WHERE v.organization_id=${input.organizationId}::uuid AND v.school_id=${input.schoolId}::uuid AND v.due_at>=${from} AND v.due_at<${to}`;
  const [countRows,rows,filterRows]=await Promise.all([
   tx.$queryRaw<Counts[]>(Prisma.sql`SELECT COUNT(DISTINCT v.id)::int AS assignments, COUNT(r.id) FILTER (WHERE NOT COALESCE(policy.effective_excused,false) AND COALESCE(policy.effective_due_at,v.due_at)<=${asOf})::int AS expected_pairs, COUNT(attempt.id) FILTER (WHERE NOT COALESCE(policy.effective_excused,false) AND COALESCE(policy.effective_due_at,v.due_at)<=${asOf})::int AS submitted_pairs, COUNT(r.id) FILTER (WHERE NOT COALESCE(policy.effective_excused,false) AND COALESCE(policy.effective_due_at,v.due_at)>${asOf})::int AS upcoming_pairs, COUNT(r.id) FILTER (WHERE COALESCE(policy.effective_excused,false))::int AS excused_pairs ${base} ${classFilter} ${subjectFilter}`),
   tx.$queryRaw<Row[]>(Prisma.sql`SELECT a.id AS assignment_id,v.id AS version_id,v.title,v.due_at,sec.id AS class_id,concat(grade.name,' · ',sec.name) AS class_label,sub.id AS subject_id,sub.name AS subject_name,COUNT(r.id) FILTER (WHERE NOT COALESCE(policy.effective_excused,false) AND COALESCE(policy.effective_due_at,v.due_at)<=${asOf})::int AS expected_pairs,COUNT(attempt.id) FILTER (WHERE NOT COALESCE(policy.effective_excused,false) AND COALESCE(policy.effective_due_at,v.due_at)<=${asOf})::int AS submitted_pairs,COUNT(r.id) FILTER (WHERE NOT COALESCE(policy.effective_excused,false) AND COALESCE(policy.effective_due_at,v.due_at)>${asOf})::int AS upcoming_pairs,COUNT(r.id) FILTER (WHERE COALESCE(policy.effective_excused,false))::int AS excused_pairs ${base} ${classFilter} ${subjectFilter} ${after} GROUP BY a.id,v.id,v.title,v.due_at,sec.id,grade.name,sec.name,sub.id,sub.name ORDER BY v.due_at ASC,a.id ASC LIMIT ${input.query.limit+1}`),
   tx.$queryRaw<FilterRow[]>(Prisma.sql`SELECT DISTINCT sec.id AS class_id,concat(grade.name,' · ',sec.name) AS class_label,sub.id AS subject_id,sub.name AS subject_name ${base} ORDER BY class_label,subject_name`),
  ]),counts=countRows[0]??{assignments:0,expected_pairs:0,submitted_pairs:0,upcoming_pairs:0,excused_pairs:0},page=rows.slice(0,input.query.limit),items:LeadershipLearningAssignment[]=page.map(row=>({assignmentId:row.assignment_id,assignmentVersionId:row.version_id,title:row.title,dueAt:row.due_at.toISOString(),classId:row.class_id,classLabel:row.class_label,subjectId:row.subject_id,subjectName:row.subject_name,expectedPairs:row.expected_pairs,submittedPairs:row.submitted_pairs,awaitingPairs:row.expected_pairs-row.submitted_pairs,due:row.expected_pairs>0})),last=page.at(-1),classes=[...new Map(filterRows.map(row=>[row.class_id,{id:row.class_id,label:row.class_label}])).values()],subjects=[...new Map(filterRows.map(row=>[row.subject_id,{id:row.subject_id,label:row.subject_name}])).values()];
  return {asOf:asOf.toISOString(),timezone,definitionVersion:'assignment-completion.v2',denominatorPolicy:'NON_EXCUSED_EFFECTIVE_DEADLINE_DUE_BY_SERVER_CUTOFF',query:{fromDate,toDate,classId:input.query.classId,subjectId:input.query.subjectId,cursor:input.query.cursor,limit:input.query.limit},filters:{classes,subjects},counts:{assignments:counts.assignments,expectedPairs:counts.expected_pairs,submittedPairs:counts.submitted_pairs,awaitingPairs:counts.expected_pairs-counts.submitted_pairs,upcomingPairs:counts.upcoming_pairs,excusedPairs:counts.excused_pairs},assignments:{items,total:counts.assignments,nextCursor:rows.length>input.query.limit&&last?encode(last.due_at,last.assignment_id,sig):null},limitations:{extensionsSupported:true,excusedSupported:true,pupilDetailSupported:true,followUpSupported:false}};
 },{isolationLevel:'RepeatableRead'});}catch(error){return fail(error);}}
 async feedbackTurnaround(actor:Identity,input:Scope&{query:import('../domain/leadership').LeadershipFeedbackTurnaroundInput}):Promise<LeadershipFeedbackTurnaroundOverview>{try{return await this.db.$transaction(async tx=>{
  const timezone=await this.authorize(tx,actor,{organizationId:input.organizationId,schoolId:input.schoolId}),asOf=this.now(),today=civil(asOf,timezone),fromDate=input.query.fromDate??add(today,-30),toDate=input.query.toDate??add(today,1),from=localStart(fromDate,timezone),to=localStart(toDate,timezone),classFilter=input.query.classId?Prisma.sql`AND sec.id=${input.query.classId}::uuid`:Prisma.empty,subjectFilter=input.query.subjectId?Prisma.sql`AND sub.id=${input.query.subjectId}::uuid`:Prisma.empty;
  const cohort=Prisma.sql`
FROM vs_learning_submission_attempt attempt
JOIN vs_learning_assignment_version v ON v.organization_id=attempt.organization_id AND v.school_id=attempt.school_id AND v.id=attempt.assignment_version_id
JOIN vs_academics_course_offering o ON o.organization_id=v.organization_id AND o.school_id=v.school_id AND o.id=v.offering_id
JOIN vs_academics_section sec ON sec.organization_id=o.organization_id AND sec.school_id=o.school_id AND sec.id=o.section_id
JOIN vs_academics_grade_level grade ON grade.organization_id=sec.organization_id AND grade.school_id=sec.school_id AND grade.id=sec.grade_id
JOIN vs_academics_subject sub ON sub.organization_id=o.organization_id AND sub.school_id=o.school_id AND sub.id=o.subject_id
LEFT JOIN LATERAL (
 SELECT MIN(fv.published_at) AS first_published_at
 FROM vs_learning_feedback_version fv
 WHERE fv.organization_id=attempt.organization_id AND fv.school_id=attempt.school_id AND fv.submission_id=attempt.id AND fv.published_at<=${asOf}
) first_feedback ON TRUE
WHERE attempt.organization_id=${input.organizationId}::uuid AND attempt.school_id=${input.schoolId}::uuid AND attempt.accepted_at>=${from} AND attempt.accepted_at<${to} AND attempt.accepted_at<=${asOf}`;
  const [countRows,filterRows]=await Promise.all([
   tx.$queryRaw<TurnaroundCounts[]>(Prisma.sql`SELECT COUNT(*)::int AS accepted_submissions,COUNT(first_feedback.first_published_at)::int AS first_feedback_published,COUNT(*) FILTER (WHERE first_feedback.first_published_at IS NULL)::int AS awaiting_feedback,percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (first_feedback.first_published_at-attempt.accepted_at))) FILTER (WHERE first_feedback.first_published_at IS NOT NULL)::double precision AS median_turnaround_seconds ${cohort} ${classFilter} ${subjectFilter}`),
   tx.$queryRaw<FilterRow[]>(Prisma.sql`SELECT DISTINCT sec.id AS class_id,concat(grade.name,' · ',sec.name) AS class_label,sub.id AS subject_id,sub.name AS subject_name ${cohort} ORDER BY class_label,subject_name`),
  ]),counts=countRows[0]??{accepted_submissions:0,first_feedback_published:0,awaiting_feedback:0,median_turnaround_seconds:null},classes=[...new Map(filterRows.map(row=>[row.class_id,{id:row.class_id,label:row.class_label}])).values()],subjects=[...new Map(filterRows.map(row=>[row.subject_id,{id:row.subject_id,label:row.subject_name}])).values()];
  return {asOf:asOf.toISOString(),timezone,definitionVersion:'feedback-turnaround.v1',cohortPolicy:'ACCEPTED_SUBMISSIONS_IN_INTERVAL',clockPolicy:'ELAPSED_CLOCK_TIME_TO_FIRST_PUBLICATION',query:{fromDate,toDate,classId:input.query.classId,subjectId:input.query.subjectId},filters:{classes,subjects},counts:{acceptedSubmissions:counts.accepted_submissions,firstFeedbackPublished:counts.first_feedback_published,awaitingFeedback:counts.awaiting_feedback},medianTurnaroundSeconds:counts.median_turnaround_seconds===null?null:Number(counts.median_turnaround_seconds),limitations:{privateDraftsExcluded:true,laterRevisionsIgnored:true,studentDetailSupported:false,coordinationSupported:false}};
 },{isolationLevel:'RepeatableRead'});}catch(error){return fail(error);}}
}
