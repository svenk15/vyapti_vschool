import { randomUUID } from "node:crypto";
import type { Prisma } from "../../../../generated/prisma/client";
import type { AuditWrite, PlatformAuditWriter } from "../contracts/audit-writer";

export class PrismaPlatformAuditWriter implements PlatformAuditWriter {
  constructor(private readonly tx: Prisma.TransactionClient) {}

  async append(evidence: AuditWrite): Promise<void> {
    await this.tx.auditEntry.create({
      data: {
        id: randomUUID(),
        organizationId: evidence.organizationId,
        schoolId: evidence.schoolId,
        actorAccountId: evidence.actorAccountId,
        module: evidence.module,
        command: evidence.command,
        resourceType: evidence.resourceType,
        resourceId: evidence.resourceId,
        before: evidence.before as Prisma.InputJsonObject,
        after: evidence.after as Prisma.InputJsonObject,
        reason: evidence.reason,
        requestId: evidence.requestId,
        occurredAt: evidence.occurredAt,
      },
    });
  }
}
