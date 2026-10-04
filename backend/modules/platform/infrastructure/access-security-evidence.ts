import { randomUUID } from "node:crypto";
import type { Prisma } from "../../../../generated/prisma/client";
import type { AccessSecurityEvidence,AccessSecurityEvidenceWriter } from "../contracts/access-security-evidence";
export class PrismaAccessSecurityEvidence implements AccessSecurityEvidenceWriter {
 constructor(private readonly tx:Prisma.TransactionClient){}
 async append(e:AccessSecurityEvidence){
  const scope={organizationId:e.organizationId,schoolId:e.schoolId},safe={schemaVersion:1,principalKind:e.operatorId?"OPERATOR":"ACTIVATION_TOKEN",...(e.operatorId?{operatorId:e.operatorId,caseReference:e.caseReference}:{}),accountId:e.accountId,version:e.version};
  await this.tx.auditEntry.create({data:{id:randomUUID(),...scope,actorAccountId:e.accountId,module:"access",command:e.command,resourceType:"UserAccount",resourceId:e.accountId,before:{},after:safe,reason:e.reason,requestId:e.requestId,occurredAt:e.occurredAt}});
  await this.tx.outboxEvent.create({data:{id:randomUUID(),...scope,module:"access",type:e.command+".v1",schemaVersion:1,aggregateId:e.accountId,aggregateVersion:e.version,payload:safe,occurredAt:e.occurredAt,availableAt:e.occurredAt}});
 }
}
