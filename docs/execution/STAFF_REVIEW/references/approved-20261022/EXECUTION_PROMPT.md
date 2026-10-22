# Execute the approved Administrator → Staff UX reference

You are the Principal Engineer implementing an approved, frozen reference in vyapti_vschool. Complete the bounded Staff scope end to end with self-review before handoff. Do not redesign the reference, broaden into other modules, or stop after a successful build and call the work complete.

## 1. Start with the actual source and acceptance contract
Read AGENTS.md, the UX Constitution, current Staff state, Staff review/handoff, People/Access/Academics owner contracts and relevant ADRs only. Record current HEAD, executable source and dirty working-tree baseline. Preserve unrelated changes. Do not reset screenshots or clean unrelated files.

Find the attached `VSchool_Staff_Approved_Handoff_20261022.zip`. Extract it under `docs/execution/STAFF_REVIEW/references/approved-20261022/`. Verify REFERENCE_MANIFEST.json hashes. Open the local mock before writing production UI. Use the exact local reference for all comparisons; an inaccessible hosted URL is not a blocker because all source/assets are bundled. Do not regenerate or replace the approved reference.

Read START_HERE.md and this prompt before older supporting notes. Reference source commit is fc33c8b991134ade6d02e27fbe467ef67d86b085. This is a Site commit, not an application baseline.

Create one concise implementation matrix: reference state, existing route/component, owner read/command, permission/eligibility, planned change, verification, and final status. Do not recreate the entire project inventory. Resolve routine engineering details independently using existing contracts. Do not reopen previously settled decisions.

## 2. Bounded scope
Implement the approved composition and every currently authorized counterpart of these connected journeys:
1. Staff directory: supported search attributes, filters, sort, pagination, empty/error/loading states, URL and Back/Forward restoration.
2. Name → Staff Profile; Manage → contextual action selector → appropriate action. Preserve return query.
3. Add staff using approved new/existing identity paths, inline validation, duplicate handling, successful navigation to the authoritative Profile.
4. Staff Profile: correct personal/employment/access information, content-sized sections, scoped actions and honest unavailable/empty states.
5. Personal correction and Employment correction, where owner-approved: Save/Cancel, independent drafts, mandatory reasons when contracted, stale review, exact retry and recovery.
6. Staff access directory: Account/Roles/Account status/Branch access/Invitation/Actions; existing permissions and owner pagination.
7. Exact Employee selection and independent identity verification for existing access grant/binding commands. No display-name/email shortcut that weakens identity verification.
8. Existing invitation/activation paths for the institution's real trust mode, including independent invitations if supported, review/resend and delivery failure.
9. Existing role change, suspension, reinstatement and revocation actions when authorized, with consequential review and last-administrator safeguards.
10. Connected recovery, drawer Close/Escape/reopen, and successful mutations followed by failed refreshes.

Existing dated teaching eligibility remains authoritative. Do not add new eligibility, availability, employment-ending or rejoining policies merely because a previous prototype mentions them. Preserve already authorized existing functionality through its existing reachable destination; list it as outside this presentation scope where appropriate.

PD-STF-01–03 and STF-01B are not approved by this prompt. Determine their actual current repository status. If a capability lacks an approved owner contract, identify the exact missing decision, omit or eligibility-disable its production action honestly, and complete all independent authorized items. Do not infer that all historical blockers still apply, nor silently claim they are resolved. No fabricated counts, grants or backend behavior.

## 3. Exact presentation implementation
Treat the supplied HTML/CSS/JS-rendered DOM and assets as the reference, not inspiration. Extract computed dimensions into a short token/component map. Reuse existing production primitives when they can match; add bounded Staff variants when needed. Avoid broad global CSS changes that regress Students or other workspaces.

Match: page insets and width; sidebar/local navigation; title hierarchy; section order; column widths and text alignment; avatar size; gaps; row height; toolbar/control dimensions; font family/weights/line heights; semantic colours; borders/radii; icons and their stroke/size; button hierarchy; drawer/dialog geometry; footer placement; and responsive stacking. Use the bundled licensed Inter only through the project's approved font pipeline. Preserve the existing four themes and default Forest. No palette reinterpretation.

Use the exact reference SVG geometry or an existing canonical equivalent verified visually. Keep Manage styling consistent with Students. Actions headings and cells align left. Name/Account headings align to the name text, with responsive adjustment when avatars disappear. Keep Save labels concise without deleting required validation, eligibility or consequential-action information.

