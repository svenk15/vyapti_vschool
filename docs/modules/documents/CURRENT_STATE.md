# Documents / shared file-safety current state

Last updated: 18 October 2026.

Status: **DOC-01 ENGINEERING_COMPLETE / DOC-02A ENGINEERING_COMPLETE_SYNTHETIC / F12 ENGINEERING_COMPLETE_SYNTHETIC / HUMAN_REVIEW_PENDING**.

## 18 October 2026 — DOC-02A and first Communication owner link

The provider-independent file lifecycle is implemented. A CLEAN exact asset can be promoted once into an immutable `DocumentVersion` and active owner-purpose grant; exact command replay returns the original version/grant without duplicate writes, while changed payload conflicts. Same-origin downloads derive scope only from that trusted active grant, establish the live account, invoke the consuming-owner authorization port, require the current exact CLEAN scan and recheck the private bytes before returning `private, no-store`, `nosniff` and attachment headers. Parent and Student downloads therefore do not require a staff membership, and a copied URL is denied after recipient-purpose revocation or notice withdrawal.

Forward migration `20261019070000_documents_promotion_receipts` adds the Documents-owned command receipt. Development and test contain 116 forward migrations through the Communication attachment link; neither database was reset or rewritten. The local runtime uses ignored private storage and ClamAV 1.5.4 with official signature set 28156. A synthetic PDF returned CLEAN; the exact standard EICAR fixture returned `Eicar-Test-Signature FOUND` with scanner exit 1. Missing/stale signatures and scanner failures remain fail closed.

Focused current-source evidence: Documents unit tests passed; Documents PostgreSQL 5/5; Communication PostgreSQL 6/6; typecheck, backend boundary and database-design checks passed; production and isolated E2E builds used the documented 4 GiB heap. The LEA-32 author → independent reviewer → publisher → Parent download journey passed one-worker desktop and mobile Playwright with real ClamAV. Captures were directly inspected at 1440×1000 and 390×844. See `docs/evidence/principal-lea-32-attachments-2026-10-18/`.

Remaining gates are production storage/region/KMS, scanner service/update SLA, retention/deletion/legal hold/backup, TEN-03, native accessibility, font portability and human acceptance. The local synthetic file path does not authorize real pupil files or production enablement.

The user's recorded D02–D19 approval includes D15 for synthetic-only implementation. The approved baseline is PDF/JPEG/PNG, 10 MiB per file, five attachments per action, a configurable 100 MiB synthetic branch quota, private local development storage, real fail-closed scanning and same-origin authenticated streaming. Production provider, region, KMS, scanner service, retention/deletion and production quota remain outside this approval.

## Implemented checkpoint

- Portable validation accepts only the approved media declarations and matching extension/signature, normalizes presentation filenames, verifies exact bytes/size/SHA-256 and never converts scanner error/unavailability into a clean state.
- Migration `20261018090000_documents_safe_foundation` adds six branch-scoped `vs_documents_*` tables, scoped keys/FKs, closed states, append-only scan/version triggers, owner indexes and TEN-ADR-006 Path A metadata. Development and test databases both contain 88 applied migrations; neither was reset.
- `PrismaDocumentsRepository` rechecks verified account/branch context and the typed consuming-owner authorization port before initial persistence, replay disclosure, status disclosure and rescan. Same actor/key/payload returns one result; changed input conflicts. Branch quota is enforced inside the serializable creation transaction.
- `LocalPrivateObjectStorage` uses opaque generated keys, a non-public configured root and private file/directory modes. `ClamAvScanner` executes only a configured local command, uses a private temporary copy and maps missing/failed scanning to `SCAN_UNAVAILABLE`.
- Controlled rescan appends evidence and may promote to READY only after a real CLEAN verdict; a later BLOCKED/UNAVAILABLE verdict can disable an earlier safe asset. No user-facing upload or download route is enabled yet.

## Verification evidence

- `test/unit/documents.test.ts`: 3/3 passed for limits, allowlist/signatures, filenames and fail-closed verdict mapping.
- `test/functional/documents.test.ts`: 3/3 passed against `vyapti_vschool_test` for exact replay/conflict, one asset/scan result, append-only enforcement, invalid/blocked/unavailable states, controlled rescan, current owner reauthorization and cross-branch denial.
- `pnpm check:db-design`: 142 registered contracts passed. `pnpm check:backend` passed after Prisma generation.
- Deterministic CLEAN/BLOCKED verdicts in the functional test are state-machine evidence only. They are not malware-protection evidence. The current workstation has no `clamscan`, `clamdscan` or `freshclam` executable, so no SAFE-file demo is claimed.

Evidence: `docs/evidence/documents-f12-foundation-2026-10-17/README.md`.

## Remaining F12 / LEA-32 work

1. Implement the already-authorized provider-independent DOC-02A lifecycle: exact READY-asset promotion, immutable DocumentVersion, revocable purpose grant, protected replay/status and same-origin streaming. This does not require choosing a production provider and is the next eligible code slice.
2. Add the Communication-specific adapter and atomic revision link so exact ordered attachment versions enter the proposal approval digest; any change requires new review.
3. Configure a real non-production ClamAV engine with current signatures and verify clean, EICAR-blocked and unavailable outcomes. The current Apple Silicon workstation has no `clamscan`, `clamdscan` or `freshclam` executable.
4. Verify every download against current Communication recipient purpose, current notice/version state, current grant and current asset safety. Add author/reviewer/publisher browser states and direct desktop/mobile comparison. Until these pass, F12 and LEA-32 remain PARTIAL.

Human acceptance, native accessibility, TEN-03, provider/security review, retention/deletion, backup/restore and production enablement remain pending.
