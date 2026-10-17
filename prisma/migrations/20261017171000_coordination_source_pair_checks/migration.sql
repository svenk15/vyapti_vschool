ALTER TABLE "vs_coordination_request"
  ADD CONSTRAINT "vs_coordination_request_source_kind_pair_check" CHECK (
    ("source_type" = 'ATTENDANCE_SESSION' AND "kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW')) OR
    ("source_type" = 'LEARNING_RECIPIENT' AND "kind" = 'LEARNING_SUPPORT_REVIEW')
  ),
  ADD CONSTRAINT "vs_coordination_request_kind_concern_pair_check" CHECK (
    ("kind" = 'MISSING_REGISTER' AND "concern" = 'MISSING_REGISTER') OR
    ("kind" = 'LEARNING_SUPPORT_REVIEW' AND "concern" = 'LEARNING_PROGRESS') OR
    ("kind" = 'SESSION_SETUP_REVIEW' AND "concern" IN ('WRONG_TIME','WRONG_OFFERING','DUPLICATE','OTHER'))
  ),
  ADD CONSTRAINT "vs_coordination_request_source_evidence_pair_check" CHECK (
    "resolution_kind" IS NULL OR
    "resolution_kind" = 'NO_CHANGE_NEEDED' OR
    ("source_type" = 'ATTENDANCE_SESSION' AND "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION')) OR
    ("source_type" = 'LEARNING_RECIPIENT' AND "resolution_kind" = 'LEARNING_POLICY_EVENT')
  );

COMMENT ON CONSTRAINT "vs_coordination_request_source_kind_pair_check" ON "vs_coordination_request" IS 'Fail-closed allowlist for registered typed owner-source and request-kind pairs.';
COMMENT ON CONSTRAINT "vs_coordination_request_kind_concern_pair_check" ON "vs_coordination_request" IS 'Fail-closed allowlist for request-kind and concern pairs.';
COMMENT ON CONSTRAINT "vs_coordination_request_source_evidence_pair_check" ON "vs_coordination_request" IS 'Fail-closed allowlist for typed owner-source evidence; NO_CHANGE_NEEDED remains source-neutral.';
