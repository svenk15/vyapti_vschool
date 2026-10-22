# STF-04A/B Staff recovery evidence

Status: engineering checkpoint prepared; human review PENDING.

Source before this checkpoint: `4ea7d7a`. No migration or schema change.

Verified production build ID: `laSHMu7ALOjRoaqGpfoEZ`.

## Contract covered

- People and Access keep the original immutable key/payload after response loss.
- Owner-specific status reads return FOUND or UNKNOWN and recheck current authorization before disclosing a receipt.
- Revoked administrator authority denies protected status.
- UNKNOWN remains unresolved and disables another save.
- A confirmed commit whose refresh fails stays saved; recovery issues GET only.
- People and Access receipts remain separate. No generic receipt store or universal approval authority was introduced.

## Verification

- `pnpm exec tsc --noEmit` — passed.
- `pnpm exec vitest run --config vitest.config.ts test/unit/people.test.ts test/unit/access-management.test.ts` — 9/9 passed.
- `pnpm test:functional test/functional/people-employees.test.ts` — 13/13 passed.
- `pnpm test:functional test/functional/access-management.test.ts` — 9/9 passed.
- `pnpm check:backend` — passed.
- `pnpm check:boundaries` — passed.
- People browser suite, Chromium and mobile, one worker — 3/3 per viewport passed.
- Access focused recovery browser case, Chromium and mobile, one worker — 1/1 per viewport passed after correcting a text-locator-only test failure. The rendered saved-refresh-failed state was present in the failure snapshot.

One initial functional command used an extra literal `--`; Vitest began the broad suite. It was stopped after an unrelated Finance test failure, and the intended focused files were rerun with the verified argument form above. The first mobile launch then found PostgreSQL unavailable. The existing Homebrew service was restarted without database reset; the same unchanged mobile case passed.

## Current captures

| State | Desktop | Mobile |
| --- | --- | --- |
| People outcome unknown | `people-unknown-chromium.png` | `people-unknown-mobile.png` |
| People recovered receipt | `people-recovered-chromium.png` | `people-recovered-mobile.png` |
| Access outcome unknown | `access-unknown-chromium.png` | `access-unknown-mobile.png` |
| Access committed, refresh failed | `access-saved-refresh-failed-chromium.png` | `access-saved-refresh-failed-mobile.png` |

PD-STF-02 corrections, STF-05 dated eligibility and STF-06 reasoned invitation resend are not claimed by this checkpoint. Native accessibility, font portability, TEN-03 and human visual acceptance remain pending.
