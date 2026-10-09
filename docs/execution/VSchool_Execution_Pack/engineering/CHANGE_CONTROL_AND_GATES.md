# Implementation discipline with minimal repeated work

## Slice decision record (required, short)
Before a slice changes code, write or update at most one concise section in the owning DESIGN.md:
- Exact source workflow and approved screen route.
- Existing operation being reused; new delta, if any.
- Input facade, output port, adapter, factory, host and DTO files.
- Tables read/written; transaction owner; version/key/replay; authorization.
- Focused acceptance cases and demo outcome.

If all already exist, link them rather than rewrite them. Do not generate a large new architecture document for every button. The supplied engineering guides are the starting contract, not permission for arbitrary rewrites.

## Four connected records
Bible owns product policy and delivery scope. DESIGN owns technical details. TASKS owns prerequisites, files and acceptance. CURRENT_STATE owns actual evidence. Update only changed sections, with concise changelog. A machine queue is a projection of these, not another authority. Human review never silently becomes PASSED. Restore requirements, native accessibility, RLS and production safety remain separate release statuses.

## Migration protocol
No DB migration for visual adoption. For a newly approved persistence delta: decide owner and scope; select exact columns/SQL types/nullability/default/backfill; specify FK/unique/check/index; write forward migration with deterministic ordering; update Prisma and TABLE_REGISTRY; exercise migration on populated synthetic data; validate owner command and rollback behavior; record migration head. Never edit an applied migration, truncate/reset or seed around failures. Do not rename every existing vs_access table merely because a conceptual owner changed in prose.

## Ready-to-code gate for later modules
A workflow card alone is insufficient. Require exact interface signatures, command/query examples, table definitions, state transition rules, joins, transaction sequence, side effects, permissions, errors, idempotency and positive/negative tests. Existing source-backed modules in this pack have concrete implementation references. Future family/operator/learning/finance etc still require owner design: do not describe them as zero-thinking executable when their security/product contracts are undecided.

## Parallel work policy
One integration owner merges and updates state. If parallel workers are explicitly enabled in the user's runtime, assign disjoint slices/worktrees only after shared contracts are frozen; tests use isolated databases/ports. No two workers independently edit Prisma migration order, shared shell contract or permission matrix. Do not start subagents merely because a skill exists. Sequential execution remains the default for the current prompt.

## Stop conditions
Continue routine coding, tests, local seed and demo preparation without per-task approval. Pause only the affected task for a real missing policy/access/security contract or destructive action. Continue independent ready work. Failures cannot be hidden by weakening assertions or granting admin. Never claim uninterrupted overnight execution, unperformed native tests or production readiness.
