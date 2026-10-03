import { randomUUID } from "node:crypto";
import type { Prisma } from "../../../../generated/prisma/client";
import type { CommandEvidence,CommandEvidenceWriter } from "../contracts/command-evidence";
export class PrismaCommandEvidence implements CommandEvidenceWriter {
 constructor(private readonly tx:Prisma.TransactionClient){}
 async append(e:CommandEvidence){
  const scope={organizationId:e.organizationId,schoolId:e.schoolId},occurredAt=new Date(e.occurredAt),safe={schemaVersion:1,resourceId:e.response.resourceId,version:e.response.version,status:e.response.status};
  await this.tx.auditEntry.create({data:{id:randomUUID(),...scope,actorAccountId:e.actorAccountId,module:"access",command:e.command,resourceType:e.resourceType,resourceId:e.response.resourceId,before:e.before as Prisma.InputJsonObject,after:e.after as Prisma.InputJsonObject,reason:e.reason,requestId:e.requestId,occurredAt}});
  await this.tx.outboxEvent.create({data:{id:randomUUID(),...scope,module:"access",type:e.command+".v1",schemaVersion:1,aggregateId:e.response.resourceId,aggregateVersion:e.response.version,occurredAt,payload:safe,availableAt:occurredAt}});
  await this.tx.commandReceipt.create({data:{id:randomUUID(),...scope,actorAccountId:e.actorAccountId,command:e.command,key:e.key,inputHash:e.inputHash,response:e.response,createdAt:occurredAt}});
 }
}
