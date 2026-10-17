ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_fkey";

ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_kind_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_kind_check" CHECK ("kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW','LEARNING_SUPPORT_REVIEW'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_source_type_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_source_type_check" CHECK ("source_type" IN ('ATTENDANCE_SESSION','LEARNING_RECIPIENT'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_concern_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_concern_check" CHECK ("concern" IN ('MISSING_REGISTER','WRONG_TIME','WRONG_OFFERING','DUPLICATE','LEARNING_PROGRESS','OTHER'));
ALTER TABLE "vs_coordination_request" DROP CONSTRAINT "vs_coordination_request_evidence_check";
ALTER TABLE "vs_coordination_request" ADD CONSTRAINT "vs_coordination_request_evidence_check" CHECK ("resolution_kind" IS NULL OR "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','LEARNING_POLICY_EVENT','NO_CHANGE_NEEDED'));
ALTER TABLE "vs_coordination_request_event" DROP CONSTRAINT "vs_coordination_request_event_evidence_check";
ALTER TABLE "vs_coordination_request_event" ADD CONSTRAINT "vs_coordination_request_event_evidence_check" CHECK ("evidence_kind" IS NULL OR "evidence_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','LEARNING_POLICY_EVENT','NO_CHANGE_NEEDED'));

CREATE FUNCTION vs_coordination_request_source_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.source_type = 'ATTENDANCE_SESSION' THEN
    PERFORM 1 FROM vs_attendance_session source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSIF NEW.source_type = 'LEARNING_RECIPIENT' THEN
    PERFORM 1 FROM vs_learning_assignment_recipient source WHERE source.organization_id=NEW.organization_id AND source.school_id=NEW.school_id AND source.id=NEW.source_id;
  ELSE
    RAISE EXCEPTION 'unsupported coordination source type' USING ERRCODE='23514';
  END IF;
  IF NOT FOUND THEN RAISE EXCEPTION 'coordination source is outside the scoped owner table' USING ERRCODE='23503'; END IF;
  RETURN NEW;
END $$;

CREATE CONSTRAINT TRIGGER vs_coordination_request_source_guard_trigger
AFTER INSERT OR UPDATE OF organization_id,school_id,source_type,source_id ON "vs_coordination_request"
DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION vs_coordination_request_source_guard();

COMMENT ON FUNCTION vs_coordination_request_source_guard() IS 'Typed scoped source-integrity guard for registered Coordination owner adapters; application authorization remains mandatory.';
COMMENT ON TABLE "vs_coordination_request" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Synthetic-only typed Attendance/Learning follow-up aggregate pending retention policy.';
