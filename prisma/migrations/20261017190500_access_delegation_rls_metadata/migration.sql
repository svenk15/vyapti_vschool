-- Forward-only metadata correction for F02 tables already installed by the
-- preceding migration. No table, row, constraint or index is changed.
COMMENT ON TABLE "vs_access_leadership_delegation" IS 'TEN-ADR-006 Path A classification=BRANCH owner=access scope=organization_id,school_id closureGate=TEN-03';
COMMENT ON TABLE "vs_access_leadership_delegation_action" IS 'TEN-ADR-006 Path A classification=BRANCH owner=access scope=organization_id,school_id closureGate=TEN-03';
COMMENT ON TABLE "vs_access_leadership_delegation_receipt" IS 'TEN-ADR-006 Path A classification=BRANCH owner=access scope=organization_id,school_id closureGate=TEN-03';
COMMENT ON TABLE "vs_access_leadership_delegation_event" IS 'TEN-ADR-006 Path A classification=BRANCH owner=access scope=organization_id,school_id closureGate=TEN-03';
