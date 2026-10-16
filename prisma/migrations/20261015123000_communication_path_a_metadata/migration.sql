-- Forward-only correction of Communication Path A metadata. The preceding
-- migrations are already applied locally and remain immutable.
COMMENT ON TABLE "vs_communication_publisher_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice_version" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_recipient" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_recipient_binding" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_acknowledgement" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_guardians_purpose_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
