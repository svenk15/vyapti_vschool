# Student school-notice projection — decision boundary

Last reconciled: 15 October 2026. Status: **BLOCKED_PRODUCT_DECISION**. No capability, purpose, migration, route or UI is authorized by this document.

## Selected shared capability

COM-01 already delivers the complete school-side class-notice publication and Parent PAR-14 read/acknowledge journey. The next smallest projection is Student STW-27/STW-28 over that same immutable Communication notice.

Approved Student reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/messages/n1`, with guided states `#/flow/STW-27` and `#/flow/STW-28`.

## Existing approved rules

- The Student must be a server-verified account → Person → Student context with active dated Enrollment; Guardian authority is irrelevant.
- A notice is a published immutable version addressed to an authorized audience. Opening it may record read evidence, but never acknowledgement or consent.
- Acknowledgement is a deliberate response to the exact version, unique for that Student recipient/version. A correction may require a new response; a stale version returns to the current content.
- A retracted notice becomes unavailable with safe context. Attachments require their own reauthorized file owner and are not supplied by COM-01.
- The existing Administrator publisher remains the current `communication.publish` School Administrator plus explicit branch `CommunicationPublisherGrant`. Browser-provided audience identities never confer authority.

## Decisions required

| Exact question | Recommended answer | Consequences and alternatives | Workflows |
|---|---|---|---|
| Who grants Student notice access? | Add an independent optional `communication.notice.read_self` purpose to an exact StudentPortalAccess. Only the already-designated `student.access.manage` Administrator may select it during authorization or a separately versioned access change. Do not backfill existing links. | Automatic inclusion in the fixed three-purpose bundle is simpler but silently broadens all existing Student accounts. Operator-only provisioning is safer but makes ordinary school onboarding unusable. | STW-27, STW-28 |
| Which Students enter a class audience? | At publication, resolve active Students whose dated Enrollment and Placement match the exact Section; include only accepted, non-revoked portal links carrying the new purpose. Freeze Student recipient bindings beside Parent bindings and deduplicate only the same Account/Student binding. | Dynamic audiences can expose a notice to a later transfer or hide evidence from an original recipient. Email/admission-number matching is not authority. | SA-35, STW-27 |
| What changes after transfer or portal revocation? | Preserve the frozen publication membership. A later class transfer neither adds nor removes that historical manifest entry, but every read/acknowledgement still requires the exact active Student portal link, purpose and active school Enrollment. Revocation denies immediately; restoring access does not recreate missed manifests. | Rechecking current Section would erase access to a notice legitimately received before transfer. Granting historical notices to newly activated accounts broadens audience after publication. | STW-27, STW-28 |
| What identifies one acknowledgement? | Store a typed Student recipient binding to StudentPortalAccess + Student and require one acknowledgement for the exact current version and recipient account. Reauthorize that binding before receipt replay. | Account-only evidence lacks the owner provenance required for Student-versus-Guardian contexts. A Student-ID-only acknowledgement cannot prove the acting account. | STW-28 |
| How are corrections and retractions exposed? | Current-version detail only. A correction appends a new immutable version and new manifest; prior acknowledgement remains attached to the prior version. Withdrawal blocks body reads and shows a safe withdrawn state. No automatic expiry in this slice. | Hiding all trace after withdrawal contradicts the approved safe-context recovery. Mutable replacement destroys prior evidence. Expiry needs a separate retention/visibility rule. | SA-35/SA-36, STW-27, STW-28 |
| Are attachments included? | No. Deliver text notices first and keep STW-27 explicitly partial for attachments until a scanned file owner, recipient grants and expiring download contract exist. | Treating a URL or database blob as an attachment bypasses the required owner and reauthorization. | STW-27 |

## Narrow execution package after approval

1. **COM-02A — Student notice purpose:** extend the Students owner contract, authorization UI and purpose CHECK with a forward migration; verify no implicit grant/backfill and revocation isolation.
2. **COM-02B — Typed Student recipients:** extend Communication recipient-binding provenance with a forward migration, publish Parent and Student manifests atomically and preserve existing Parent results/replay.
3. **COM-02C — Student inbox/detail/read/acknowledge:** add thin Student routes/gateway/screens using the existing Student shell and exact current-version semantics; list/detail start from authenticated Student recipient bindings.
4. **COM-02D — Safe withdrawal/current-version recovery:** add the approved Administrator command and safe Student unavailable state if withdrawal authority is confirmed. Attachments remain a separately blocked sub-slice.

Focused acceptance after approval: class Student with exact purpose receives the notice; same-class Student without it, another class, branch and tenant do not; Parent and Student grants do not substitute for each other; transfer preserves frozen provenance; revocation denies an open page; same acknowledgement intent replays and changed payload conflicts; correction requires current-version review; withdrawal hides the body; desktop/mobile reference comparison is direct.

## Calendar/Events fallback

Calendar/Events is not a safe bypass. PAR-18 calls `published calendar audience for child` a future design label, not a live grant, and requires changed/cancelled version history and reauthorized export. PAR-19 explicitly marks response authority as proposed. It therefore remains behind its own audience-purpose, publisher, update/cancellation and retention decisions.
