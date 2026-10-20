# VSchool presentation revamp

Status: **APPROVED FOR IMPLEMENTATION**<br>
Recorded: 18 October 2026 (Asia/Kolkata)<br>
Human visual acceptance: **PENDING**

Layout-reference approval does not authorize palette changes. Approved semantic theme tokens take precedence over literal mock colours.

This file is the implementation record for the approved presentation and theme specification supplied in the 18 October 2026 user instruction. It does not replace business rules, authorization contracts, workflow LLDs, or production release gates. Persistence and appearance authority remain owned by [Branding](../../modules/branding/DESIGN.md); tenant creation remains owned by [Access](../../modules/access/DESIGN.md); shared presentation remains owned by [Design system](../../modules/design-system/DESIGN.md).

## Outcomes

- One shared semantic presentation system across Administrator, Teacher, Student, Parent/Guardian, Principal, operator surfaces that consume shared UI, and authorized branded sign-in.
- Four named presets with stable IDs: `forest` (Refined Forest, default), `amethyst` (Amethyst & Pearl), `porcelain` (Porcelain & Ink), and `linen` (Linen & Bronze).
- A concrete institution theme and a nullable branch override. Resolution is `branch override → institution theme → forest`; `null` means inherit and explicit `forest` remains an override.
- One accessible `ThemePicker` for authorized institution/branch creation and appearance settings. Selection and preview are local form state; only the established final owner command persists.
- Server-rendered `data-vs-theme` for the authorized context, with no mutable process-global tenant state, client authority, unpublished public leakage, or wrong-theme first paint.
- Shared responsive shells, typography, controls, directories, drawers, staged forms, dashboards, detail pages, and receipts using the tokens in [TOKENS.md](TOKENS.md).

## Authority and safety

Presentation authority is: this record, accepted domain/security contracts, approved production screen specifications, visual-direction concept images, then historical explorers. Concept images never grant data, routes, capabilities, aggregates, notifications, drafts, approvals, logos, or identities.

Theme editing reuses current appearance authority. Institution creation uses the established creator authority; institution-default editing uses established institution appearance authority; branch override editing uses exact-branch appearance authority. Read access, navigation visibility, a role label, and Principal membership do not grant edit authority. The existing draft/publication boundary remains active.

Unknown theme IDs are rejected on writes. Unknown legacy read values resolve to Forest with bounded diagnostics and are never interpolated into CSS, HTML, or URLs. No arbitrary CSS, hex editor, remote stylesheet, per-user theme, role colour, or live cross-browser synchronization is introduced.

## Rendering rules

- Generic sign-in, unresolved workspace choice, and operator pages use Forest.
- Published institution/branch sign-in uses only published effective appearance; drafts and previews stay private.
- Authenticated pages use the authorized active context. Context changes clear old scoped presentation/data and resolve the destination context.
- Institution pages use the institution theme. Parent child and Student context switching follows the selected authorized school. A chooser with no selected institution uses Forest.
- Cache identity includes relevant institution, branch, publication/configuration version, and scope. Accepted updates invalidate or advance that identity.

## Interaction rules

- Preview notice: “Theme preview — changes are not saved.” with “Exit preview”. Preview is never tenant authority and is not stored in a cookie or local storage.
- Save rechecks live authority and expected version. Stale state shows current versus attempted selection and preserves safe entered values.
- Success copy: “Theme updated.” Clearing a branch override: “This branch now uses the institution theme.”
- Existing business mutation, exact-key recovery, version, isolation, and receipt behavior remain unchanged.
- Human acceptance, native VoiceOver/NVDA, real-client data, TEN-03, provider configuration, and production readiness remain separate gates.

## Responsive and component baseline

The implementation uses the measured geometry, typography, navigation, form, directory, dashboard, detail, and receipt contracts recorded in [TOKENS.md](TOKENS.md). Route applicability and verification priority are in [SCREEN_MAP.md](SCREEN_MAP.md). Work proceeds in [TASKS.md](TASKS.md) order and actual evidence is recorded in [CURRENT_STATE.md](CURRENT_STATE.md).

## Explicit non-goals

- Reopening M01–M08 product scope or rewriting accepted workflows.
- Adding global search, new notifications, dashboard aggregates, draft lifecycles, approvals, logos, identities, permissions, or routes from concept art.
- Personal themes, dark mode, arbitrary school CSS, remote fonts, gradients, glass effects, decorative textures, or a second Theme module.
- Claiming exact fidelity for explorer placeholders, accessibility certification, human acceptance, or production readiness.
