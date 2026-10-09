<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Parent workflow implementation index

All entries are design proposals. Actual implementation status is NOT_ASSESSED; human review is PENDING. Map these references into current owning-module tasks rather than duplicating or renumbering existing work.

| Ref | Journey | Phase | Area | Design gate |
|---|---|---|---|---|
| PAR-01 | Accept a school invitation | 2 | access | Reconcile owner LLD and repository |
| PAR-02 | Sign in through the school page | 2 | access | Reconcile owner LLD and repository |
| PAR-03 | Activate or recover account access | 2 | access | Reconcile owner LLD and repository |
| PAR-04 | Review my verified child links | 2 | access | Reconcile owner LLD and repository |
| PAR-05 | Ask about a missing child link | 2 | access | Reconcile owner LLD and repository |
| PAR-06 | Handle changed or withdrawn access | 2 | access | Reconcile owner LLD and repository |
| PAR-07 | Review my family overview | 2 | home | Reconcile owner LLD and repository |
| PAR-08 | Switch child and school context | 2 | home | Reconcile owner LLD and repository |
| PAR-09 | Manage school notification preferences | 2 | home | Reconcile owner LLD and repository |
| PAR-10 | Read my child’s attendance | 2 | attendance | Reconcile owner LLD and repository |
| PAR-11 | Submit an absence explanation | 2 | attendance | Reconcile owner LLD and repository |
| PAR-12 | Track or withdraw an explanation | 2 | attendance | Reconcile owner LLD and repository |
| PAR-13 | Query an attendance discrepancy | 2 | attendance | Reconcile owner LLD and repository |
| PAR-14 | Read and acknowledge a school notice | 2 | communication | Reconcile owner LLD and repository |
| PAR-15 | Reply to a permitted conversation | 2 | communication | Reconcile owner LLD and repository |
| PAR-16 | Request a teacher meeting | 2 | communication | Scope extension before implementation |
| PAR-17 | Resolve an undelivered message | 2 | communication | Reconcile owner LLD and repository |
| PAR-18 | Plan with the school calendar | 2 | calendar | Reconcile owner LLD and repository |
| PAR-19 | Respond to a school event | 3 | calendar | Scope extension before implementation |
| PAR-20 | Review published homework | 3 | learning | Reconcile owner LLD and repository |
| PAR-21 | Read returned learning feedback | 3 | learning | Reconcile owner LLD and repository |
| PAR-22 | Ask a learning question | 3 | learning | Reconcile owner LLD and repository |
| PAR-23 | Read published results | 4 | results | Reconcile owner LLD and repository |
| PAR-24 | Download an authorized report | 4 | results | Reconcile owner LLD and repository |
| PAR-25 | Request a result clarification | 4 | results | Reconcile owner LLD and repository |
| PAR-26 | Review a child’s fee invoice | 5 | finance | Reconcile owner LLD and repository |
| PAR-27 | Pay an authorized invoice | 5 | finance | Reconcile owner LLD and repository |
| PAR-28 | Resolve an uncertain payment | 5 | finance | Reconcile owner LLD and repository |
| PAR-29 | Read receipts and payment history | 5 | finance | Reconcile owner LLD and repository |
| PAR-30 | Raise a fee or refund query | 5 | finance | Reconcile owner LLD and repository |
| PAR-31 | Ask about payer access | 5 | finance | Reconcile owner LLD and repository |
| PAR-32 | Submit a school request | 2 | requests | Reconcile owner LLD and repository |
| PAR-33 | Track or withdraw a school request | 2 | requests | Reconcile owner LLD and repository |
| PAR-34 | Request a child-record update | 3 | requests | Reconcile owner LLD and repository |
| PAR-35 | Request a school document | 3 | requests | Reconcile owner LLD and repository |
| PAR-36 | Respond to a permission or consent form | 3 | requests | Reconcile owner LLD and repository |
| PAR-37 | Start or resume an application | 3 | admissions | Reconcile owner LLD and repository |
| PAR-38 | Track application requirements | 3 | admissions | Reconcile owner LLD and repository |
| PAR-39 | Respond to an admission offer | 3 | admissions | Reconcile owner LLD and repository |
| PAR-40 | Review transport assignment | 6 | services | Reconcile owner LLD and repository |
| PAR-41 | Request an authorized pickup change | 6 | services | Scope extension before implementation |
| PAR-42 | Read transport service updates | 6 | services | Reconcile owner LLD and repository |
| PAR-43 | Review child library loans | 6 | services | Reconcile owner LLD and repository |
| PAR-44 | Request an extracurricular place | 6 | services | Scope extension before implementation |
| PAR-45 | Manage an enabled meal preference | 6 | services | Scope extension before implementation |
| PAR-46 | Submit a care or emergency-contact update | 6 | wellbeing | Reconcile owner LLD and repository |
| PAR-47 | Read an authorized school care note | 6 | wellbeing | Reconcile owner LLD and repository |
| PAR-48 | Request a student-support discussion | 6 | wellbeing | Reconcile owner LLD and repository |
| PAR-49 | Update my verified contact details | 2 | account | Reconcile owner LLD and repository |
| PAR-50 | Review sessions and sign out | 2 | account | Reconcile owner LLD and repository |
| PAR-51 | Request access, correction or privacy support | 2 | account | Reconcile owner LLD and repository |
| PAR-52 | Ask the school assistant | 7 | assistant | Reconcile owner LLD and repository |

First sequence: verified family access → scoped child workspace → attendance and explanation → notice/conversation/request handoffs → composed UX review. Later phases have independent owner release gates.
