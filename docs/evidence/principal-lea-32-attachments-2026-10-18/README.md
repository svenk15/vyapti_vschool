# LEA-32 scanned notice attachment evidence

Captured 18 October 2026 IST from the DOC-02A/COM-05 working checkpoint that follows repository HEAD `0c23bcd`. The focused commit is recorded after checkpointing. Human acceptance remains PENDING.

## Implemented journey

- An authorized Communication author saves a protected proposal, uploads a fictional PDF, receives a real ClamAV CLEAN result and links the immutable Documents version in a new proposal revision.
- A distinct assigned Principal reviewer inspects the exact content, audience and filename digest before approval. A separately designated publisher performs immediate portal publication.
- The frozen Parent recipient sees the exact attachment. Its same-origin URL returns the exact bytes only after current live-account, frozen-recipient, purpose, active-grant and current-clean-scan checks.
- Attachment change invalidates the prior digest. Notice withdrawal, recipient-purpose revocation, wrong account/scope and unsafe or changed private bytes deny the old URL.

The approved reference is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, state `LEA-32 — Prepare a targeted school notice`. It is a workflow explorer dialog. The production mapping is the routed author, independent review and recipient compositions shown here; sample names/counts are not copied into product logic.

## Real scanner evidence

- Runtime: Homebrew ClamAV 1.5.4, official signature set 28156 dated 17 October 2026; signatures and scanner configuration remain ignored under `artifacts/documents-clamav/`.
- `/opt/homebrew/bin/clamscan --database=artifacts/documents-clamav/signatures /private/tmp/vschool-doc-safe.pdf` returned CLEAN and exit 0 for a 46-byte fictional PDF.
- The same scanner invocation for the exact 68-byte standard EICAR fixture returned `Eicar-Test-Signature FOUND` and exit 1.
- Missing, stale or failed scanner configuration records an explicit unavailable result and cannot create a downloadable version. The earlier malformed EICAR attempt is not counted as evidence.

## Verification

- `pnpm typecheck` — passed.
- `pnpm check:backend` — passed.
- `pnpm check:db-design` — 196 registered contracts passed.
- `pnpm test:functional test/functional/documents.test.ts` — 5/5 passed against `vyapti_vschool_test` with 116 migrations.
- `pnpm test:functional test/functional/communication-notices.test.ts` — 6/6 passed, including exact scanned publication and denial after current-purpose revocation.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed for the current application changes before the final E2E-only locator edits.
- Focused Playwright rebuilt `.next-e2e` with the 4 GiB heap; desktop Chromium 1/1 and mobile Chromium 1/1 passed sequentially with one worker and real ClamAV.
- `pnpm demo:seed` — completed and a repeat completed without overwriting existing records; private IDs remain in ignored artifact files.

Two failed browser iterations are retained in the run record, not counted as passes: the first served a stale `.next-e2e` artifact; the next recorded `SIGNATURES_UNAVAILABLE` from a relative standalone path. An absolute E2E scanner path fixed that configuration. A later 404 exposed an incorrect staff-workspace precondition on Parent downloads; the gateway now derives scope from the trusted active grant and owner authorization. No timeout or authorization assertion was weakened.

## Visual inspection

The eight PNGs in this directory were directly inspected at 1440×1000 and 390×844. Author controls, secure-file state, exact-review facts, recipient download and responsive stacking are readable with no observed horizontal overflow. The reference dialog and production routes are intentionally different page compositions; the production screens preserve its staged purpose/audience, permitted-attachment, exact-preview and explicit-confirmation hierarchy. Font portability and native VoiceOver/NVDA remain untested gates.

## Release limits

This is fictional local synthetic data only. Production object storage/region/KMS, scanner service/update SLA, retention/deletion/legal hold/backup, TEN-03, native accessibility and human acceptance remain incomplete. No real pupil document or external delivery was used.
