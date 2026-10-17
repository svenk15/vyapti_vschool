CREATE TABLE vs_attendance_correction_grant (
 id uuid PRIMARY KEY, organization_id uuid NOT NULL, school_id uuid NOT NULL, account_id uuid NOT NULL,
 purpose varchar(24) NOT NULL CHECK (purpose IN ('REQUEST_GUARDIAN','REQUEST_STUDENT','REQUEST_TEACHER','ROUTE','REVIEW')),
 granted_by_operator_id uuid NOT NULL, granted_at timestamptz(3) NOT NULL, revoked_at timestamptz(3), version integer NOT NULL CHECK(version>0),
 CONSTRAINT vs_attendance_correction_grant_scope_id_key UNIQUE(organization_id,school_id,id),
 CONSTRAINT vs_attendance_correction_grant_scope_account_purpose_key UNIQUE(organization_id,school_id,account_id,purpose),
 CONSTRAINT vs_attendance_correction_grant_account_fkey FOREIGN KEY(account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX vs_attendance_correction_grant_active_idx ON vs_attendance_correction_grant(organization_id,school_id,purpose,revoked_at,account_id);

CREATE TABLE vs_attendance_correction_request (
 id uuid PRIMARY KEY, organization_id uuid NOT NULL, school_id uuid NOT NULL, session_id uuid NOT NULL, student_id uuid NOT NULL,
 source_revision integer NOT NULL CHECK(source_revision>0), original_status varchar(16) NOT NULL, original_late_minutes integer,
 proposed_status varchar(16) NOT NULL, proposed_late_minutes integer, reason varchar(1000) NOT NULL CHECK(char_length(btrim(reason)) BETWEEN 5 AND 1000),
 requester_grant_id uuid NOT NULL, requester_account_id uuid NOT NULL, requester_kind varchar(16) NOT NULL CHECK(requester_kind IN ('GUARDIAN','STUDENT','TEACHER')),
 assigned_reviewer_grant_id uuid, status varchar(16) NOT NULL CHECK(status IN ('SUBMITTED','IN_REVIEW','CHANGED','APPLIED','DECLINED','WITHDRAWN')),
 version integer NOT NULL CHECK(version>0), reviewer_note varchar(1000), correction_command_key uuid, applied_attendance_revision integer,
 created_at timestamptz(3) NOT NULL, updated_at timestamptz(3) NOT NULL,
 CONSTRAINT vs_attendance_correction_request_scope_id_key UNIQUE(organization_id,school_id,id),
 CONSTRAINT vs_attendance_correction_request_session_fkey FOREIGN KEY(organization_id,school_id,session_id) REFERENCES vs_attendance_session(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_correction_request_roster_fkey FOREIGN KEY(organization_id,school_id,session_id,student_id) REFERENCES vs_attendance_session_roster_entry(organization_id,school_id,session_id,student_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_correction_request_requester_grant_fkey FOREIGN KEY(organization_id,school_id,requester_grant_id) REFERENCES vs_attendance_correction_grant(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_correction_request_reviewer_grant_fkey FOREIGN KEY(organization_id,school_id,assigned_reviewer_grant_id) REFERENCES vs_attendance_correction_grant(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_correction_request_requester_fkey FOREIGN KEY(requester_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_correction_request_values_check CHECK(
   original_status IN ('PRESENT','ABSENT','LATE','EXCUSED') AND proposed_status IN ('PRESENT','ABSENT','LATE','EXCUSED') AND
   ((original_status='LATE' AND original_late_minutes BETWEEN 1 AND 480) OR (original_status<>'LATE' AND original_late_minutes IS NULL)) AND
   ((proposed_status='LATE' AND proposed_late_minutes BETWEEN 1 AND 480) OR (proposed_status<>'LATE' AND proposed_late_minutes IS NULL)) AND
   (original_status<>proposed_status OR original_late_minutes IS DISTINCT FROM proposed_late_minutes)
 ),
 CONSTRAINT vs_attendance_correction_request_state_check CHECK(
   (status='SUBMITTED' AND assigned_reviewer_grant_id IS NULL AND reviewer_note IS NULL AND correction_command_key IS NULL AND applied_attendance_revision IS NULL) OR
   (status='IN_REVIEW' AND assigned_reviewer_grant_id IS NOT NULL AND reviewer_note IS NULL AND correction_command_key IS NULL AND applied_attendance_revision IS NULL) OR
   (status='CHANGED' AND assigned_reviewer_grant_id IS NOT NULL AND correction_command_key IS NULL AND applied_attendance_revision IS NULL) OR
   (status='APPLIED' AND assigned_reviewer_grant_id IS NOT NULL AND reviewer_note IS NOT NULL AND correction_command_key IS NOT NULL AND applied_attendance_revision IS NOT NULL) OR
   (status='DECLINED' AND assigned_reviewer_grant_id IS NOT NULL AND reviewer_note IS NOT NULL AND correction_command_key IS NULL AND applied_attendance_revision IS NULL) OR
   status='WITHDRAWN'
 )
);
CREATE UNIQUE INDEX vs_attendance_correction_request_active_key ON vs_attendance_correction_request(organization_id,school_id,session_id,student_id,source_revision) WHERE status IN ('SUBMITTED','IN_REVIEW','CHANGED');
CREATE INDEX vs_attendance_correction_request_route_idx ON vs_attendance_correction_request(organization_id,school_id,status,created_at,id);
CREATE INDEX vs_attendance_correction_request_reviewer_idx ON vs_attendance_correction_request(organization_id,school_id,assigned_reviewer_grant_id,status,created_at,id);
CREATE INDEX vs_attendance_correction_request_requester_idx ON vs_attendance_correction_request(requester_account_id,created_at DESC,id);

CREATE TABLE vs_attendance_correction_request_event (
 id uuid PRIMARY KEY, organization_id uuid NOT NULL, school_id uuid NOT NULL, request_id uuid NOT NULL, actor_account_id uuid NOT NULL,
 type varchar(24) NOT NULL CHECK(type IN ('SUBMITTED','ROUTED','SOURCE_CHANGED','APPLIED','DECLINED','WITHDRAWN')),
 request_version integer NOT NULL CHECK(request_version>0), details jsonb NOT NULL, occurred_at timestamptz(3) NOT NULL,
 CONSTRAINT vs_attendance_correction_request_event_scope_id_key UNIQUE(organization_id,school_id,id),
 CONSTRAINT vs_attendance_correction_request_event_request_fkey FOREIGN KEY(organization_id,school_id,request_id) REFERENCES vs_attendance_correction_request(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_attendance_correction_request_event_actor_fkey FOREIGN KEY(actor_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX vs_attendance_correction_request_event_history_idx ON vs_attendance_correction_request_event(organization_id,school_id,request_id,occurred_at,id);
CREATE FUNCTION vs_attendance_correction_event_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'attendance correction request events are immutable'; END $$;
CREATE TRIGGER vs_attendance_correction_event_immutable_trigger BEFORE UPDATE OR DELETE ON vs_attendance_correction_request_event FOR EACH ROW EXECUTE FUNCTION vs_attendance_correction_event_immutable();

COMMENT ON TABLE vs_attendance_correction_grant IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE vs_attendance_correction_request IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE vs_attendance_correction_request_event IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
