# VSchool implementation specification — revision 1

## What is authoritative

The unmodified interactive HTML is the visual source. Ordered extracted CSS provides exact declared values. Browser measurements provide effective values in a recorded environment. Workflow cards preserve catalog labels, controls, options, steps, invariants and recovery text. Production domain/authorization/database behavior remains governed by accepted live-repository contracts.

Read only the relevant items:
1. [COMPONENTS.md](COMPONENTS.md) for shared Administrator components.
2. [TYPOGRAPHY.md](TYPOGRAPHY.md) before implementing fonts.
3. [administrator/STUDENTS.md](administrator/STUDENTS.md) for the known mismatch-prone screen.
4. administrator/workflows/<ID>.md for the selected workflow; index in administrator/workflow-index.json.
5. [administrator/screens/INDEX.md](administrator/screens/INDEX.md) for 98 measured entry/overlay/scenario states.
6. [ACCEPTANCE.md](ACCEPTANCE.md) for reproducible comparisons.
7. sources/<workspace>/style-*.css for exact declarations and responsive/variant overrides.

Do not load all 63 cards or all six CSS sets into one coding session. Preserve detailed information on disk and use targeted selectors/searches.

## Coverage and limits

- All six primary HTML references: exact source CSS blocks, declared tokens, embedded font assets and source hashes.
- Administrator: 63 catalog workflow contracts including every catalog field/step, original full records and implementation boundaries.
- Administrator: reference browser inspection for module landings, workflow entry states, Students directory/Sort/Filters/Manage and common error scenarios; see reference/environment.json for actual completed captures.
- Later wizard states, specialized Families/Communication/Timetable subflows and non-Administrator screens are not all browser-verified in this edition. Do not represent extracted catalogs as exhaustive executed interaction evidence.
- Undefined body font asset, business validation limits, draft lifecycle and unspecified permission rules remain explicit gaps. They cannot be inferred from pixels.

The archive retains existing source/docs for specialized workspaces. Generic workflow cards do not override richer dedicated flows. If source/catalog disagree, record the exact discrepancy and use the visibly approved interaction plus accepted domain contract; do not fabricate a compromise.

## Integration with the current repository

Copy this implementation-spec folder into the existing approved-reference root, alongside its packs/ folder, or install the whole archive in a dedicated docs/design-reference directory. Do not replace code, live CURRENT_STATE or backend LLDs with archived copies. Keep source paths adjusted consistently.

Add a short link in root AGENTS.md: “For visual work, use <installed>/implementation-spec/START_HERE.md and the selected screen/component contract.” Do not copy the entire spec into AGENTS.md.

Existing backend work stays intact. Extract CSS is evidence, not a stylesheet to import globally: port rules into scoped reusable React components and tokens. Never copy prototype in-memory authentication, workflow writes or inline script logic into production. Keep backend extraction and tenant-security contracts unchanged.

## Traceability status

Each implementation task records: workflow ID → reference state → component contract → production component/route → functional evidence → visual evidence → human review. Missing support means a tracked gap, not an accepted exclusion. No production source was changed or validated while creating this design-pack edition.
