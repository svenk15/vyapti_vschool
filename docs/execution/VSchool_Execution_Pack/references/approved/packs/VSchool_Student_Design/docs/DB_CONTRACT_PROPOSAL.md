# Proposed database contracts
This is a **candidate PostgreSQL physical design**, not a report of existing schema. Reconcile with current schema.prisma/migrations and owner LLDs before creating tables. Reuse an existing owner table where it already represents this concept. All names follow the requested **vs_** prefix.

Common types: opaque UUID identifiers; timestamptz for instants; date for school-local dates; integer version > 0; smallint for attempt numbers; enums or checked text for bounded states. NOT NULL unless explicitly optional. Common branch-scoped columns: id uuid PK, organization_id uuid, school_id uuid, created_at timestamptz, updated_at timestamptz, version integer. Declare UNIQUE(organization_id, school_id, id) where composite FKs use it. Cross-scope references must not rely solely on globally unique UUIDs to establish policy.

## Identity and existing owner reads
| Candidate/reused table | Additional fields / responsibility | Keys and relationships |
|---|---|---|
| vs_access_user_account | Global account; existing password/session identity | Global class; student views never enumerate accounts |
| vs_access_student_account_link | organization_id, account_id, student_id, state, verified_at?, verifier_reference?, starts_at, ends_at? | Institution class; unique active account/student binding policy; FKs to account and institution-local student |
| vs_student_student | Institution-local pupil identity; current official record | Institution class; reuse actual Student/Person model rather than clone |
| vs_student_enrollment | school_id, student_id, year_id, offering/class reference, state, starts_at, ends_at? | Branch class; composite institution/student FK; dated active enrollment |
| vs_academic_offering / vs_academic_schedule_occurrence | Subject/class/teacher assignment and published occurrence revision | Branch class; enrollment joins via dated owner-defined roster/audience; no arbitrary teacher lookup |
| vs_attendance_session / vs_attendance_roster_member / vs_attendance_record | Exact session, frozen roster and outcome/revision | Branch class; session + student scoped join; use existing correction history |

Column/table names above are proposed reconciliation labels; actual owner may use different names. Do not add a duplicate UserAccount, Person or Enrollment to match this document.

## Learning write model
| Candidate table | Stored data | Constraints / responsibility |
|---|---|---|
| vs_learning_assignment | offering_id, title varchar(160), instructions text, publication_state, publication_version integer, due_at, accepts_late boolean, allows_withdrawal boolean, response_policy_id, current_policy_version | Branch class. Published revision or referenced immutable version; UI must know exact reviewed version. Closed/excused are policy/state, not a fabricated grade |
| vs_learning_assignment_recipient | assignment_id, student_id, enrollment_id, audience_state, available_from, available_until?, excused_at? | UNIQUE(org, school, assignment, student); composite FKs ensure same scope; per-student audience does not expose roster |
| vs_learning_assignment_extension | assignment_id, student_id, effective_due_at, decision_id, approved_by, approved_at, revoked_at? | Only authorized owner approval; not a student-written extension. At most one effective current grant by approved policy |
| vs_learning_private_draft | assignment_id, student_id, text_body text, saved_at, version | UNIQUE(org,school,assignment,student). Private response; UPDATE guarded by expected version; no teacher/guardian read by default |
| vs_learning_draft_attachment | draft_id, assignment_id, student_id, asset_id, asset_version, ordinal smallint | Unique draft/ordinal and draft/asset; compound owner/scope FKs; at most configured count enforced by command |
| vs_learning_submission_attempt | assignment_id, student_id, enrollment_id, attempt_no smallint, assignment_version, policy_version, source_draft_version, text_snapshot text, effective_due_at, received_at, accepted_late boolean, lifecycle_state, review_locked_at?, withdrawn_at?, version | UNIQUE(org,school,assignment,student,attempt_no). Immutable answer and timing; controlled versioned lifecycle. Guard serializes allocation and active-attempt policy |
| vs_learning_submission_attachment | attempt_id, asset_id, asset_version, display_name_snapshot, content_digest, mime_type, size_bytes bigint, ordinal | Immutable reference to exact clean bytes; UNIQUE(attempt,ordinal). Never overwrite physical blob version |
| vs_learning_feedback_publication | attempt_id, student_id, audience_kind, publication_version, state, student_comment text, rubric_snapshot jsonb, returned_at?, withdrawn_at? | Store only approved student-facing projection here; private teacher working notes live under separate owner contracts. UNIQUE(attempt,audience_kind,publication_version) |
| vs_learning_command_receipt | actor_account_id, operation, intent_key uuid, request_digest, assignment_id, result_attempt_id, outcome, committed_at | UNIQUE(org,school,actor,operation,intent_key). Digest is command metadata, not an audit payload. Result FK bound to same assignment/student scope |
| vs_learning_outbox | event_type, aggregate_id, event_version, safe_payload jsonb, available_at, delivered_at?, attempts integer | Reuse owner outbox if present. Never put private response/file bytes into general payload. Atomic with acceptance; consumer idempotent |

