# Communication & Notices — current state

Edition 03 · 8 October 2026. This state describes the design pack, not the production repository.

| Scope | Offline design / prototype | Production code | Human review |
|---|---|---|---|
| SA-35 composition, recipients, publishing and scheduling | CONNECTED_PROTOTYPE | NOT_ASSESSED | PENDING |
| Teacher TEA-18 approval handoff | CONNECTED_PROTOTYPE | NOT_ASSESSED | PENDING |
| Parent PAR-14 / teacher TEA-17 read and acknowledgement | CONNECTED_PROTOTYPE | NOT_ASSESSED | PENDING |
| SA-36 delivery recovery, reminders, corrections, withdrawal, offline response | CONNECTED_PROTOTYPE | NOT_ASSESSED | PENDING |
| Family separate notice purpose | EXPLICIT_PROTOTYPE_SELECTION | NOT_ASSESSED | PENDING |
| SA-37 requests, secure attachments, private conversations, meetings | PRESERVED_LATER_CONTRACTS | NOT_ASSESSED | PENDING |

Evidence: root `communication-browser-evidence.json` covers new connected notice cases; `browser-evidence.json` covers administrator route renders and family regressions; `qa-evidence.json` covers Node/controller/template checks. Read the actual reports and their scope. They do not prove SQL isolation, real authentication, provider delivery or accessibility conformance.

Source: `source/communication.js`, `source/communication.css`, shared `source/app.js`, `source/family.js`, catalog/build and edition03 document overlay. Rebuild with source/rebuild.py. The interactive review defaults to Communication with Families/Communication visible. State resets on reload; date is fixed to 2026-10-08 unless review tools advance the demo clock.

Next implementation checkpoint: SA-IMPL-35.A after reading the real repository state. Settle schema mappings, capabilities, notice-purpose identity/version contract, account-based audience, production worker/provider semantics, retention, delivery preferences and quiet-hour/reminder policies before migration. TEN-03 and current security/acceptance gates remain unchanged. No live data or real application repository was changed.
