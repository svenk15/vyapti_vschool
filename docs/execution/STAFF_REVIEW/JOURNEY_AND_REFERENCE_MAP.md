# Staff journey and reference map

The approved HTML is a workflow explorer and directory reference, not a complete production specification for every recovery state. `STAFF_PROPOSAL.html` is the earlier audit aid. The executable prototype in `prototype/STAFF_WORKFLOWS.html` is the proposed production composition and labels extensions.

| Journey | Current route/action | Approved reference | Proposed production composition | Status in prototype |
|---|---|---|---|---|
| Find Staff | `/admin/teachers` | `VSchool_School_Admin_Review.html#/staff`; `module-staff.md` | Staff area → Profiles; URL-backed name/code search, filter/sort drawers, paged table | Interactive |
| Add new Staff | `/admin/teachers/create` | SA-13 | Focused single page with New person default; access remains optional follow-up | Interactive |
| Reuse existing Person | None | SA-13 identity invariant | Exact ID resolve → bounded facts → explicit attestation → create Employee only | Demonstrated, marked awaiting PD-STF-01 |
| Staff profile | Current Manage dialog | `#/staff/:id` | Header plus Employment, Responsibilities and Access sections; current/history tabs | Interactive extension |
| Correct details | Category in Manage dialog | Staff record expectation; no exact recovery reference | One drawer with Person/Employee sections, owner-specific Save, retained other draft, stale/unknown/refresh states | Interactive extension, PD-STF-02 |
| Teacher eligibility | Enable teaching in Manage dialog | SA-16 | Dated eligibility panel, assignment impact, Academics handoff | Interactive; contract approved, persistence proposed |
| Teaching responsibilities | `/admin/classes` | SA-16 follow-through | Profile summary with link to exact assignment context | Interactive handoff |
| Grant access | `/admin/users/grant` | SA-14 | Employee-context Access panel leading to the existing staged grant | Interactive handoff; owner behavior already verified |
| Review/resend access | `/admin/users`, `/admin/users/change` | SA-15/SA-17 | Employee-context states and reasoned resend/change flows | Interactive; reasoned resend is approved engineering |
| End employment | Current Manage dialog | Staff lifecycle requirement; no complete exact reference | End-today review showing Teacher, assignments and Access disposition before confirm | Interactive recommendation; PD-STF-03 |
| Rejoin | None | No complete current UI reference | New employment episode, then separate access/eligibility decisions | Documented only; PD-STF-04 |
| Availability | `/admin/teachers/availability` | Shared Staff recipe | Conditional profile handoff; existing explicit recorder authority retained | Interactive handoff |
| Cover | `/admin/timetable/cover` | TT-07 approved flow | Exact-occurrence handoff only | Interactive handoff |

## Current and proposed connected journeys

```text
CURRENT
Staff directory
  ├─ Add staff → creates new Person + Employee
  ├─ Manage dialog → category / enable teaching / bind account / end today
  ├─ Access tab → separate Access directory and staged commands
  └─ Availability tab → explicit recorder workflow

PROPOSED
Staff directory (query in URL)
  ├─ Add staff
  │   ├─ New Person → Employee receipt → Profile
  │   └─ Exact Person ID → attestation → Employee receipt → Profile [PD-STF-01]
  └─ Staff profile
      ├─ Correct details drawer [PD-STF-02]
      ├─ Teaching eligibility → assignment-impact review → Academics
      ├─ Access state → grant / resend / roles / suspend / reinstate / revoke
      ├─ Availability → existing recorder route
      ├─ Cover → existing exact-occurrence route
      └─ End employment → impact + required Access disposition [PD-STF-03]
```

## Return and context rules

- Directory query parameters are safe validated presentation state; protected record data remains server fetched.
- Profile and owner handoffs retain `returnTo` only after server-side validation against the Staff area allowlist.
- Old-scope responses cannot overwrite a newly selected branch.
- Dialog/drawer close returns focus to the invoking action. After confirmed save plus refresh failure, close preserves the saved result and offers GET-only recovery on return.
- Unknown mutation outcomes retain the original payload/key; a new intent is blocked until resolved.
