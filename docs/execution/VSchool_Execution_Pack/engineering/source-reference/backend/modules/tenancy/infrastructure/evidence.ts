import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../../../generated/prisma/client';
import type { InstitutionEvidence,InstitutionEvidenceWriter } from '../contracts/evidence';
export class PrismaInstitutionEvidence implements InstitutionEvidenceWriter {
 constructor(private readonly tx:Prisma.TransactionClient){}
 async append(e:InstitutionEvidence){
  await this.tx.configurationChange.create({data:{id:randomUUID(),organizationId:e.organizationId,schoolId:e.schoolId,actorAccountId:e.actorAccountId,expectedRevision:e.expectedRevision,newRevision:e.newRevision,changes:{command:e.command,...e.changes},reason:e.reason,requestId:e.requestId,occurredAt:e.occurredAt}});
  await this.tx.tenantCommandReceipt.create({data:{id:randomUUID(),organizationId:e.organizationId,actorAccountId:e.actorAccountId,command:e.command,key:e.key,inputHash:e.inputHash,response:e.response as Prisma.InputJsonValue,createdAt:e.occurredAt}});
  await this.tx.tenantOutbox.create({data:{id:randomUUID(),organizationId:e.organizationId,type:e.command+'.v1',schemaVersion:1,payload:{...e.changes,revision:e.newRevision},occurredAt:e.occurredAt,state:'PENDING',attempts:0,availableAt:e.occurredAt}});
 }
}
