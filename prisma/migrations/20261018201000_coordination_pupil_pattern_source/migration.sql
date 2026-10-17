ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_check" CHECK ("kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW','PUPIL_ATTENDANCE_SUPPORT','LEARNING_SUPPORT_REVIEW','LEARNING_FEEDBACK_FOLLOW_UP'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_type_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_type_check" CHECK ("source_type" IN ('ATTENDANCE_SESSION','ATTENDANCE_PUPIL_PATTERN','LEARNING_RECIPIENT','LEARNING_FEEDBACK_SUBMISSION'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_concern_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_concern_check" CHECK ("concern" IN ('MISSING_REGISTER','WRONG_TIME','WRONG_OFFERING','DUPLICATE','ATTENDANCE_SUPPORT','LEARNING_PROGRESS','FEEDBACK_AWAITING','OTHER'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_kind_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_kind_pair_check" CHECK (
  ("source_type" = 'ATTENDANCE_SESSION' AND "kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW')) OR
  ("source_type" = 'ATTENDANCE_PUPIL_PATTERN' AND "kind" = 'PUPIL_ATTENDANCE_SUPPORT') OR
  ("source_type" = 'LEARNING_RECIPIENT' AND "kind" = 'LEARNING_SUPPORT_REVIEW') OR
  ("source_type" = 'LEARNING_FEEDBACK_SUBMISSION' AND "kind" = 'LEARNING_FEEDBACK_FOLLOW_UP')
);
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_concern_pair_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_concern_pair_check" CHECK (
  ("kind" = 'MISSING_REGISTER' AND "concern" = 'MISSING_REGISTER') OR
  ("kind" = 'PUPIL_ATTENDANCE_SUPPORT' AND "concern" = 'ATTENDANCE_SUPPORT') OR
  ("kind" = 'LEARNING_SUPPORT_REVIEW' AND "concern" = 'LEARNING_PROGRESS') OR
  ("kind" = 'LEARNING_FEEDBACK_FOLLOW_UP' AND "concern" = 'FEEDBACK_AWAITING') OR
  ("kind" = 'SESSION_SETUP_REVIEW' AND "concern" IN ('WRONG_TIME','WRONG_OFFERING','DUPLICATE','OTHER'))
);
CREATE OR REPLACE FUNCTION vs_coordination_request_source_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.source_type = 'ATTENDANCE_SESSION' THEN
    PERFORM 1 FROM vs_attendance_session source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'ATTENDANCE_PUPIL_PATTERN' THEN
    PERFORM 1 FROM vs_attendance_pupil_review_snapshot source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
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
