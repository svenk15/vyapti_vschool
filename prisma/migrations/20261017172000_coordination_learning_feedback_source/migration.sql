ALTER TABLE "vs_learning_manager_grant" DROP CONSTRAINT "vs_learning_manager_grant_capability_check";
ALTER TABLE "vs_learning_manager_grant" ADD CONSTRAINT "vs_learning_manager_grant_capability_check" CHECK ("capability" IN ('RECIPIENT_POLICY_MANAGE','RECIPIENT_STATUS_READ','FEEDBACK_FOLLOW_UP'));

ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_check" CHECK ("kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW','LEARNING_SUPPORT_REVIEW','LEARNING_FEEDBACK_FOLLOW_UP'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_type_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_type_check" CHECK ("source_type" IN ('ATTENDANCE_SESSION','LEARNING_RECIPIENT','LEARNING_FEEDBACK_SUBMISSION'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_concern_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_concern_check" CHECK ("concern" IN ('MISSING_REGISTER','WRONG_TIME','WRONG_OFFERING','DUPLICATE','LEARNING_PROGRESS','FEEDBACK_AWAITING','OTHER'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_evidence_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_evidence_check" CHECK ("resolution_kind" IS NULL OR "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','LEARNING_POLICY_EVENT','LEARNING_FEEDBACK_PUBLICATION','NO_CHANGE_NEEDED'));
ALTER TABLE "vs_coordination_request_event" DROP CONSTRAINT "vs_coordination_request_event_evidence_check";
ALTER TABLE "vs_coordination_request_event" ADD CONSTRAINT "vs_coordination_request_event_evidence_check" CHECK ("evidence_kind" IS NULL OR "evidence_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','LEARNING_POLICY_EVENT','LEARNING_FEEDBACK_PUBLICATION','NO_CHANGE_NEEDED'));

ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_kind_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_kind_pair_check" CHECK (
  ("source_type" = 'ATTENDANCE_SESSION' AND "kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW')) OR
  ("source_type" = 'LEARNING_RECIPIENT' AND "kind" = 'LEARNING_SUPPORT_REVIEW') OR
  ("source_type" = 'LEARNING_FEEDBACK_SUBMISSION' AND "kind" = 'LEARNING_FEEDBACK_FOLLOW_UP')
);
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_concern_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_concern_pair_check" CHECK (
  ("kind" = 'MISSING_REGISTER' AND "concern" = 'MISSING_REGISTER') OR
  ("kind" = 'LEARNING_SUPPORT_REVIEW' AND "concern" = 'LEARNING_PROGRESS') OR
  ("kind" = 'LEARNING_FEEDBACK_FOLLOW_UP' AND "concern" = 'FEEDBACK_AWAITING') OR
  ("kind" = 'SESSION_SETUP_REVIEW' AND "concern" IN ('WRONG_TIME','WRONG_OFFERING','DUPLICATE','OTHER'))
);
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_evidence_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_evidence_pair_check" CHECK (
  "resolution_kind" IS NULL OR
  "resolution_kind" = 'NO_CHANGE_NEEDED' OR
  ("source_type" = 'ATTENDANCE_SESSION' AND "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION')) OR
  ("source_type" = 'LEARNING_RECIPIENT' AND "resolution_kind" = 'LEARNING_POLICY_EVENT') OR
  ("source_type" = 'LEARNING_FEEDBACK_SUBMISSION' AND "resolution_kind" = 'LEARNING_FEEDBACK_PUBLICATION')
);

CREATE OR REPLACE FUNCTION vs_coordination_request_source_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.source_type = 'ATTENDANCE_SESSION' THEN
    PERFORM 1 FROM vs_attendance_session source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'LEARNING_RECIPIENT' THEN
    PERFORM 1 FROM vs_learning_assignment_recipient source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'LEARNING_FEEDBACK_SUBMISSION' THEN
    PERFORM 1 FROM vs_learning_submission_attempt source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSE
    RAISE EXCEPTION 'unsupported coordination source type' USING ERRCODE='23514';
  END IF;
  IF NOT FOUND THEN RAISE EXCEPTION 'coordination source is outside the scoped owner table' USING ERRCODE='23503'; END IF;
  RETURN NEW;
END $$;

COMMENT ON TABLE "vs_learning_manager_grant" IS 'TEN-ADR-006 Path A; BRANCH class; owner learning; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Exact class/subject synthetic-only recipient-policy, named-status or feedback-follow-up designation.';
COMMENT ON TABLE "vs_coordination_request" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Synthetic-only typed Attendance/Learning follow-up aggregate pending retention policy.';
