# SA-02 activation and recovery help

Functional/security verification is **VERIFIED** for the checkpoint containing this record. Direct reference comparison is complete; human visual acceptance remains **PENDING**.

## Contract and implementation

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-02`.
- Measured workflow/screen: `implementation-spec/administrator/workflows/SA-02.md` and `screens/SA-02-entry.md`.
- Production routes: `/forgot-password`, `/activate`, `/invite` and `/reset-password`.
- Owner behavior: existing IAM-03 activation and IAM-04 invitation/password-reset contracts. No backend port, persistence adapter, table, migration, authorization rule or seed changed.

`/forgot-password` now implements Request access help → Next steps → Confirm. It retains email, help choice and acknowledgement across Back/Continue. Reset issues the existing generic account-wide request only on final confirmation. Invited-account help creates no reset/activation record and does not imply an invitation exists; it returns the same generic verified-channel receipt. Known, unknown and policy-ineligible requests therefore remain indistinguishable.

The existing token consumers retain hash-only storage, expiry/revocation/consumption checks, secret clearing, invitation resend rotation, password-reset session revocation and generic denial. The disabled prototype draft control is honest because no durable public recovery draft is contracted.

## Verification

- Focused ESLint and TypeScript checks passed.
- Initial current-source PostgreSQL-backed Playwright run passed 6/6 desktop/mobile for successful reset and old-session revocation, no fabricated activation-help write, generic unknown recovery with Back retention, and invalid-invitation secret clearing.
- The final focused PostgreSQL-backed Playwright run passed 8/8 desktop/mobile checks for the three SA-02 recovery scenarios and the affected SA-01 shared workflow-action consumer. The harness built the production application and used `vyapti_vschool_test` with all 38 migrations current.
- Existing IAM-03/IAM-04 real-PostgreSQL evidence remains applicable to token hashing, transactions, races, recovery policy and replay because those layers were unchanged.

## Visual inspection

Reference and application were captured in Chromium at 1440×1000 and 390×844, device scale factor 1, light scheme, reduced motion, `en-GB` and `Asia/Kolkata`. The approved HTML was served unchanged. Request, acknowledgement, confirmation and application receipt states were inspected directly for stage hierarchy, labels, control geometry, action sizes, wrapping, disabled state and overflow.

- `reference-{request,next,confirm}-{desktop,mobile}.png`
- `application-request-before-{desktop,mobile}.png`
- `application-{request,next,confirm,receipt}-{chromium,mobile}.png`

The workflow body follows the approved stages. Production keeps the public auth shell rather than the prototype's protected Administrator navigation before identity exists; this is an explicit security-boundary difference and remains unaccepted visually. The documented font fallback, native browser zoom, VoiceOver and NVDA also remain outstanding.

## Manual demo

Open `http://127.0.0.1:3470/forgot-password`. For **Reset password**, enter a fictional address, acknowledge the verified channel, review and confirm; expect the same generic receipt for known and unknown accounts. For **Activate invited account**, repeat the stages; expect the same receipt and no claim that an invitation exists. Actual activation/invitation consumption still requires the private verified token/link. Credentials and tokens remain only in ignored artifact files. Human review remains PENDING.
