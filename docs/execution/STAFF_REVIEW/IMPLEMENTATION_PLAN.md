# Staff closure plan

This plan follows the audited owner contracts. It is not implementation authorization for missing product rules. Existing verified backend evidence should be reused when the relevant code remains unchanged.

## Prioritized first-release gaps

| Priority | Category | Gap | User impact | Dependency |
|---:|---|---|---|---|
| 1 | Functional | Directory search attributes, filters, sort and URL-backed pagination | Administrators cannot reliably find or return to a Staff record in a larger branch | Engineering-ready People query/UI extension |
| 2 | Recovery/security | Unknown outcome, committed-save/failed-refresh and reviewed stale retry | An administrator can be told a confirmed write is unresolved or be encouraged to create a new intent | Existing owner receipts/CAS; engineering-ready presentation adapters |
| 3 | Functional | Exact existing-Person → Employee linkage | Cross-branch or previously established people can be duplicated because Add staff only creates a new Person | Narrow People LLD plus attestation/evidence decision |
| 4 | Functional | Authoritative Staff profile and permitted corrections | Current state is scattered across a directory dialog and Academics/Access pages | Profile composition ports; correction policy decision |
| 5 | Functional | Dated Teacher eligibility and assignment impact | Boolean eligibility cannot enforce the approved effective window | Academics LLD and forward migration |
| 6 | Functional | Complete invitation review and employment lifecycle | Resend/history and leave/reactivation consequences are incomplete | Access reason contract; employment/access product decision |
| 7 | UX | Current-source reference pass for all changed shared consumers | Earlier captures do not prove today’s shared CSS/navigation rendering | Follow each implemented slice; one worker, sequential viewports |
| 8 | Verification | Missing recovery, full lifecycle and existing-Person scenarios | Current aggregate matrix can overstate completion | Focused unit/PostgreSQL/browser evidence |

## Combined gap plan

- **Functional gaps:** STF-01 directory query; STF-02 exact Person linkage; STF-03 profile/corrections; STF-05 dated eligibility; STF-06 invitation review; STF-07 employment lifecycle.
- **Recovery/security defects:** STF-04 exact-intent recovery, authorization-before-replay, confirmed-save/read-refresh separation, reviewed stale retry and honest post-commit delivery outcomes.
- **UX corrections:** current-source comparison of the directory and SA-13–SA-17 compositions after later shared presentation changes; dedicated Staff profile; Employee-context links among Access, eligibility and assignments; complete keyboard/focus/return behavior.
- **Verification gaps:** current-source visual comparison, existing-Person concurrency, profile correction history, dated eligibility impacts, resend expired/used/wrong-account states, employment/access coordination and the full mutation recovery matrix.

## Priority 1 — engineering-ready corrections

### STF-01 — Server-backed directory controls and query state

Extend the People list query without changing identity resolution:

- Supported search attributes: `name` (first/last display fields) and `employeeCode` (exact/prefix policy defined in the existing query LLD).
- Filters: descriptive category/responsibility, employment state, access state and teaching state only where each is already projected from the current scoped query.
- Sort: name, Employee code and supported state fields with `id` as the final deterministic tie-breaker.
- Put only validated safe query values in the URL; cursor must remain signed and query-bound. Back/Forward and returning from a record must restore the query.
- Add Previous only if the cursor contract supplies a safe reverse token; otherwise use numbered/forward navigation whose limitations are stated accurately.
- Never sort only the loaded page and never broaden Person lookup.

Focused verification: query validation, deterministic pagination under duplicate names, cross-branch denial, tampered cursor, Back/Forward, mobile drawers and focus return.

### STF-04 — Per-owner browser recovery integration

Introduce a small presentation state shared by the Staff screens, while continuing to use each owner's existing receipt/CAS contract:

- `UNKNOWN`: retain the exact payload/key and offer only the owner's safe replay/status operation.
- `COMMITTED_REFRESH_FAILED`: retain confirmed saved feedback; retry GET only; never suggest resubmitting.
- `STALE_REVIEW_REQUIRED`: fetch current authorized state, show attempted versus current safe fields, and require an explicit fresh-key/fresh-version retry.
- `PARTIAL_DELIVERY`: show the committed membership/grant separately from the sanitized provider outcome.
- `DENIED`: clear protected inputs and return to an authorized context.

Apply first to new Staff creation and People Manage, then Access directory membership/resend. Do not introduce a universal receipt store or let UI state establish authority.

Focused verification: lost response with exact replay/no duplicate, commit then failed refresh/GET-only recovery, revoked authority before replay, stale version, close/Escape/focus return and preserved safe input.

