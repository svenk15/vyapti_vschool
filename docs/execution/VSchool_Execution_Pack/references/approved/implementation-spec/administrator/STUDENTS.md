# Students directory and related states

Reference: packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/students. Source review mode: expanded, School administrator, normal scenario. Fictional branch Whitefield/year 2026–27. Production uses actual authorized context; no review banner.

## Composition

Portal shell → breadcrumb Students / branch context / year → page header Students plus description → right primary Register student with plus icon → All students count and My drafts count tabs → full-width search/filter/sort toolbar → Student / Class / Status / Actions table → paging.

Description: “Find a student, review enrollment and keep dated records clear.” Student cell: initials avatar, linked display name, admission number below. Class is current authorized class/placement such as Grade 6 · A, not the academic-year label. Do not derive totals from a loaded page. Real classes, counts and names come from authorized projections.

## Search and sort mapping

| Visible label | Reference query value | Production semantic field |
|---|---|---|
| Student name | name | directory display-name search |
| Admission number | code | branch-scoped admission-number search |
| Sort Name | name | display-name ordering with deterministic tie-breaker |
| Sort Reference | code | admission-number ordering |
| Sort Status | status | accepted status ordering |
| Ascending / Descending | asc / desc | database ordering direction |

Reference internal keys are not mandatory API field names. Preserve visible wording unless an accepted label change is recorded. Directory search is not the exact identity-resolution operation. Query changes reset pagination; URL and Back/Forward restore applied state. Production sorting covers the full authorized result set, not loaded rows. Signed cursors bind query/scope/order and the actual final tuple.

## Sort panel

Use COMPONENTS.md exact drawer rules. Title Sort; no extra visible explanatory paragraph. Sort by and Order by expanded by default; radio controls; Cancel and Apply in bottom footer. Closing must not apply the draft. Do not show default native disclosure triangles on the left. No backdrop blur.

## Manage destinations

The prototype groups actions for record/history and maintenance, with expanded-mode family/lifecycle actions. Keep action wording specific. Connect record, history, permitted correction, enrollment and same-branch movement to real approved operations. Guardian linking and lifecycle actions require their owner module, permissions and persisted journeys. Existing narrow archive/transfer operations are not substitutes. Eligibility is a presentation aid; server checks remain authoritative.

## Drafts

My drafts is an approved visible requirement, but persistence/resume needs a durable ownership/lifecycle contract. Do not add a fake zero tab or claim it is implemented because the source has in-memory draft storage. Save draft and leave is separate from Back/Continue, disabled without meaningful input, excludes password/secret values, and requires server-side scope and current-reference revalidation in production. Retention/expiry and conflict policy remain owner decisions where undocumented.

## Comparison checklist

- Typography/body font and sidebar override match their separate roles.
- Compact Filters/Sort with icons; search selector width and magnifier present.
- Plus icon on Register student.
- Correct Class content and honest missing-placement state.
- Full row dividers, pill badges, right-aligned icon + Manage.
- Sort right chevrons, inset dividers, no blur, bottom footer.
- Desktop/mobile composition matches actual reference, not guessed card layout.
- Backend data may differ; geometry fixtures should use equivalent text lengths.
- Do not hide functional omissions to pass screenshot tests.
