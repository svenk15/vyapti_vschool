# Proposed Bible addendum — Teacher workspace

Status: proposed UX addendum. Reconcile with the current Bible before appending; do not overwrite current decisions or implementation evidence.

The Teacher workspace composes existing bounded contexts through server-authorized, minimal read models. Phase 1 prioritizes school-specific entry, current branch and teaching day, assigned classes, exact session attendance and acknowledged receipts. Every pupil begins unmarked; a deliberate bulk action preserves exceptions. Full-roster validation is independent of visible filters. Submitted attendance is read-only to the Teacher role and correction ownership stays with the school administrator.

Future teaching capabilities are enabled per institution and branch and further restricted by actor purpose/assignment. Phase 2 adds guardian-aware communication; guardian verification stays in the School Administrator workflow. Phase 3 adds published timetable, cover, learning work and feedback. Phase 4 adds marks entry and controlled moderation/publication. Phase 5 does not grant Teacher access to financial records. Phase 6 adds independently enabled staff/resource/duty/referral services. Phase 7 adds reviewed AI drafts with current permission-filtered evidence.

All personas share theme tokens, navigation language, component geometry and search/filter/sort interactions. The Teacher workspace has its own task-focused information hierarchy. UX implementation must be evaluated on composed screens, not merely a component showroom.

Proposed extensions requiring explicit scope reconciliation: offline-assisted attendance, structured correction requests, family meeting scheduling, schedule/lesson handoffs and assigned operational duty journeys. Their presence in a design prototype does not release or enable them.

Source links: PRODUCT_SCOPE.md, UX_SYSTEM.md, ARCHITECTURE_HANDOFF.md and module DESIGN/TASKS/CURRENT_STATE documents. Preserve existing security, TEN-03 and human-acceptance gates. Add a dated Bible changelog entry only when the reconciled proposal is accepted into the repository.
