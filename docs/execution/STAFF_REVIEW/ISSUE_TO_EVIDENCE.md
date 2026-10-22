# Corrected Staff review — issue-to-evidence matrix

Date: 22 October 2026 (Asia/Kolkata)

This matrix covers the local fictional review prototype. It is design evidence, not production verification. Human acceptance remains PENDING.

| Issue | Changed source or contract | Focused verification | Current screenshot | Remaining limit |
| --- | --- | --- | --- | --- |
| Unknown correction could recover the wrong section or mutable draft | `prototype/STAFF_WORKFLOWS.js`; `CTA_CONTRACTS.md`; `PROPOSED_LLD.md` | Person and Employee operations each freeze their submitted section, expected version and original key; recovery applies that exact operation | `correction-personal-recovered-desktop-1440x1000.png` | PD-STF-02 and owner commands remain unapproved/unimplemented |
| Editing the other section could corrupt an unresolved operation | Same sources | Other section remains editable; exact unresolved section is disabled; recovery preserves the other draft | `correction-personal-recovered-desktop-1440x1000.png` | Prototype interaction evidence only |
| Repeated FOUND recovery could duplicate history | `prototype/STAFF_WORKFLOWS.js`; `ACCEPTANCE.md` | Repeated recovery produces one matching history entry | `correction-refresh-recovered-desktop-1440x1000.png` | Production must enforce this through the owner receipt, not browser memory |
| Stale feedback did not preserve both current and attempted facts | `prototype/STAFF_WORKFLOWS.js`; `CTA_CONTRACTS.md` | Stale email and staff-code cases keep separate current/attempted values and require explicit fresh review | `correction-stale-person-desktop-1440x1000.png`; `correction-stale-mobile-360x800.png` | Final mutable fields/authority await PD-STF-02 |
| Confirmed save plus failed refresh was presented as unresolved | `prototype/STAFF_WORKFLOWS.js`; recovery invariant in `CTA_CONTRACTS.md` | Close/Escape/reopen keeps “saved”; recovery performs read only and issues no second mutation | `correction-refresh-recovered-desktop-1440x1000.png` | Production GET-only recovery adapter is STF-04 work |
| Access outcome unknown could allow People employment ending to start | `prototype/STAFF_WORKFLOWS.js`; `EMPLOYMENT_END_FAILURE_CONTRACT.md`; `PROPOSED_LLD.md` | Unknown Access blocks People; original Access key is recovered; confirmed Access exposes only the missing People action | `employment-access-unknown-desktop-1440x1000.png`; `employment-access-unknown-mobile-390x844.png` | PD-STF-03 approval and production intent persistence required |
| No-membership case fabricated an Access key/receipt | Same employment sources | `NOT_REQUIRED` has no Access key/receipt; People completes independently after assignment checks | `employment-no-membership-desktop-1440x1000.png` | Proposed PD-STF-03 exception remains unapproved |
| Assignment conflict and successful completion used contradictory facts | `prototype/STAFF_WORKFLOWS.js`; `ACCEPTANCE.md` | Blocked scenario retains the named assignment and performs no operation; eligible scenario has no current/future assignment before success | `employment-assignment-blocked-desktop-1440x1000.png`; `employment-complete-profile-desktop-1440x1000.png` | Real Academics impact must be read at confirmation in production |
| Recovery crossing branch-local midnight could change the effective date | `EMPLOYMENT_END_FAILURE_CONTRACT.md`; `DECISION_REGISTER.md`; `PROPOSED_LLD.md` | Contract captures the branch-local date once in the reviewed intent and reuses it | Contract evidence only | Needs PD-STF-03 approval and PostgreSQL verification when implemented |
| Directory was wrapped in an unnecessary decorative card | `prototype/STAFF_WORKFLOWS.html`; `prototype/STAFF_WORKFLOWS.js` | Open directory/table composition inspected at desktop and intermediate widths | `directory-open-desktop-1440x1000.png`; `directory-open-intermediate-900x1000.png` | Prototype only; production unchanged |
| Profile Access/teaching panels stretched and repeated statuses | `prototype/STAFF_WORKFLOWS.html`; `prototype/STAFF_WORKFLOWS.js` | Panels align to content; duplicate status badges removed | `profile-content-sized-desktop-1440x1000.png` | Proposed Profile remains STF-03A work |
| Theme or responsive changes could alter geometry | Prototype HTML/CSS and bundled Inter asset | 1440×1000, 900×1000, 390×844, 360×800; Directory/Profile/Correction in all four themes; zero recorded root overflow | Theme files indexed in `PROTOTYPE_EVIDENCE.md` | Native AT and actual 200% zoom remain unperformed |

## Focused result

`prototype/evidence-operation-recovery/inspection.json` records **36 passed checks, 27 viewport captures and no page errors**. The prior evidence directories are historical and are excluded from the current acceptance set.

## Decision boundary

- PD-STF-01: exact existing-Person attestation grant, bounded candidate facts and restricted evidence retention.
- PD-STF-02: mutable Person/Employee fields, separate correction grants, reason and immutable histories.
- PD-STF-03: employment-end authority, Access-first intent, no-membership exception, captured date and recovery states.
- PD-STF-04: deferred rejoin/employment episodes; not needed by a mandatory active-employment flow.
