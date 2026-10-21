ALTER TABLE "vs_guardians_child_access"
  ADD COLUMN "relationship" VARCHAR(20);

ALTER TABLE "vs_guardians_child_access"
  ADD CONSTRAINT "vs_guardians_child_access_relationship_check"
  CHECK ("relationship" IS NULL OR "relationship" IN ('MOTHER', 'FATHER', 'GUARDIAN'));

COMMENT ON COLUMN "vs_guardians_child_access"."relationship" IS
  'Optional descriptive relationship to the student. It grants no authority and does not select identity.';
