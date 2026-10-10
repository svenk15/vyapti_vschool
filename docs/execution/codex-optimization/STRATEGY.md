# VSchool Codex optimization strategy

Prepared 10 October 2026. Objective: more accepted, verified slices per usage window, not more generated code.

## Basis and limits

Inspected the uploaded 8 October review archive: root AGENTS.md, root CURRENT_STATE.md, execution index v4.6, package scripts, database wrapper, tenancy/student design excerpts, tenancy state and runbook. This is not the current Mac checkout. Latest progress and timings come from the user's pasted Codex reports: 29/29 Administrator Phase 1 engineering-verified at c754a3d, visual acceptance unproven, TEN-03/native accessibility outstanding. Validate live state once before adoption. No application checks were run for this policy pack.

The snapshot's root CURRENT_STATE introduction is stale; module state files own status. TEN-ADR-006 is embedded in tenancy DESIGN.md, not necessarily a separate ADR file. The snapshot's introductory 'fresh project' wording must not restart a developed repository.

## Why usage was wasted

Reported implementation: 25–30 minutes; requirement revisiting: 18–22; reading: 12–15; documentation: 10–12; testing: 12–15; debugging: 12–15; builds: 8–10. Most are estimates, not additive precision or token measurements. Accidental broad suites cost a measured 7m48s. Approval waiting was below one minute. Do not remove approval/security controls for this negligible saving.

Main interventions:
- Store durable rules once instead of pasting another multi-thousand-word prompt.
- Point to accepted decisions rather than re-reasoning SA-07 authority.
- Preserve full LLD detail on disk; load only task-relevant sections.
- Fix test forwarding and stop printing entire successful logs.
- Establish one accepted visual pattern before repeating pages that need rework.

Elapsed shell time is not a token invoice. Fewer repeated reads, tool-result dumps and reasoning loops should reduce context consumption, but no percentage saving or exact reset capacity can be promised.

## Adoption — one small maintenance slice

1. Copy this pack into docs/execution/codex-optimization/. Do not blindly replace the live root AGENTS.md.
2. Ask Codex to merge the proposed policy into root AGENTS.md, preserving all unique current safeguards and the existing framework-generated Next.js block verbatim. Inspect ancestor/nested instructions relevant to changed paths; resolve duplicated blanket-read rules in AGENT_RUNBOOK consistently. Preserve decisions and hard gates.
3. Change process cadence only explicitly: iteration uses focused checks; VERIFIED still requires its task gates. Batch-wide checks may be consolidated only where the canonical task/runbook is amended consistently. No inferred exemption.
4. No migration, app refactor or new dependency is necessary to install this policy. Review the instruction diff and applicable documentation checks; commit only intended files.
5. Use SESSION_PROMPT for the next named task. Do not paste the full strategy and the full policy into every message.

Official guidance supports progressive disclosure and conditional documentation loading rather than requiring an entire repository map before each edit:
https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra
AGENTS instruction discovery/override behavior:
https://learn.chatgpt.com/docs/agent-configuration/agents-md

## Lightweight session lifecycle

Start with git status/HEAD, selected module state and last evidence. Read the task and immediate prerequisites, relevant LLD headings and decision references. For a resumed task, compare changed files since the handover before reusing evidence. Prefer this packet to a full repo scan.

Context routing:

| Change | Additional context |
|---|---|
| Styling/page composition | Approved HTML states, shared component/token recipe, page/gateway types; relevant Next guide |
| Use case/API | Owner DESIGN, facade/port, route/gateway, authorization and tests |
| Cross-module identity | Access/People contracts, binding verification, transaction/replay rules, applicable IAM decisions |
| Schema/query | DATABASE_DESIGN, affected Prisma models/migrations, TABLE_REGISTRY entries, tenant classification/index plan |
| Tenant/security | Tenancy ADR sections including TEN-ADR-006, runtime role/context contracts and scoped negative tests |
| New product behavior | Relevant Bible/accepted decisions plus owner LLD before code |

One task card needs outcome, owner, decision links, affected interfaces, 3–5 acceptance criteria, dependencies and stop boundary. Keep full interface/schema detail in the LLD, not repeated in the card.

Continue the same session while actively diagnosing one task. Start a fresh session at a coherent checkpoint or objective change when old context is becoming distracting; restarting after every edit forces reloading and is not automatically cheaper. A new chat is not a usage-limit reset. Maintain one active implementation agent; parallel agents would duplicate context and are not the current optimization.

At handover use the selected module's existing CURRENT_STATE section, not a second status database:

```text
Task/outcome:
HEAD and relevant dirty files:
Accepted decisions + source paths:
Contract/reference paths:
Verified commands + tested source/environment:
Demo source/build/config (no secrets):
Remaining criteria/blocker:
Exact next action:
Human/visual/release status:
```

Keep it about 15–30 lines with evidence links. Update after a completed slice or before stopping; no need to log every file read.

## Coding and documentation

