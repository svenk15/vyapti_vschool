# Screen and interaction contracts

Routes below are prototype hash routes, not instructions to replace existing production URLs.

| Screen | Entry and main action | State / data contract |
|---|---|---|
| `#/sign-in` | Branded entry; sign in or account help | Safe redirect, generic rejection, permitted recovery, expiry; fictional demo button is prototype-only |
| `#/home` | Authorized default; open exception | Branch scope, submission completeness, source receipts; no data from another branch |
| `#/setup` | First-use home or settings | Derived prerequisites for enabled modules, owner handoff, links to actual setup |
| `#/students` | Directory; Register student | Attribute search name/admission number; class and status filters; deterministic sorting/paging |
| `#/student/:id/:tab` | Student link | Identity, enrollment, session attendance; optional family/documents; per-panel permissions |
| `#/staff` / `#/staff/:id` | Directory / profile | Employee, verified binding, membership, invitation and eligibility separated |
| `#/academics` / `#/class/:id` | Year/class setup | Calendar, section, offering, teacher/date assignment; impact review before change |
| `#/imports` / `#/import/:id` | Upload/preview → row outcomes | No preview domain writes; explicit partial success; resume only remaining rows |
| `#/attendance` / `#/session/:id` | Session directory → exact roster | Scheduled/open/submitted/cancelled distinct; admin correction, no default teacher impersonation |
| `#/reports` | Period/class → result → export | Scope, as-of, numerator/denominator, missing data and matching export |
| `#/settings/:tab` | School information / branding / modules | Time zone immutable; token preview; institution-managed actions routed to owner |
| `#/activity` / `#/event/:id` | Sibling navigation / event | Branch-safe metadata, no raw imports, hashes, passwords or restricted narratives |
| `#/families` | Verified relationship worklist | Child-specific grant, invitation, purpose and revocation |
| `#/flow/SA-xx` | Named action | Defined step fields, validation, confirm, draft/leave, receipt and recovery |
| `#/drafts` | Own in-progress work | Owner/branch scope, nonempty save only, resume/discard; prototype memory only |
| Optional service homes | Enabled/authorized module | Clear next actions and explicit restricted authority; phase-aware review |

Directory query: `by=<allowlisted attribute>&q=<value>&status=<repeated>&class=<repeated>&sort=<allowlisted field>&order=asc|desc&page=<positive>`. Enter applies search; changing filters/sort resets pagination; Cancel changes nothing. In production whitelist server query keys and enforce bounded paging, not arbitrary client SQL fields.

Each screen needs loading, first-use empty, no-results, validation, load failure, write failure, stale write, permission loss, expired session, long content, narrow viewport and zoom review. Use safe default ordering with stable ID ties. Date predicates use branch-local civil date policy, not the browser’s locale as authority.

The prototype implements representative real in-memory changes for student/staff creation, enrollment, correction, settings and branch context. Other workflows record review receipts and illustrate the contract. No actual upload parsing, account policy, payment, send, background worker or authorization service runs in this HTML. Those need real functional tests in the product repository.

<!-- EDITION02 -->
## Edition 02 — family surfaces
`#/families` → Connections / Invitations / Access requests / Family history. `#/flow/SA-32` starts the connected form; `?student=s2` preselects the exact branch student. `#/flow/SA-33` and SA-34 choose existing connections. `#/student/s2/family` reads the same connection store. The review tools expose a labeled parent handoff; they must not ship as product impersonation controls.

Changing branch swaps the whole family store and draft context. School scope controls the student choices. Blank submit, failed delivery, replacement, expiry, wrong account, date revision, removed/end state and request receipt are reviewable. Last day of access is inclusive in the form, exclusive in stored effective intervals. Back/Continue stays separate from Save draft and leave. Destructive actions name child and adult; private evidence never appears in shared history.

<!-- EDITION03 -->
## Edition 03 communication entry and states
Default route is `#/communication`; `#/communication/compose`, `/drafts`, `/detail/NOTICE-108` and `/follow-up` share the existing shell. SA-35/36 open these connected journeys. Labeled parent/teacher preview opens `/inbox` and `/read/<notice>` under the same review artifact; production resolves authenticated actor workspaces through their existing routes.

Important states: zero eligible audience, attendance-only exclusion, stale audience/draft, blank validation, saved draft, teacher changes requested, Published/Scheduled/NeedsReview, Failed/Unknown/Suppressed email, Unread/Read/Acknowledged, updated version, withdrawn content, canceled schedule, unknown publication and wrong account/branch. One outcome cannot stand in for another. Existing SA-37 request UI remains available as a linked design contract.
