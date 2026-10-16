BEGIN;

ALTER TABLE vs_imports_import_job
  DROP CONSTRAINT vs_imports_import_job_state_check,
  ADD CONSTRAINT vs_imports_import_job_state_check CHECK (state IN ('UPLOADED','REVIEW','CONFIRMED','RUNNING','COMPLETED','COMPLETED_WITH_ERRORS','FAILED','CANCELLED'));

ALTER TABLE vs_imports_import_row
  ALTER COLUMN normalized DROP NOT NULL,
  DROP CONSTRAINT vs_imports_import_row_json_check,
  ADD CONSTRAINT vs_imports_import_row_json_check CHECK ((normalized IS NULL OR jsonb_typeof(normalized) = 'object') AND jsonb_typeof(expected_references) = 'object' AND jsonb_typeof(errors) = 'array');

CREATE INDEX vs_imports_import_source_expiry_idx
  ON vs_imports_import_job (source_expires_at, id)
  WHERE source_bytes IS NOT NULL;
CREATE INDEX vs_imports_import_row_detail_expiry_idx
  ON vs_imports_import_row (organization_id, school_id, job_id, row_number)
  WHERE normalized IS NOT NULL;

CREATE TABLE vs_platform_operator_audit (
  id uuid PRIMARY KEY,
  operator_id uuid NOT NULL,
  command varchar(80) NOT NULL,
  resource_type varchar(80) NOT NULL,
  resource_id uuid NOT NULL,
  occurred_at timestamptz(3) NOT NULL,
  details jsonb NOT NULL,
  CONSTRAINT vs_platform_operator_audit_command_check CHECK (command = btrim(command) AND length(command) BETWEEN 1 AND 80),
  CONSTRAINT vs_platform_operator_audit_details_check CHECK (jsonb_typeof(details) = 'object')
);
CREATE INDEX vs_platform_operator_audit_actor_idx ON vs_platform_operator_audit (operator_id, occurred_at, id);
CREATE FUNCTION vs_platform_operator_audit_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'operator audit is append only' USING ERRCODE = '55000'; END $$;
CREATE TRIGGER vs_platform_operator_audit_append_only_trg BEFORE UPDATE OR DELETE ON vs_platform_operator_audit FOR EACH ROW EXECUTE FUNCTION vs_platform_operator_audit_append_only();

COMMIT;
