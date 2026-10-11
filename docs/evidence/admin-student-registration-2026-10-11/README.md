# SA-18 Administrator student registration

Engineering comparison captured 11 October 2026. Human visual acceptance remains **PENDING**.

## Authority and routes

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-18`.
- Embedded contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-18.md` and its selected screen specifications.
- Production route: `/admin/students/register`, reached from the Students directory.

## Implemented comparison

- Replaced the directory overlay as the primary entry with a dedicated authorized page matching the approved Identity, School record, Review identity and Confirm composition.
- Retained the accepted branch admission-date meaning and the existing atomic Students command. New Person creation or an exact existing Person selection commits through the same scoped transaction, idempotency, validation and rollback contracts.
- Existing identity lookup remains exact Person ID or exact current-branch admission number. Names and email are never used to select or merge an identity.
- Added a successful registration receipt with the persisted identity facts and explicit links back to the directory or the authorized Student record.
- Duplicate/racing admission numbers leave no orphan Person and offer the existing Student link only when the server can resolve that exact record in the current authorized scope.
- Keyboard focus follows workflow changes. Cancel preserves the validated Students return URL. Draft remains visibly disabled because no accepted persistence/resume contract exists.

## Verification

- Focused ESLint and TypeScript checks passed.
- The final changed desktop/mobile registration journey passed 2/2 with Playwright against guarded real PostgreSQL `vyapti_vschool_test`. It proves create/persist/reload, explicit admission-number directory search, duplicate rollback and recovery, exact existing-Person registration and foreign-profile denial.
- In the preceding full-file run, the four unchanged authorization and exact-selection cases passed; the two registration cases exposed a stale combined-search test assumption. The test now selects the documented Admission number attribute, and the final changed cases passed without weakening product assertions.
- Reference and application entry states were captured at desktop and mobile sizes. Application receipt states were also captured and visually inspected.
- No backend contract, schema, migration, seed or development-database row changed.

## Evidence

- `reference-sa-18-entry-desktop.png`, `reference-sa-18-entry-mobile.png`
- `application-sa-18-entry-chromium.png`, `application-sa-18-entry-mobile.png`
- `application-sa-18-receipt-chromium.png`, `application-sa-18-receipt-mobile.png`

## Remaining deviations

- The prototype starts with an unselected identity mode; production defaults to the safe new-Person path and requires an explicit switch before exact identity reuse.
- Production uses the enabled route set and real account/school data, so prototype-only navigation, review banner and fictional identities are absent.
- Draft persistence/resume is not implemented because its ownership and lifecycle contract remains unresolved. Human comparison and acceptance remain pending.
