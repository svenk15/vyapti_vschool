# Corrected Staff review — issue to evidence

Date: 22 October 2026 (Asia/Kolkata)

This table covers the local fictional review prototype. It is design evidence, not production verification. Human acceptance remains PENDING.

| Review issue | Correction | Evidence | Production status |
| --- | --- | --- | --- |
| Filter and Sort controls did not change results | Apply now evaluates the complete fictional record set; sort uses explicit state ranks and Employee ID as the final tie-breaker | `directory-filtered-desktop-1440x1000.png`; `directory-sorted-desktop-1440x1000.png`; focused checks 1–9 in `inspection.json` | People-native fields are ready for STF-01A. Teaching/Access need owner-published full-result projections before production controls are enabled. |
| Cancel/Escape changed or lost applied values | Drawer drafts are isolated from applied query state; Cancel/Escape discard drafts and restore focus | Focused checks 4–9 | Design verified in prototype; production not changed. |
| Search/Profile/Back lost context | The applied search, filter and sort state is retained when opening a Profile and returning | Focused checks 10–11 | Design verified in prototype; production not changed. |
| Saves showed generic feedback without changed state | Fictional saves update the visible record and append an immutable-looking history entry; unrelated unsaved section values remain | `profile-saved-history-desktop-1440x1000.png`; focused checks 12–15 | Simulation only; proposed owner commands remain subject to their LLD and decision gates. |
| Failure states were conflated | Rejected, stale, unknown and committed-save/refresh-failed states have distinct copy and recovery actions | `correction-{rejected,stale,unknown,refresh-failed}-desktop-1440x1000.png`; `correction-refresh-failed-mobile-390x844.png`; focused checks 16–21 | Simulation only; production recovery must use owner receipts and current authorization. |
| Employment ending lacked a precise partial-outcome contract | Added a five-state People-owned intent contract with Access-first sequencing, original keys/receipt references, dual-grant recovery and no automatic access restoration | `EMPLOYMENT_END_FAILURE_CONTRACT.md`; `employment-unknown-mobile-390x844.png`; focused checks 22–27 | PD-STF-03 approval required before implementation. No Coordination lifecycle proposed. |
| Product screens exposed implementation language | Product UI now uses school-office consequences and actions; owner names, keys, receipts, versions and query mechanics are confined to reviewer documents | Source inspection of `prototype/STAFF_WORKFLOWS.js`; corrected captures | Prototype corrected; production not changed. |
| Accepted shell, tokens and font were approximate | Prototype now uses the approved 240px Administrator shell geometry, Forest token values, Concept 1 local navigation/directory treatment and bundled approved Inter asset/license | `SOURCE_AND_SCREENSHOT_INVENTORY.md`; all corrected captures; loaded-font record in `inspection.json` | Review baseline aligned; production unchanged. |
| Mobile navigation/failure states needed keyboard evidence | Escape closes navigation, returns focus to the menu trigger, and mobile failure surfaces remain reachable without root horizontal overflow | Mobile captures; focused checks 28–29; per-capture overflow data | Prototype verified; native VoiceOver/NVDA pending. |

## Visual inspection record

The corrected desktop directory, corrected Profile/history, stale correction drawer, mobile refresh-failed drawer, mobile employment-unknown modal and Porcelain directory were inspected directly after capture. Spacing, hierarchy, focus ring, responsive stacking, control reachability and the explicit prototype banner were present. No capture had root horizontal overflow.

## Remaining review boundary

- PD-STF-01, PD-STF-02 and PD-STF-03 require explicit approval as written in `DECISION_REGISTER.md`.
- PD-STF-04 remains deferred and is not required for a mandatory first-release flow.
- Native assistive-technology checks and production implementation verification were not performed.
