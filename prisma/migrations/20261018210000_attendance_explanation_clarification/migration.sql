ALTER TABLE vs_attendance_explanation_reviewer_grant
 ADD CONSTRAINT vs_attendance_explanation_reviewer_scope_id_key UNIQUE (organization_id,school_id,id);

ALTER TABLE vs_attendance_explanation
 ADD COLUMN assigned_reviewer_grant_id uuid;

WITH eligible AS (
 SELECT organization_id,school_id,MIN(id::text)::uuid AS grant_id
 FROM vs_attendance_explanation_reviewer_grant
 WHERE revoked_at IS NULL
 GROUP BY organization_id,school_id
 HAVING COUNT(*)=1
)
UPDATE vs_attendance_explanation e
SET assigned_reviewer_grant_id=eligible.grant_id
FROM eligible
WHERE e.organization_id=eligible.organization_id AND e.school_id=eligible.school_id;

ALTER TABLE vs_attendance_explanation
 ADD CONSTRAINT vs_attendance_explanation_assigned_reviewer_fkey
 FOREIGN KEY (organization_id,school_id,assigned_reviewer_grant_id)
 REFERENCES vs_attendance_explanation_reviewer_grant(organization_id,school_id,id)
 ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE INDEX vs_attendance_explanation_assigned_reviewer_idx
 ON vs_attendance_explanation(organization_id,school_id,assigned_reviewer_grant_id,status,submitted_at,id);

CREATE TABLE vs_attendance_explanation_clarification (
 id uuid PRIMARY KEY,
 organization_id uuid NOT NULL,
 school_id uuid NOT NULL,
 explanation_id uuid NOT NULL,
 student_id uuid NOT NULL,
 reviewer_grant_id uuid NOT NULL,
 requested_by_account_id uuid NOT NULL,
 originator_access_id uuid NOT NULL,
 originator_account_id uuid NOT NULL,
 question varchar(1000) NOT NULL CHECK (char_length(btrim(question)) BETWEEN 5 AND 1000),
 answer varchar(1000),
 status varchar(16) NOT NULL CHECK (status IN ('OPEN','ANSWERED','CLOSED')),
 version integer NOT NULL CHECK (version > 0),
 requested_at timestamptz(3) NOT NULL,
 answered_at timestamptz(3),
 CONSTRAINT vs_attendance_explanation_clarification_scope_id_key UNIQUE (organization_id,school_id,id),
 CONSTRAINT vs_attendance_explanation_clarification_explanation_fkey FOREIGN KEY (organization_id,school_id,explanation_id) REFERENCES vs_attendance_explanation(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_clarification_reviewer_fkey FOREIGN KEY (organization_id,school_id,reviewer_grant_id) REFERENCES vs_attendance_explanation_reviewer_grant(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_clarification_originator_access_fkey FOREIGN KEY (organization_id,school_id,originator_access_id,student_id) REFERENCES vs_guardians_child_access(organization_id,school_id,id,student_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_clarification_requester_fkey FOREIGN KEY (requested_by_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_clarification_originator_fkey FOREIGN KEY (originator_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_explanation_clarification_state_check CHECK (
   (status='OPEN' AND answer IS NULL AND answered_at IS NULL) OR
   (status='ANSWERED' AND char_length(btrim(answer)) BETWEEN 5 AND 1000 AND answered_at IS NOT NULL) OR
   (status='CLOSED' AND answered_at IS NOT NULL)
 )
);

CREATE UNIQUE INDEX vs_attendance_explanation_clarification_open_key
 ON vs_attendance_explanation_clarification(organization_id,school_id,explanation_id)
 WHERE status='OPEN';
CREATE INDEX vs_attendance_explanation_clarification_history_idx
 ON vs_attendance_explanation_clarification(organization_id,school_id,explanation_id,requested_at,id);
CREATE INDEX vs_attendance_explanation_clarification_originator_idx
 ON vs_attendance_explanation_clarification(originator_access_id,originator_account_id,status,requested_at);

COMMENT ON TABLE vs_attendance_explanation_clarification IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
