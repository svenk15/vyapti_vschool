ALTER TABLE vs_guardians_purpose_grant DROP CONSTRAINT vs_guardians_purpose_grant_purpose_check;
ALTER TABLE vs_guardians_purpose_grant ADD CONSTRAINT vs_guardians_purpose_grant_purpose_check CHECK (purpose IN ('child.summary.read','attendance.read_child','timetable.read_child','communication.notice.read','attendance.explanation.submit'));

CREATE TABLE vs_attendance_explanation_reviewer_grant (
 id uuid PRIMARY KEY,
 organization_id uuid NOT NULL,
 school_id uuid NOT NULL,
 membership_id uuid NOT NULL,
 account_id uuid NOT NULL,
 granted_by_operator_id uuid NOT NULL,
 granted_at timestamptz(3) NOT NULL,
 revoked_at timestamptz(3),
 version integer NOT NULL CHECK (version > 0),
 CONSTRAINT vs_attendance_explanation_reviewer_membership_fkey FOREIGN KEY (organization_id,school_id,membership_id,account_id) REFERENCES vs_access_school_membership(organization_id,school_id,id,account_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_reviewer_scope_account_key UNIQUE (organization_id,school_id,account_id)
);
CREATE INDEX vs_attendance_explanation_reviewer_active_idx ON vs_attendance_explanation_reviewer_grant(organization_id,school_id,account_id,revoked_at);

CREATE TABLE vs_attendance_explanation (
 id uuid PRIMARY KEY,
 organization_id uuid NOT NULL,
 school_id uuid NOT NULL,
 session_id uuid NOT NULL,
 student_id uuid NOT NULL,
 guardian_access_id uuid NOT NULL,
 submitter_account_id uuid NOT NULL,
 category varchar(40) NOT NULL CHECK (category IN ('HEALTH_RELATED','FAMILY_COMMITMENT','SCHOOL_APPROVED_ACTIVITY','OTHER')),
 explanation varchar(1000) NOT NULL CHECK (char_length(btrim(explanation)) BETWEEN 10 AND 1000),
 status varchar(16) NOT NULL CHECK (status IN ('SUBMITTED','ACCEPTED','DECLINED','WITHDRAWN')),
 version integer NOT NULL CHECK (version > 0),
 submitted_at timestamptz(3) NOT NULL,
 reviewed_at timestamptz(3),
 reviewed_by_account_id uuid,
 school_response varchar(1000),
 withdrawn_at timestamptz(3),
 updated_at timestamptz(3) NOT NULL,
 CONSTRAINT vs_attendance_explanation_scope_id_key UNIQUE (organization_id,school_id,id),
 CONSTRAINT vs_attendance_explanation_roster_fkey FOREIGN KEY (organization_id,school_id,session_id,student_id) REFERENCES vs_attendance_session_roster_entry(organization_id,school_id,session_id,student_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_guardian_access_fkey FOREIGN KEY (organization_id,school_id,guardian_access_id,student_id) REFERENCES vs_guardians_child_access(organization_id,school_id,id,student_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_submitter_fkey FOREIGN KEY (submitter_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_reviewer_fkey FOREIGN KEY (reviewed_by_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_state_check CHECK (
  (status='SUBMITTED' AND reviewed_at IS NULL AND reviewed_by_account_id IS NULL AND school_response IS NULL AND withdrawn_at IS NULL) OR
  (status IN ('ACCEPTED','DECLINED') AND reviewed_at IS NOT NULL AND reviewed_by_account_id IS NOT NULL AND char_length(btrim(school_response)) BETWEEN 5 AND 1000 AND withdrawn_at IS NULL) OR
  (status='WITHDRAWN' AND reviewed_at IS NULL AND reviewed_by_account_id IS NULL AND school_response IS NULL AND withdrawn_at IS NOT NULL)
 )
);
CREATE UNIQUE INDEX vs_attendance_explanation_active_key ON vs_attendance_explanation(organization_id,school_id,session_id,student_id) WHERE status IN ('SUBMITTED','ACCEPTED');
CREATE INDEX vs_attendance_explanation_parent_idx ON vs_attendance_explanation(guardian_access_id,submitted_at DESC,id);
CREATE INDEX vs_attendance_explanation_review_idx ON vs_attendance_explanation(organization_id,school_id,status,submitted_at,id);
CREATE INDEX vs_attendance_explanation_session_student_idx ON vs_attendance_explanation(organization_id,school_id,session_id,student_id);

COMMENT ON TABLE vs_attendance_explanation_reviewer_grant IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE vs_attendance_explanation IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
