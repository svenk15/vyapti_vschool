# Documents / shared file-safety task breakdown

These are design-ready candidate slices, not entries in the current execution index. They remain blocked where the named product/provider decision is unresolved.

## DOC-00 — approve the safe-file baseline

- [x] Reconcile canonical Documents ownership with the requested shared Files contract.
- [x] Map exact consuming workflows and existing owner capabilities.
- [x] Define the portable ports, proposed schema, quarantine/scan state machine, authorization boundary and verification plan.
- [ ] Approve initial media allowlist, size/count/quota limits, production storage/provider/residency, real scanner behavior, quarantine/orphan retention and download delivery.
- [ ] Approve purpose-specific retention, legal hold, deletion and backup policy before cleanup exists.

Status: DESIGN_COMPLETE / PRODUCT_AND_PROVIDER_DECISIONS_PENDING.

## DOC-01 — provider-independent safety foundation

- [ ] Add the forward BRANCH migration and table-registry contracts after DOC-00 decisions.
- [ ] Implement framework-free state/invariant logic, Documents facade, typed ports and Prisma adapter.
- [ ] Prove scope, replay, concurrency, append-only scan evidence and clean-only promotion with real PostgreSQL.
- [ ] Keep all user routes unavailable; test scanner/storage adapters are not a secure upload capability.

Status: NOT_STARTED; depends on DOC-00 decisions.

## DOC-02 — guarded storage, scanner and download delivery

- [ ] Implement local private storage restricted to the guarded development database.
- [ ] Integrate one real non-production scanner adapter; scanner unavailable remains unavailable.
- [ ] Implement upload/finalize recovery and current-authority same-origin download.
- [ ] Verify malicious/mismatch/oversize/expired/revoked cases and provider metadata privacy.

Status: NOT_STARTED; depends on DOC-01 and provider/scanner decisions.

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
