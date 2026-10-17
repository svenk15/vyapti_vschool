-- Forward-only metadata correction for the already-applied Support schema.
-- No table, row, constraint or index is changed.
COMMENT ON TABLE "vs_support_capability_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_procedure" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_referral" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_referral_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_handoff" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
