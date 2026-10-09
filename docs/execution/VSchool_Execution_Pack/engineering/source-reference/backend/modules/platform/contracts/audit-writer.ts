export type AuditWrite = Readonly<{
  organizationId: string;
  schoolId: string;
  actorAccountId: string;
  module: string;
  command: string;
  resourceType: string;
  resourceId: string;
  before: Readonly<Record<string, unknown>>;
  after: Readonly<Record<string, unknown>>;
  reason?: string;
  requestId: string;
  occurredAt: Date;
}>;

/** Enlisted writer for the shared Platform-owned immutable audit envelope. */
export interface PlatformAuditWriter {
  append(evidence: AuditWrite): Promise<void>;
}
