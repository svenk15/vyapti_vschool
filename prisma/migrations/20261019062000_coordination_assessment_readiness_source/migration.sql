ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_check" CHECK ("kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW','PUPIL_ATTENDANCE_SUPPORT','LEARNING_SUPPORT_REVIEW','LEARNING_FEEDBACK_FOLLOW_UP','MEETING_FOLLOW_UP','FACILITIES_FOLLOW_UP','ASSESSMENT_READINESS_FOLLOW_UP'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_type_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_type_check" CHECK ("source_type" IN ('ATTENDANCE_SESSION','ATTENDANCE_PUPIL_PATTERN','LEARNING_RECIPIENT','LEARNING_FEEDBACK_SUBMISSION','EVENT_MEETING_ACTION','FACILITIES_INCIDENT','ASSESSMENT_READINESS'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_concern_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_concern_check" CHECK ("concern" IN ('MISSING_REGISTER','WRONG_TIME','WRONG_OFFERING','DUPLICATE','ATTENDANCE_SUPPORT','LEARNING_PROGRESS','FEEDBACK_AWAITING','ASSESSMENT_READINESS','OTHER'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_evidence_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_evidence_check" CHECK ("resolution_kind" IS NULL OR "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','LEARNING_POLICY_EVENT','LEARNING_FEEDBACK_PUBLICATION','FACILITIES_RESTORATION','ASSESSMENT_READINESS_RECHECK','NO_CHANGE_NEEDED'));
ALTER TABLE "vs_coordination_request_event" DROP CONSTRAINT "vs_coordination_request_event_evidence_check";
ALTER TABLE "vs_coordination_request_event" ADD CONSTRAINT "vs_coordination_request_event_evidence_check" CHECK ("evidence_kind" IS NULL OR "evidence_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','LEARNING_POLICY_EVENT','LEARNING_FEEDBACK_PUBLICATION','FACILITIES_RESTORATION','ASSESSMENT_READINESS_RECHECK','NO_CHANGE_NEEDED'));

ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_kind_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_kind_pair_check" CHECK (
  ("source_type" = 'ATTENDANCE_SESSION' AND "kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW')) OR
  ("source_type" = 'ATTENDANCE_PUPIL_PATTERN' AND "kind" = 'PUPIL_ATTENDANCE_SUPPORT') OR
  ("source_type" = 'LEARNING_RECIPIENT' AND "kind" = 'LEARNING_SUPPORT_REVIEW') OR
  ("source_type" = 'LEARNING_FEEDBACK_SUBMISSION' AND "kind" = 'LEARNING_FEEDBACK_FOLLOW_UP') OR
  ("source_type" = 'EVENT_MEETING_ACTION' AND "kind" = 'MEETING_FOLLOW_UP') OR
  ("source_type" = 'FACILITIES_INCIDENT' AND "kind" = 'FACILITIES_FOLLOW_UP') OR
  ("source_type" = 'ASSESSMENT_READINESS' AND "kind" = 'ASSESSMENT_READINESS_FOLLOW_UP')
);
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_concern_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_concern_pair_check" CHECK (
  ("kind" = 'MISSING_REGISTER' AND "concern" = 'MISSING_REGISTER') OR
  ("kind" = 'PUPIL_ATTENDANCE_SUPPORT' AND "concern" = 'ATTENDANCE_SUPPORT') OR
  ("kind" = 'LEARNING_SUPPORT_REVIEW' AND "concern" = 'LEARNING_PROGRESS') OR
  ("kind" = 'LEARNING_FEEDBACK_FOLLOW_UP' AND "concern" = 'FEEDBACK_AWAITING') OR
  ("kind" = 'ASSESSMENT_READINESS_FOLLOW_UP' AND "concern" = 'ASSESSMENT_READINESS') OR
  ("kind" IN ('MEETING_FOLLOW_UP','FACILITIES_FOLLOW_UP') AND "concern" = 'OTHER') OR
  ("kind" = 'SESSION_SETUP_REVIEW' AND "concern" IN ('WRONG_TIME','WRONG_OFFERING','DUPLICATE','OTHER'))
);
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_evidence_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_evidence_pair_check" CHECK (
  "resolution_kind" IS NULL OR "resolution_kind" = 'NO_CHANGE_NEEDED' OR
  ("source_type" = 'ATTENDANCE_SESSION' AND "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION')) OR
  ("source_type" = 'LEARNING_RECIPIENT' AND "resolution_kind" = 'LEARNING_POLICY_EVENT') OR
  ("source_type" = 'LEARNING_FEEDBACK_SUBMISSION' AND "resolution_kind" = 'LEARNING_FEEDBACK_PUBLICATION') OR
  ("source_type" = 'FACILITIES_INCIDENT' AND "resolution_kind" = 'FACILITIES_RESTORATION') OR
  ("source_type" = 'ASSESSMENT_READINESS' AND "resolution_kind" = 'ASSESSMENT_READINESS_RECHECK')
);

CREATE OR REPLACE FUNCTION vs_coordination_request_source_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.source_type = 'ATTENDANCE_SESSION' THEN PERFORM 1 FROM vs_attendance_session source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'ATTENDANCE_PUPIL_PATTERN' THEN PERFORM 1 FROM vs_attendance_pupil_review_snapshot source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'LEARNING_RECIPIENT' THEN PERFORM 1 FROM vs_learning_assignment_recipient source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'LEARNING_FEEDBACK_SUBMISSION' THEN PERFORM 1 FROM vs_learning_submission_attempt source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'EVENT_MEETING_ACTION' THEN PERFORM 1 FROM vs_events_meeting_action source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'FACILITIES_INCIDENT' THEN PERFORM 1 FROM vs_facilities_incident source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'ASSESSMENT_READINESS' THEN PERFORM 1 FROM vs_assessments_cycle source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSE RAISE EXCEPTION 'unsupported coordination source type' USING ERRCODE='23514';
  END IF;
  IF NOT FOUND THEN RAISE EXCEPTION 'coordination source is outside the scoped owner table' USING ERRCODE='23503'; END IF;
  RETURN NEW;
END $$;

COMMENT ON CONSTRAINT "vs_coordination_request_source_kind_pair_check" ON "vs_coordination_request" IS 'Fail-closed allowlist for typed owner-source and request-kind pairs, including exact Assessments readiness cycles.';
