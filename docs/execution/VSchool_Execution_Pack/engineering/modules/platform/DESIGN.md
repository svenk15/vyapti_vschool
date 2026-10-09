# Platform — concrete engineering LLD

## Responsibility and aggregate boundary
Shared operational evidence and health. Aggregates/owned records: SetupCheck, AuditEntry, OperatorAuditEntry, OutboxEvent, CommandReceipt. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Generic platform evidence is not the attendance tenant receipt store. Health response must not expose configuration/credentials. Outbox persistence is not proof of email delivery.

## Input facades and cross-owner ports
- `backend/modules/platform/application/get-setup-status.ts`
- `backend/modules/platform/contracts/access-security-evidence.ts`
- `backend/modules/platform/contracts/audit-writer.ts`
- `backend/modules/platform/contracts/command-evidence.ts`
- `backend/modules/platform/contracts/provision-evidence.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/platform/application/get-setup-status.ts

```ts
import { describeReadiness, type SetupState } from "../domain/readiness";
export interface SetupProbe {
  inspect(): Promise<SetupState>;
}
export async function querySetupStatus(probe: SetupProbe) {
  try {
    return describeReadiness(await probe.inspect());
  } catch {
    return describeReadiness("unavailable");
  }
}

```

### backend/modules/platform/contracts/access-security-evidence.ts

```ts
export type AccessSecurityEvidence={organizationId:string;schoolId:string;accountId:string;operatorId?:string;caseReference?:string;reason?:string;command:"ActivationIssued"|"RecoveryRequested"|"AccountActivated";version:number;requestId:string;occurredAt:Date};
export interface AccessSecurityEvidenceWriter {append(evidence:AccessSecurityEvidence):Promise<void>}

```

### backend/modules/platform/contracts/audit-writer.ts

```ts
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

```

### backend/modules/platform/contracts/command-evidence.ts

```ts
import type { ManagementResult } from "../../../../shared/contracts/access-management";
export type CommandEvidence={organizationId:string;schoolId:string;actorAccountId:string;command:string;key:string;inputHash:string;response:ManagementResult;before:Record<string,unknown>;after:Record<string,unknown>;reason?:string;requestId:string;occurredAt:string;resourceType:string;module?:string};
export interface CommandEvidenceWriter { append(evidence:CommandEvidence):Promise<void> }

```

### backend/modules/platform/contracts/provision-evidence.ts

```ts
export type ProvisionEvidence = {
  organizationId:string;schoolId:string;accountId:string;operatorId:string;requestId:string;occurredAt:Date;
};
export interface ProvisionEvidenceWriter { appendProvisioned(evidence:ProvisionEvidence):Promise<void> }

```

## Output adapters

- `backend/modules/platform/infrastructure/access-security-evidence.ts`
- `backend/modules/platform/infrastructure/audit-writer.ts`
- `backend/modules/platform/infrastructure/command-evidence.ts`
- `backend/modules/platform/infrastructure/prisma-setup-probe.ts`
- `backend/modules/platform/infrastructure/provision-evidence.ts`

## Pure domain rules

- `backend/modules/platform/domain/readiness.ts`

## Physical data

- `vs_platform_setup_check` — id=starter is the idempotently seeded readiness marker. No school data.; see database/tables/vs_platform_setup_check.md
- `vs_platform_audit_entry` — Redacted business changes only; immutable. before/after are small allowlisted diffs, never password/token/CSV bodies.; see database/tables/vs_platform_audit_entry.md
- `vs_platform_operator_audit` — Append-only global platform-operator audit; aggregate technical outcomes only, no tenant/student/source identifiers.; see database/tables/vs_platform_operator_audit.md
- `vs_platform_outbox_event` — Internal domain fact. Phase 1 only persists; no external delivery is claimed. Future dispatcher uses an explicit lease and receipt migration.; see database/tables/vs_platform_outbox_event.md
- `vs_platform_command_receipt` — Only committed safe success response; all fields immutable. Unsuccessful transaction writes no receipt.; see database/tables/vs_platform_command_receipt.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/platform/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
