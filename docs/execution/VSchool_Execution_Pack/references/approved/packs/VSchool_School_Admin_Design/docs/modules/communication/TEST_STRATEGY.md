# Communication test strategy

## Unit and application tests
Purpose eligibility; account dedup with multiple child bindings; title/body bounds; branch-local date conversion; draft/approval revision; audience digest change; allowed lifecycle transitions; exact-version acknowledgement; independent read/ack/delivery state; correction retaining identity; withdrawal suppression; reminder throttling; typed provider outcomes; command replay and changed-payload conflict.

## Real PostgreSQL functional tests
Use the existing isolated test database and restricted runtime role where the real TEN-03 contract is active. Verify composite scope FKs, version/account unique acknowledgement, receipt/manifest/outbox atomicity, rollback, paged joins without count multiplication, scope denial, batch manifest completion and statement plans on realistic datasets. Exercise accept/revoke, publish/withdraw, schedule/cancel/worker, correct/ack and draft-edit/approval races with two real connections. A mocked repository test is not DB evidence.

Keep RLS status honest: application scope guards remain necessary. Do not declare production isolation if the runtime still uses owner credentials or TEN-03 remains incomplete. Apply the real owner lock order and signed/context-proof requirements rather than inventing a second tenancy model.

## Browser E2E
1. Administrator creates notice → recipient preview → publish → parent reads → deliberate ack → school sees exact version.
2. Attendance-only guardian excluded; explicit notice-purpose acceptance permits new notices only according to reviewed audience policy.
3. Teacher draft → school requests changes → resubmit → publish pinned revision.
4. Email failed → explicit retry; Unknown → status check; no inferred read/ack.
5. Schedule → permission removed before due → suppressed/NeedsReview; cancel race cannot send later.
6. Correction retains notice identity and old evidence; old ack button/deep link asks for current version.
7. Withdrawn/revoked/other-account/other-branch route denies body access and recipient details.
8. Reminder targets eligible pending accounts only; offline method retains staff identity/evidence.
9. Poor network / lost acknowledgement uses the same command receipt; no duplicate publish or ack.
10. Draft, validation, keyboard dialog, 390px screen, zoom and consistent theme checks.

The included browser checks run the offline in-memory HTML. Real application E2E must use actual server authorization, test database and deterministic email sink. No external email is needed for a demo.

## Load and operational evidence
Use the existing 5,000 pupils/branch × 20 branches dataset as the sizing basis. Model multiple adults and siblings, current/ended grants and long attempt history. Measure bounded preview/read pages, manifest batch throughput, queue lag, cancellation latency and SQL plans under the runtime role. Specify deployment/provider SLOs from measurements; no synchronous full-school fan-out or invented p95 claim. Verify backup/restore and pending worker recovery under current release requirements.

## Evidence boundary
Native VoiceOver/NVDA and human visual/UX review remain pending until actually performed. Exact commands, current source hash, DB role, dataset, browser viewport and observed results belong in CURRENT_STATE; neither a screenshot nor a passing prototype test proves production readiness.
