-- Forward metadata correction for the already-applied STF-05 table migration.
COMMENT ON TABLE vs_academics_teacher_eligibility_period IS
  'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
