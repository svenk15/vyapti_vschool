import type {Prisma} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianChildAccessVerifier} from '../contracts/access-verification';
import {GuardianError} from '../domain/policy';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';

const dependencies={attendance:['family','student_core','academic_core','staff_core','attendance'],timetable:['family','student_core','academic_core','staff_core','timetable']} as const;
export class PrismaGuardianChildAccessVerifier implements GuardianChildAccessVerifier{
 constructor(private readonly manifest:ReleaseManifest,private readonly context:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}
 async verify(transaction:object,identity:Identity,input:Parameters<GuardianChildAccessVerifier['verify']>[2]){
  const tx=transaction as Prisma.TransactionClient;if(!await this.context.establishAccount(tx,identity.accountId,identity.tokenVersion))throw new GuardianError('UNAUTHENTICATED');
  const access=await tx.guardianChildAccess.findFirst({where:{accountId:identity.accountId,studentId:input.studentId,acceptedAt:{not:null},revokedAt:null,purposes:{some:{purpose:input.purpose}},student:{status:'ACTIVE',school:{status:'ACTIVE',organization:{status:'ACTIVE'}}}},include:{student:{select:{school:{select:{timezone:true}}}}}});
  if(!access)throw new GuardianError('NOT_FOUND');
  const modules=[...dependencies[input.moduleId as keyof typeof dependencies]??['family','student_core',input.moduleId]],now=this.now();if(!modules.every(moduleId=>this.manifest[moduleId]))throw new GuardianError('RELEASE_UNAVAILABLE');
  const [entitlements,activations]=await Promise.all([tx.organizationEntitlement.findMany({where:{organizationId:access.organizationId,moduleId:{in:modules},state:'ACTIVE',startsAt:{lte:now},OR:[{endsAt:null},{endsAt:{gt:now}}]},select:{moduleId:true}}),tx.branchActivation.findMany({where:{organizationId:access.organizationId,schoolId:access.schoolId,moduleId:{in:modules},state:'ACTIVE'},select:{moduleId:true}})]);
  if(new Set(entitlements.map(row=>row.moduleId)).size!==modules.length)throw new GuardianError('MODULE_NOT_LICENSED');if(new Set(activations.map(row=>row.moduleId)).size!==modules.length)throw new GuardianError('MODULE_DISABLED');
  return {accessId:access.id,organizationId:access.organizationId,schoolId:access.schoolId,studentId:access.studentId,accessFrom:access.accessFrom.toISOString().slice(0,10),timezone:access.student.school.timezone};
 }
}
