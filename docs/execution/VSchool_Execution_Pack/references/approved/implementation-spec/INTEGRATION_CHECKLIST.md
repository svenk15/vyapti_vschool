# Integration checklist for the working agent

This is reusable handoff metadata, not another full product prompt.

For the selected screen:
- [ ] Match SOURCE_MANIFEST.json to the approved HTML present in the live repository. Do not measure one edition and implement another.
- [ ] Read its workflow card / dedicated screen spec and relevant shared component rows.
- [ ] Map reference selectors to real component exports. Reuse existing UI primitives; note any missing component variant.
- [ ] Record body/sidebar actual fonts separately. Resolve the body asset gap before claiming cross-platform font fidelity.
- [ ] Map each action/data field to the existing gateway/use case. A missing backend field is an explicit gap, not a guessed label or fake value.
- [ ] Preserve real authorization, identity, transactions and schema ownership; reference mock scripts do not establish production semantics.
- [ ] Implement scoped tokens and layout rules, including media overrides. Do not import all source CSS globally.
- [ ] Compare at the documented fixture sizes and at the user's actual review viewport; mobile screenshots and keyboard checks remain necessary.
- [ ] Produce production/reference comparisons and explain differences; keep human review PENDING until actual acceptance.
- [ ] Update only affected live task/LLD/evidence. Continue the user's authorized Administrator backlog without requiring another long prompt.

Candidate component mapping fields to record once in the live design-system DESIGN.md:

| Role | Existing export/file | Reference selector | Variant | Used by | Verification |
|---|---|---|---|---|---|
| PortalShell | inspect live code | .shell/.sidebar/.topbar | admin | Administrator routes | scoped navigation/context |
| DirectoryToolbar | inspect live code | .toolbar/.searchbar | directory | Students/staff/etc. | query, keyboard, URL |
| SemanticTable | inspect live code | .table-card/table | mobile-cards | directory | columns, row borders, semantics |
| SideDrawer | inspect live code | .dialog.drawer | filter/sort | directory | footer, focus, dismissal |
| WizardFrame | inspect live code | .wizard-grid/.form-foot | generic/specialized | workflow steps | progression, draft separation |

Do not treat the candidate names as required new files. The code snapshot in the archive can be older than the working repository.
