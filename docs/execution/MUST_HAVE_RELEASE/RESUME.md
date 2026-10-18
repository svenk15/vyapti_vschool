# Must-have release resume

- **Current task:** integrated must-have release checkpoint complete; human review remains pending.
- **Baseline:** audit commit `34301b1`; executable application source is `c7b2abd`.
- **Working tree:** pre-existing modified historical screenshots and unrelated untracked review files are preserved and excluded from this programme's commits.
- **Completed checkpoint:** M01–M08 are engineering-verified for the bounded must-have scope. Repository checks pass; the final normal production build `lA2wtzNon2bc8hg3fJSJN` was generated with the established 4 GiB Node heap. The full PostgreSQL run reached 263/265 before two current-contract assertion drifts; the two affected files then passed 7/7 after narrow assertion repairs, without repeating the unchanged broad run.
- **Next exact action:** keep the production demo at `http://127.0.0.1:3400` stable for consolidated human review. Address reported defects before changing the candidate.
- **Working focused command:** `pnpm test:functional <test-file> [<test-file>...]` (do not insert an extra `--`; the wrapper forwards positional paths directly).
- **Demo:** `http://127.0.0.1:3400`; normal production build `lA2wtzNon2bc8hg3fJSJN` from application source `c7b2abd` is running via `pnpm demo:start`. `/api/health` returned `ready: true`, `/sign-in` returned 200 and unauthenticated `/admin` redirected to `/sign-in`.
- **Credential files:** `artifacts/people-02/private-demo.json`, `artifacts/guardians-01/private-demo.json`, `artifacts/students-portal/private-demo.json` (ignored/private; values are never recorded here).
