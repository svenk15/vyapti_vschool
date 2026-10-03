import { randomUUID } from "node:crypto";
import type { Prisma } from "../../../../generated/prisma/client";
import type { ProvisionEvidence, ProvisionEvidenceWriter } from "../contracts/provision-evidence";
export class PrismaProvisionEvidence implements ProvisionEvidenceWriter {
 constructor(private readonly tx:Prisma.TransactionClient) {}
 async appendProvisioned(e:ProvisionEvidence) {
  const scope={organizationId:e.organizationId,schoolId:e.schoolId};
  const safe={schemaVersion:1,principalKind:"OPERATOR",operatorId:e.operatorId,requestId:e.requestId,organizationId:e.organizationId,schoolId:e.schoolId};
  await this.tx.auditEntry.create({data:{id:randomUUID(),...scope,actorAccountId:e.accountId,module:"access",command:"ProvisionSchool",resourceType:"School",resourceId:e.schoolId,before:{},after:safe,reason:"Operator bootstrap",requestId:e.requestId,occurredAt:e.occurredAt}});
  await this.tx.outboxEvent.create({data:{id:randomUUID(),...scope,module:"access",type:"SchoolProvisioned.v1",schemaVersion:1,aggregateId:e.schoolId,aggregateVersion:1,occurredAt:e.occurredAt,payload:safe,availableAt:e.occurredAt}});
 }
}