Pagination must use the approved quiet footer and real owner query contracts. Do not paginate only a fetched subset in the browser. Defaults/options are 25/50/100 only where supported. Preserve signed cursors, deterministic ordering, filter binding, branch scope and URL return state. If authorized total counts are unavailable, use a truthful range/loaded-count variant and document the precise difference; do not add an expensive count or invent pages just for visual parity. Preserve current results on page-load failure with retry. Changing page size/search/filter/sort resets the cursor appropriately. Fixtures should demonstrate both multiple pages and a single-page result; do not insert the mock's fictional people into real data.

Mock review tools, preset outcomes and fictional data must remain reference-only. Keep existing production status/permission behavior even when a screenshot uses a simpler state.

## 4. Preserve architecture and correctness
Keep hexagonal boundaries: UI → application port → owner adapter/repository. No UI-to-database shortcuts, cross-owner table writes, schema reset or rewritten migrations. No schema changes for cosmetic parity. Recheck current tenant, institution, branch, membership, capability, module and resource authorization on the server. Keep account/Person/Employee identities separate. Preserve optimistic concurrency, immutable evidence, audit redaction, idempotency and recovery authorization. No client trust claims or simulated production success.

For UNKNOWN outcomes retain the exact original target, payload, version and idempotency key. Do not issue a different mutation or falsely report failure. Preserve the operation across Close/Escape/reopen as supported by the owner contract; do not claim reload-safe recovery unless it exists. While either Personal/Employment correction is UNKNOWN, block both Save commands while retaining both drafts. After authoritative resolution release the appropriate guard. A confirmed save followed by a failed GET must remain Saved; Refresh details performs GET only. Reopening must not restore an actionable completed mutation form. Stale reviews show current and attempted values and obtain fresh confirmation/version before a changed retry. Loss of authority must not leak protected values or receipts.

Routine reversible edits do not gain extra confirmation screens. Preserve required review for consequential access changes. Use accessible dialogs/drawers with title, focus containment, Escape handling, dirty-close protection and focus return. Put errors/recovery in the active interaction surface. No browser alert/prompt substitution.

## 5. Verify before calling the work done
Use matching reference/application states, data lengths and viewports at 1440×1000, 900×1000, 390×844 and 360×800. Compare Directory, second page, Profile, Add, Personal edit, Employment edit, Access directory, invitation review and recovery states. Inspect screenshots side by side and overlays where useful. Measure critical element bounds: matched geometry should be within 2 CSS px where content is equivalent; document font rasterization/content differences. Do not reduce visual verification to no-overflow checks or bless a new application screenshot as the reference.

Check all four themes on the directory/Profile/access surfaces; test expanded and mobile navigation, keyboard order/focus, long names/email, empty results, errors and responsive wrapping. Target WCAG 2.2 AA; distinguish automated checks from actual browser zoom and native assistive-technology tests.

Run focused unit/real-PostgreSQL/browser tests for changed behavior: scoped reads, foreign-scope denial, permission restrictions, identity linkage, duplicate prevention, current owner versions, exact unknown replay, stale retry, cross-section draft preservation, committed-save/failed-refresh, Close/Escape/reopen, query restoration, page boundaries and state-specific Access actions. Reuse valid unchanged evidence only with clear source provenance. Never claim stalled/skipped tests passed.

Use exact test-file arguments supported by repository wrappers; avoid accidental broad suites. Run browser tests sequentially with one worker; reuse unchanged builds. Use the established 4 GiB build heap if needed; keep only one demo/test server per required purpose. Run required gates and classify existing failures against the baseline, without editing unrelated files to make checks green.

Perform a separate final self-review pass against every matrix row. Fix all discovered in-scope defects before handoff. Continue through all authorized items rather than stopping at the first checkpoint. If a genuine blocker remains, continue the other items and report it precisely. Do not promise eight hours of execution or production readiness.

## 6. Final deliverable
Commit only intended files and serve the verified current-source demo. Provide: application/evidence commits, build ID, health result, credential FILE paths only, short connected walkthrough, complete per-journey status matrix, direct reference/application comparisons, functional/security evidence, exact deviations/blockers and a sanitized review ZIP with the frozen reference and checksums. Exclude credentials, tokens, environments, private fixtures, session state, database dumps, traces and caches.

Report functional verification, visual fidelity and human production acceptance separately. The user has approved the supplied mock; acceptance of the resulting production implementation is still pending. Do not relabel the whole Staff module complete if only this scope is complete. TEN-03, native accessibility and other production gates remain separate and must not be weakened. Do not send real emails, grant real external access, deploy VSchool, or purchase/configure providers under this instruction.
