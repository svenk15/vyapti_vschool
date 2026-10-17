# Documents / shared file-safety task breakdown

F12 is now an active execution-queue foundation. D15 settles its synthetic baseline; production provider and retention choices remain separate release gates.

## DOC-00 — approve the safe-file baseline

- [x] Reconcile canonical Documents ownership with the requested shared Files contract.
- [x] Map exact consuming workflows and existing owner capabilities.
- [x] Define the portable ports, proposed schema, quarantine/scan state machine, authorization boundary and verification plan.
- [x] Approve the synthetic media allowlist, size/count/quota limits, fail-closed real scanner behavior and same-origin download delivery through D15.
- [ ] Select production storage/provider/residency, scanner service and quarantine/orphan retention before production enablement.
- [ ] Approve purpose-specific retention, legal hold, deletion and backup policy before cleanup exists.

Status: SYNTHETIC_BASELINE_APPROVED / PRODUCTION_PROVIDER_AND_RETENTION_PENDING.

## DOC-01 — provider-independent safety foundation

- [x] Add the forward BRANCH migration and table-registry contracts.
- [x] Implement framework-free state/invariant logic, Documents facade, typed ports and Prisma adapter.
- [x] Prove scope, replay, append-only scan evidence, controlled rescan and clean-only promotion with real PostgreSQL.
- [x] Keep all user routes unavailable; deterministic scanner evidence is explicitly test-only.

Status: ENGINEERING_COMPLETE_FOUNDATION; migration `20261018090000_documents_safe_foundation`.

## DOC-02 — guarded storage, scanner and download delivery

- [x] Implement local private storage restricted to explicitly guarded development/test composition.
- [x] Implement a ClamAV command adapter; absent or failed ClamAV remains `SCAN_UNAVAILABLE` and controlled rescan rechecks owner authority.
- [ ] Configure and exercise a real non-production ClamAV engine/signature set; no current local executable is installed.
- [ ] Implement upload/finalize recovery and current-authority same-origin download.
- [ ] Verify malicious/mismatch/oversize/expired/revoked cases and provider metadata privacy.

Status: PARTIAL; no user route or SAFE-file claim until the real scanner is exercised. Authenticated download remains with the first consuming-owner link.

## DOC-03 — Learning resource publication and Student read

- [ ] Add the exact Learning owner link and Teacher assignment/resource authority.
- [ ] Freeze an immutable clean DocumentVersion into the published Learning version.
- [ ] Reauthorize the exact Student recipient on each STW-12 open/download.
- [ ] Verify ended enrollment, withdrawal, cross-Student, expiry and desktop/mobile states.

Status: NOT_STARTED; depends on DOC-02 and the TEA-26 resource policy.

## DOC-04 — Student draft attachment and submission snapshot

- [ ] Bind clean assets to one private Student draft version without exposing them to Parent/Teacher before submission.
- [ ] Snapshot exact ready versions into one immutable attempt only at final confirmation.
- [ ] Preserve text draft/submission replay, concurrency, due and privacy contracts.

Status: NOT_STARTED; depends on DOC-03 and accepted file limits.

## DOC-05 — Communication attachments

- [ ] Freeze exact clean versions into one immutable NoticeVersion.
- [ ] Reauthorize the current exact Parent/Student notice purpose for every download.
- [ ] Preserve withdrawal as a content-free state and deny prior attachment access.

Status: NOT_STARTED; depends on DOC-02 and Communication attachment-authoring rules.

## DOC-06 — document requests, review and issued artifacts

- [ ] Design purpose classifications, reviewer/signatory authority, request states and official artifact generation.
- [ ] Implement only after Admissions, Results and Requests owners supply their exact source/publication contracts.

Status: BLOCKED_PRODUCT_DESIGN for SA-44/45, PAR-24/35/38 and STW-34.