A digest alone is not authorization. Do not turn content hashes into guessable public URLs. Keep object keys/digests out of general audit and product analytics.

## File pipeline
| Candidate/reused table | Stored data | Constraints / responsibility |
|---|---|---|
| vs_file_upload_session | organization_id, school_id, actor_id, assignment_id, draft/student ownership, expected_type/size, max_bytes, opaque_object_key, state, expires_at | Short-lived session; declared metadata untrusted; purpose-bound upload only |
| vs_file_asset_version | asset_id, version_no, organization_id, school_id, owner_student_id, assignment_id, actual_type, actual_bytes, content_digest, object_version, scan_state, scan_verdict_id, created_at | Immutable version; trusted scan transition; UNIQUE(asset_id,version_no); keep quarantine separate |
| vs_file_scan_evidence | asset/version ref, scanner/provider ref, verdict, checked_at, verified_callback_ref | Provider-authenticated evidence, no browser-authored Clean flag |
| vs_file_retention_reference | asset/version ref, owner_type, owner_id, retained_until? | Prevent removal while any accepted evidence references the bytes; approved retention policy decides duration |

Use existing shared File owner instead of creating parallel per-persona upload services. Foreign keys, object-version retention and trusted scan pipeline must work together; database referential integrity cannot prove external object contents are immutable.

## Other owner writes and reads
| Candidate/reused table | What is stored and joined |
|---|---|
| vs_request_request / vs_request_public_event | actor/account, institution/branch/student scope, category, subject-reference type/id, bounded text, state/version; student-safe timeline distinct from internal notes |
| vs_communication_notice_version / vs_communication_notice_recipient | Published version and audience; exact student recipient projection |
| vs_communication_acknowledgement | UNIQUE(org,school,student,notice_version); explicit acknowledged_at |
| vs_communication_conversation_grant / vs_communication_message / vs_communication_delivery_attempt | Current participant purpose grants, versioned command receipt, safe delivery state; minimize metadata |
| vs_assessment_report_publication / vs_assessment_report_item | Published term/report version; self student key; outcome type, score?, maximum?, scale version; zero distinct from Exempt |
| Service-owned circulation/registration/transport/support tables | Join only via own verified student scope and service grant. Detailed schemas remain with each specialist LLD |

Avoid one polymorphic foreign key with no validation for requests. Prefer category-specific relation tables or an application-validated reference plus owner verification at every action, documented per category.