## Priority 2 — narrow owner designs required

### STF-02 — Existing organization Person → branch Employee

Settled rules already available: no fuzzy merge; name/email are not proof; selection must use an exact authorized Person ID; branch Employee identity remains unique and scoped.

The narrow People LLD must still define:

- who can enumerate an existing Person for this purpose;
- the safe candidate DTO and explicit verification evidence;
- same-branch duplicate and cross-branch cases;
- command input, transaction, locks, receipt and audit redaction;
- whether the operation creates a new Employee only or also permits correction of a mistaken prior link.

No new product decision is needed to forbid fuzzy matching. A decision is needed only if the release must define who may attest the existing identity and what evidence is retained.

### STF-03 — Authoritative Staff profile and permitted corrections

Add one scoped People profile query that composes current People/Employee facts with typed Access and Academics projections. It must not read foreign owner tables directly.

One consolidated product decision is required for mutable fields:

1. Can staff number change, and must the previous value remain searchable/history-visible?
2. Can initial employment start date be corrected after assignments/Attendance exist?
3. Who may correct Person name/contact facts, and what reason/evidence is mandatory?
4. Which history is visible to a School administrator versus restricted operators?

Category correction is already settled and should be preserved.

### STF-05 — Dated Teacher eligibility

The approved SA-16 contract requires `eligibleFrom` and `eligibleUntil`; the current Academics Teacher row is only `active/version`. The Academics LLD must define interval persistence, overlap rules, assignment-range validation, impacted-assignment preview and safe disable/end behavior. Access role removal remains separate.

This is technical design under an approved reference rule unless the current release chooses to defer dated eligibility explicitly. Use a forward migration and populated PostgreSQL migration test if implemented.

### STF-06 — Employee-context invitation review

Reuse Access invitation storage and resend semantics. Add the administrator-supplied bounded reason to the approved resend command/evidence, exact Employee-context projection, and explicit pending/failed/expired/consumed state presentation. Do not expose tokens. Wrong-account consumption remains generic and public.

### STF-07 — Employment lifecycle

Current `endEmployment` is safe but deliberately narrow. A consolidated product decision is required for:

- statuses beyond ACTIVE/ENDED;
- future/retroactive effective dates;
- reactivation versus a new employment interval;
- assignment and open/frozen Attendance impact;
- required coordination with still-active Access membership.

Recommendation: preserve separation of employment and Access, but require an explicit impact review with a separate authorized Access action. Do not silently revoke, retain or reactivate portal access based solely on employment state.

## Cross-owner dependencies

| Dependency | Owner | Why it is needed | Decision or engineering? |
|---|---|---|---|
| Exact existing-Person selection and verification | People, with Access identity evidence contract | Prevent duplicate People while forbidding fuzzy merge | Narrow LLD; one attestation/evidence decision |
| Profile composition ports | People consuming minimal Access and Academics contracts | Show authoritative state without foreign-table reads | Engineering under existing ownership |
| Person/Employee correction policy | People | Determine mutable facts and retained history | Product decision |
| Dated eligibility interval | Academics | Constrain assignment validity and impact | Approved rule; narrow LLD/migration engineering unless explicitly deferred |
| Reasoned resend | Access | Complete SA-15 audit/recovery composition | Approved reference rule; engineering contract extension |
| Employment/access coordination | People + Access | Avoid accidental continued access or silent revocation | Product decision |
| Assignment impact/history projection | Academics | Staff responsibilities and safe eligibility changes | Engineering after dated eligibility/profile ports |
| Availability/cover | People + Academics + Attendance | Existing bounded operational flow | Already implemented; preserve |

## Verification plan

1. Unit: query normalization, field policy, recovery state transitions, interval/date validation.
2. Real PostgreSQL: scope, locks, CAS, exact replay, changed replay, rollback, cross-owner transaction enlistment, duplicate identity/Employee races, immutable histories.
3. Browser with one worker: directory URL state, new/existing Person creation, profile/corrections, eligibility/assignment impacts, invitation lifecycle, employment/access separation and all recovery states at desktop/mobile.
4. Visual: compare the exact Staff directory and SA-13–SA-17 reference states; label profile/recovery extensions where no exact reference exists.
5. Release gates: keep TEN-03, provider review, native accessibility and human acceptance separate.

## Exact next task

**STF-01 — Staff directory server query and URL state** is the smallest independently implementable slice. It needs no new product authority, does not change identity resolution, and closes a directly observed mismatch in search/filter/sort/pagination. STF-04 should follow before adding new mutations.
