-- ATT-02 roll call. These new tenant tables use TEN-ADR-006 Path A: BRANCH
-- metadata is explicit now and policy enforcement remains consolidated in TEN-03.
CREATE TABLE vs_attendance_session_roster_entry (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  session_id uuid NOT NULL,
  student_id uuid NOT NULL,
  student_version integer NOT NULL,
  enrollment_version integer NOT NULL,
  display_name_snapshot varchar(210) NOT NULL,
  roll_number_snapshot varchar(30),
  CONSTRAINT vs_attendance_session_roster_entry_pkey PRIMARY KEY (id),
  CONSTRAINT vs_attendance_session_roster_entry_scope_student_key UNIQUE (organization_id, school_id, session_id, student_id),
  CONSTRAINT vs_attendance_session_roster_entry_versions_check CHECK (student_version >= 1 AND enrollment_version >= 1),
  CONSTRAINT vs_attendance_session_roster_entry_session_fkey FOREIGN KEY (organization_id, school_id, session_id) REFERENCES vs_attendance_session (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_attendance_session_roster_entry_student_fkey FOREIGN KEY (organization_id, school_id, student_id) REFERENCES vs_students_student (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE vs_attendance_record (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  session_id uuid NOT NULL,
  student_id uuid NOT NULL,
  status varchar(20) NOT NULL,
  late_minutes integer,
  current_revision integer NOT NULL,
  CONSTRAINT vs_attendance_record_pkey PRIMARY KEY (id),
  CONSTRAINT vs_attendance_record_session_student_key UNIQUE (organization_id, school_id, session_id, student_id),
  CONSTRAINT vs_attendance_record_status_check CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
  CONSTRAINT vs_attendance_record_late_check CHECK ((status = 'LATE' AND late_minutes BETWEEN 1 AND 480) OR (status <> 'LATE' AND late_minutes IS NULL)),
  CONSTRAINT vs_attendance_record_revision_check CHECK (current_revision >= 1),
  CONSTRAINT vs_attendance_record_session_fkey FOREIGN KEY (organization_id, school_id, session_id) REFERENCES vs_attendance_session (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_attendance_record_roster_fkey FOREIGN KEY (organization_id, school_id, session_id, student_id) REFERENCES vs_attendance_session_roster_entry (organization_id, school_id, session_id, student_id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE vs_attendance_revision (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  session_id uuid NOT NULL,
  number integer NOT NULL,
  kind varchar(20) NOT NULL,
  actor_account_id uuid NOT NULL,
  occurred_at timestamptz(3) NOT NULL,
  reason varchar(500),
  changes jsonb NOT NULL,
  CONSTRAINT vs_attendance_revision_pkey PRIMARY KEY (id),
  CONSTRAINT vs_attendance_revision_number_key UNIQUE (organization_id, school_id, session_id, number),
  CONSTRAINT vs_attendance_revision_number_check CHECK (number >= 1),
  CONSTRAINT vs_attendance_revision_kind_check CHECK (kind IN ('SUBMIT', 'CORRECT', 'CANCEL')),
  CONSTRAINT vs_attendance_revision_reason_check CHECK ((kind = 'SUBMIT' AND reason IS NULL) OR (kind IN ('CORRECT', 'CANCEL') AND reason IS NOT NULL AND length(btrim(reason)) BETWEEN 5 AND 500)),
  CONSTRAINT vs_attendance_revision_changes_check CHECK (jsonb_typeof(changes) = 'object'),
  CONSTRAINT vs_attendance_revision_session_fkey FOREIGN KEY (organization_id, school_id, session_id) REFERENCES vs_attendance_session (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_attendance_revision_actor_fkey FOREIGN KEY (actor_account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TRIGGER vs_attendance_session_roster_entry_immutable_trg
  BEFORE UPDATE OR DELETE ON vs_attendance_session_roster_entry
  FOR EACH ROW EXECUTE FUNCTION vs_platform_deny_history_change();
CREATE TRIGGER vs_attendance_revision_append_only_trg
  BEFORE UPDATE OR DELETE ON vs_attendance_revision
  FOR EACH ROW EXECUTE FUNCTION vs_platform_deny_history_change();

COMMENT ON TABLE vs_attendance_session_roster_entry IS 'TEN-ADR-006 Path A; BRANCH class; owner attendance; scope organization_id,school_id; RLS enforcement deferred to TEN-03; application authorization remains required.';
COMMENT ON TABLE vs_attendance_record IS 'TEN-ADR-006 Path A; BRANCH class; owner attendance; scope organization_id,school_id; RLS enforcement deferred to TEN-03; application authorization remains required.';
COMMENT ON TABLE vs_attendance_revision IS 'TEN-ADR-006 Path A; BRANCH class; owner attendance; scope organization_id,school_id; RLS enforcement deferred to TEN-03; application authorization remains required.';