## Joins that power screens
1. **My contexts:** account → verified StudentAccountLink → same-institution Student → active Enrollment → School/Organization → released/enabled capabilities. Return permitted contexts, never all branches.
2. **Assignments:** enrollment → recipient(student, school, active dates) → Published Assignment → optional own PrivateDraft and latest own Attempt. Use one bounded query/projection, not an unbounded N+1 loop.
3. **Submission detail:** attempt(scope, student, ID) → exact assignment revision → attachment snapshots → file versions reauthorized for download. Feedback is joined only through Returned publication with intended audience.
4. **Feedback:** self attempt → returned student-facing feedback publication → published rubric snapshot. Private teacher notes are not selected.
5. **Attendance:** enrollment/student scope → frozen roster membership → exact session → current published mark/revision. LEFT JOIN missing record yields Awaiting submission, not Absent.
6. **Messages:** recipient or conversation grant for current student/context → published notice or permitted thread → own/authorized messages → safe delivery projection.
7. **Requests:** authenticated actor + current student/context → owned requests → student-visible events. Internal events excluded in SQL/projection.
8. **Results:** current access → self PublishedReport → student items → published scale. An unpublished report cannot be authorized through its document URL.

## Illustrative assignment query
```sql
SELECT a.id, a.title, a.subject_label, a.due_at,
       d.version AS draft_version, latest.attempt_no, latest.lifecycle_state
FROM vs_learning_assignment_recipient r
JOIN vs_learning_assignment a
  ON (a.organization_id,a.school_id,a.id)
   = (r.organization_id,r.school_id,r.assignment_id)
LEFT JOIN vs_learning_private_draft d
  ON (d.organization_id,d.school_id,d.assignment_id,d.student_id)
   = (r.organization_id,r.school_id,r.assignment_id,r.student_id)
LEFT JOIN LATERAL (
  SELECT s.attempt_no,s.lifecycle_state
  FROM vs_learning_submission_attempt s
  WHERE (s.organization_id,s.school_id,s.assignment_id,s.student_id)
      = (r.organization_id,r.school_id,r.assignment_id,r.student_id)
  ORDER BY s.attempt_no DESC LIMIT 1
) latest ON true
WHERE r.organization_id = :authorized_org
  AND r.school_id = :authorized_school
  AND r.student_id = :authorized_student
  AND r.audience_state = 'ACTIVE'
  AND a.publication_state = 'PUBLISHED'
ORDER BY a.due_at,a.id
LIMIT :bounded_page_size;
```

SQL is illustrative, not a migration. subject_label may be an owner projection/join, not a real column. Add current enrollment/date checks and cursor predicates from the real schema. Parameter values come from verified context, not untrusted request scope.

## Index and load plan
| Query | Proposed index / validation |
|---|---|
| Contexts | link(account_id,state,organization_id,student_id); active enrollment(org,student,state,school) |
| Recipient lookup | recipient(org,school,student,audience_state,assignment_id) |
| Published list | assignment(org,school,publication_state,due_at,id); verify planner with actual recipient cardinality |
| Own draft | unique draft(org,school,assignment,student) |
| Latest attempt | attempt(org,school,student,assignment,attempt_no DESC) |
| Returned feedback | feedback(org,school,student,state,returned_at DESC,id) |
| Own attendance | roster(org,school,student,session_id); session(org,school,date,id) |
| Command lookup | unique receipt(org,school,actor,operation,intent_key) |
| Pending requests | request(org,school,actor,status,created_at DESC,id) |

Run EXPLAIN (ANALYZE, BUFFERS) on representative distributions under the restricted runtime role when actual tables/policies exist. Use the existing 5,000 pupils/branch × 20 branches = 100,000 pupils total as baseline, with realistic assignments/attempts per pupil. The existing attendance-submit p95 < 1s excluding client network belongs to attendance; define separate assignment/list/upload SLOs before claiming them. Bound page size, examine scan/row counts and lock contention. Do not claim a proposed index proves performance.

## Table security classes
Global UserAccount uses Access-owned operations, not generic tenant SELECT. StudentAccountLink and official Person/Student contracts may be institution-scoped; enrollment/learning/attendance are branch-scoped. Each new physical table must have scope classification, owner/runtime privileges, intended RLS policy, WITH CHECK, indexes and rollout evidence under the actual TEN-ADR-006/TEN-03 decision. Preserve development-only exception records if still applicable. This proposal does not silently promote that exception to production.
