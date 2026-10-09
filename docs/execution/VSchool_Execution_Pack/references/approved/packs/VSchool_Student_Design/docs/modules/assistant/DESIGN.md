# Learning assistant — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: AI application + source owners. Earliest proposed phase: 7.

## Purpose and screens
Source-linked explanations within the student purpose.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Later-phase. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: Permission-filtered source refs; approved evidence/provenance log.
Application ports: ExplainPermittedMaterial.
Repository workflow: Authorize sources before retrieval and again on open. Model input contains permitted source excerpts and bounded question; output is advisory and source linked. No tools that submit, grade or mutate student records.
Prerequisite: Phase 7 provider/data policy, school assessment-use rules, redaction, evaluations and prompt-injection handling.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-47 — Ask a learning question with sources
Phase: 7. Reconcile with owner release/dependency gates.

**Intent:** Understand permitted learning material.
1. **Ask about a source** — Scope to authorized published resources; show what will be used.
2. **Review answer** — Cite sources, state uncertainty and allow feedback; follow teacher/school assessment policy.
3. **Outcome:** Advisory explanation with source links.

**Permission/invariant:** No autonomous submission, grading, attendance or private learner profiling; untrusted content cannot change permissions.
**Failure/recovery:** Missing evidence says unavailable; blocked assessment use offers permitted learning help.
**Persistence/data:** Permission-filtered retrieval + redacted evidence + approved model/provider contract.
**Join/write contract:** Authorize sources before retrieval and again on open. Model input contains permitted source excerpts and bounded question; output is advisory and source linked. No tools that submit, grade or mutate student records.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