Implement one vertical slice whose acceptance fits a checkpoint. For the immediate priority, that means one representative Administrator workflow visually matched to its approved reference, not all 63 workflows. After user acceptance, group related screens sharing the same components. Shared-component changes still require representative consumer checks.

New behavior: LLD delta -> task criteria -> implementation -> evidence/state. Cosmetic changes: use existing design contract; no fabricated DB LLD. Bible/ADRs change only for actual cross-cutting decisions. Batch routine evidence wording at checkpoints; retain required design before code and status updates before handover. Do not regenerate historical screenshots or inventory files unless their content changes.

Avoid incidental cleanup/upgrades. If a contract is resolved, implement it. If unresolved, list the exact decision and continue a named independent task only within the authorized batch. Do not repeatedly analyze a blocker while making no changes.

## Verification and build matrix

| Changed surface | Focused loop | Completion scope |
|---|---|---|
| Docs only | Relevant docs/DB-design validator, diff review | No automatic application build unless a gate requires it |
| Styling/layout | Visual comparison, relevant interaction/browser checks, affected lint/type checks | Representative shared consumers; required task checks/build |
| Domain/use case | Changed unit cases + affected functional contract | Relevant integration/architecture gates |
| Identity/access/tenant guards | Real PG allow/deny, cross-scope, revocation, rollback/replay as affected | Wider affected callers plus required security gates |
| Schema/transactions | Guarded migration, constraints/backfill, concurrency/rollback where applicable | Affected modules; DB-design/boundary/build gates |
| Shared shell/auth/config | Representative roles/routes and denied paths | Broader integration justified by blast radius |

In the inspected snapshot pnpm check already runs lint, typecheck, docs, DB-design, boundary, backend and unit checks. Do not run each again immediately after a successful unchanged pnpm check. A build does not replace these checks; they test different things.

Wrapper in the snapshot forwards process.argv.slice(3). Candidate invocations, subject to validating the live wrapper and actual file paths:

```sh
pnpm test:functional <actual-functional-test-file>
pnpm test:e2e <actual-browser-test-file> --project=<actual-project-name>
```

Do not add an extra literal -- by habit. Inspect runner selection; a unexpectedly broad selection should not become the default. Never bypass the wrapper's local/test database guards. Verify exact project names from live Playwright config. Store known-good commands with task evidence once.

Use one production build per unchanged source/config browser checkpoint where the harness permits it. Reuse only if source, generated assets, dependency lockfile, build-time environment, framework config and required schema match. Source changes after a build require an updated build before claiming final-source production verification. Keep dev and production demo provenance distinct. Do not use dev DB in the E2E harness.

Avoid simultaneous Next build/type generation against the same output tree. Do not spawn duplicate servers blindly; check task-owned server health/source, and terminate only processes the task owns. Do not adopt a persistent build cache daemon or new runner solely to optimize a few minutes.

On failure inspect the first relevant trace/log. Fix and rerun that scope. On a second unchanged failure reassess fixture/environment/selector/contract, rather than mechanically launching the suite. No disabling tests or extending timeouts without diagnosis. An accidental broad suite may still supply useful evidence, but does not excuse a broken command recipe.

Historical results are reusable only for unchanged relevant inputs, with provenance. Report 'previous source passed; current changed path verified by X' rather than relabeling all prior tests as current. If required gates remain pending, checkpoint as partial rather than VERIFIED.

## Working with the three available resets

Treat the three resets as the user's reported account state, not a duration or token allowance. This pack does not assume reset expiry rules or estimate available tokens. Check the product's displayed usage before applying a reset; do not spend one merely because a task is slow.

Recommended sequence of work after capacity is available:
1. Install the lean policy and finish one visually faithful Administrator reference workflow; stop for the already-requested visual acceptance.
2. Apply the accepted components/composition to a small named group of related screens, with focused evidence.
3. Integrate and correct remaining discrepancies; preserve capacity for defects rather than expanding scope automatically.

These are milestones, not a promise of one milestone per reset. A milestone may span windows. Choose the next ready task by prerequisites, user value, bounded uncertainty and closeness to verified completion. Reserve the final portion of planned work for verification/handover. Do not attempt to consume all remaining allowance with an open-ended 'finish everything' task.

If model/reasoning selection is available, use a capable setting that reliably handles the bounded task. Reserve deeper analysis for identity, tenancy, migrations and concurrency uncertainty; avoid repeated model switching during debugging. No unsupported model-price or rate-limit multipliers are assumed.

## Success measurement

At each checkpoint record a small table: task, elapsed time, repeated reads/commands with cause, checks passed, visual deviations, source commit and remaining criteria. Record usage deltas only if actually visible; do not infer tokens from elapsed minutes.

Primary measure: complete verified slices that satisfy their acceptance criteria, with visual acceptance tracked separately. Secondary measures: reopen/rework rate, unnecessary broad test runs, repeated unresolved decisions and stale-demo incidents. Target zero accidental broad suites and zero silent visual-completion claims. Do not award 'velocity' for subdividing one unfinished workflow into many nominal tasks.
