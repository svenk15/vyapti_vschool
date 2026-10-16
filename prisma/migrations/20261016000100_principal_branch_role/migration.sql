ALTER TABLE vs_access_role_grant
  DROP CONSTRAINT vs_access_role_grant_state_check;

ALTER TABLE vs_access_role_grant
  ADD CONSTRAINT vs_access_role_grant_state_check
  CHECK (code IN ('SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL'));
