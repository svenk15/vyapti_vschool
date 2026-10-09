# Families — current design state

Edition 02 · 8 October 2026. The offline design pack is updated; the application repository has not been assessed or changed.

| Journey | Design / offline prototype | Production implementation | Human review |
|---|---|---|---|
| SA-32 | Integrated form, student entry, validation, draft/resume | NOT_ASSESSED | PENDING |
| SA-33 | Invite, failed delivery, resend, expiry, policy and parent handoff | NOT_ASSESSED | PENDING |
| SA-34 | Date revision, portal removal, school relationship end, history | NOT_ASSESSED | PENDING |
| SA-37 access-help category | Parent claim → school queue → separate verification | NOT_ASSESSED | PENDING |
| PAR-01/04/05/06 handoff | Labeled fictional acceptance / child / attendance preview | NOT_ASSESSED | PENDING |

Evidence: root qa-evidence.json for Node/template checks and browser-evidence.json for actual Chromium desktop/mobile tests. Read both; neither is real database/security verification. Source files are source/family.js, source/family.css plus integration points in source/app.js/build.py. All prototype state resets on reload.

Next repository checkpoint: SA-IMPL-32.A, only after reconciling current owner/task dependencies. Remaining implementation design work includes exact existing table/column/FK/index mapping, verified identity binding, privileged trust transitions, account-wide recovery across guardian bindings, protected evidence retention, concurrency, expiry/renewal, real delivery, SQL authorization and accessibility review. Native Figma, VoiceOver/NVDA, production readiness and human acceptance are not claimed.

The new prototype contains no replacement IAM recovery path, RLS implementation or operator impersonation grant. TEN-03 and all real release gates stay unchanged.
