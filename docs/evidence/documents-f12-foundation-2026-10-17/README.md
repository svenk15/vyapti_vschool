# F12 Documents safe foundation evidence

Date: 17 October 2026
Source: working checkpoint after `67a7a8c`; final commit recorded after checkpoint commit.
Human review: PENDING.

## Outcome

DOC-01 now provides the approved D15 synthetic schema, portable validation, typed storage/scanner/owner ports, scoped Prisma persistence, private local adapter and fail-closed ClamAV command adapter. Initial upload, status/replay and controlled rescan all reauthorize the exact owner context. Scanner unavailability is durably distinct from failure and from CLEAN.

The local machine has no ClamAV executable. Therefore this evidence does not claim malware protection, SAFE upload, authenticated download or complete F12/LEA-32. No real or personal document was used.

## Checks

| Command | Result |
|---|---|
| `pnpm exec vitest run --config vitest.config.ts test/unit/documents.test.ts` | PASS, 3/3 |
| `pnpm test:functional test/functional/documents.test.ts` | PASS, 3/3 on real `vyapti_vschool_test` PostgreSQL |
| `pnpm check:db-design` | PASS, 142 contracts |
| `pnpm check:backend` | PASS |
| `pnpm exec prisma migrate deploy` | PASS on development; migration count 88 |
| Functional harness migration deploy | PASS on test; migration count 88 |

The functional CLEAN/BLOCKED scanner is explicitly a test double used only for transaction/state verification. The absent-scanner case uses the production ClamAV adapter with no configured executable and persists `SCAN_UNAVAILABLE`.
