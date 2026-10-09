-- Path A: register BRANCH scope and policy intent now; TEN-03 owns database enforcement.
-- No multi-client production release before restricted-role RLS verification.
BEGIN;
CREATE TABLE vs_imports_import_job (
  id uuid NOT NULL CONSTRAINT vs_imports_import_job_pkey PRIMARY KEY,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  actor_account_id uuid NOT NULL,
  year_id uuid NOT NULL,
  campus_id uuid,
  namespace varchar(40) NOT NULL,
  schema_version varchar(40) NOT NULL,
  state varchar(40) NOT NULL,
  file_hash char(64) NOT NULL,
  source_bytes bytea,
  source_expires_at timestamptz(3) NOT NULL,
  preview_revision integer NOT NULL,
  context jsonb NOT NULL,
  confirmed_at timestamptz(3),
  version integer NOT NULL,
  created_at timestamptz(3) NOT NULL,
  CONSTRAINT vs_imports_import_job_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_imports_import_job_school_fkey FOREIGN KEY (organization_id, school_id)
    REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_imports_import_job_actor_fkey FOREIGN KEY (actor_account_id)
    REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_imports_import_job_year_fkey FOREIGN KEY (organization_id, school_id, year_id)
    REFERENCES vs_academics_academic_year (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_imports_import_job_campus_fkey FOREIGN KEY (organization_id, school_id, campus_id)
    REFERENCES vs_access_campus (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_imports_import_job_namespace_check CHECK (namespace = btrim(namespace) AND length(namespace) BETWEEN 1 AND 40),
  CONSTRAINT vs_imports_import_job_schema_check CHECK (schema_version = 'STUDENT_ROSTER_V1'),
  CONSTRAINT vs_imports_import_job_state_check CHECK (state IN ('UPLOADED','REVIEW','CONFIRMED','RUNNING','COMPLETED','COMPLETED_WITH_ERRORS','FAILED','CANCELLED')),
  CONSTRAINT vs_imports_import_job_hash_check CHECK (file_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT vs_imports_import_job_source_size_check CHECK (source_bytes IS NULL OR octet_length(source_bytes) <= 2097152),
  CONSTRAINT vs_imports_import_job_context_check CHECK (jsonb_typeof(context) = 'object'),
  CONSTRAINT vs_imports_import_job_revision_check CHECK (preview_revision >= 1),
  CONSTRAINT vs_imports_import_job_version_check CHECK (version >= 1)
);
CREATE INDEX vs_imports_import_job_list_idx ON vs_imports_import_job (organization_id, school_id, state, created_at, id);

CREATE TABLE vs_imports_import_row (
  id uuid NOT NULL CONSTRAINT vs_imports_import_row_pkey PRIMARY KEY,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  job_id uuid NOT NULL,
  preview_revision integer NOT NULL,
  row_number integer NOT NULL,
  input_hash char(64) NOT NULL,
  normalized jsonb NOT NULL,
  decision varchar(20) NOT NULL,
  status varchar(20) NOT NULL,
  expected_references jsonb NOT NULL,
  result jsonb,
  error_code varchar(80),
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT vs_imports_import_row_job_fkey FOREIGN KEY (organization_id, school_id, job_id)
    REFERENCES vs_imports_import_job (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_imports_import_row_revision_row_key UNIQUE (organization_id, school_id, job_id, preview_revision, row_number),
  CONSTRAINT vs_imports_import_row_hash_check CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT vs_imports_import_row_revision_check CHECK (preview_revision >= 1),
  CONSTRAINT vs_imports_import_row_number_check CHECK (row_number BETWEEN 2 AND 1001),
  CONSTRAINT vs_imports_import_row_decision_check CHECK (decision IN ('CREATE','NO_CHANGE','ERROR','CONFLICT')),
  CONSTRAINT vs_imports_import_row_status_check CHECK (status IN ('PENDING','SUCCEEDED','FAILED','SKIPPED')),
  CONSTRAINT vs_imports_import_row_json_check CHECK (jsonb_typeof(normalized) = 'object' AND jsonb_typeof(expected_references) = 'object' AND jsonb_typeof(errors) = 'array')
);
CREATE INDEX vs_imports_import_row_status_idx ON vs_imports_import_row (organization_id, school_id, job_id, status, row_number);

CREATE TABLE vs_imports_source_student_map (
  id uuid NOT NULL CONSTRAINT vs_imports_source_student_map_pkey PRIMARY KEY,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  namespace varchar(40) NOT NULL,
  external_student_id varchar(100) NOT NULL,
  student_id uuid NOT NULL,
  created_at timestamptz(3) NOT NULL,
  CONSTRAINT vs_imports_source_student_map_student_fkey FOREIGN KEY (organization_id, school_id, student_id)
    REFERENCES vs_students_student (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_imports_source_student_map_source_key UNIQUE (organization_id, school_id, namespace, external_student_id),
  CONSTRAINT vs_imports_source_student_map_student_key UNIQUE (organization_id, school_id, namespace, student_id),
  CONSTRAINT vs_imports_source_student_map_namespace_check CHECK (namespace = btrim(namespace) AND length(namespace) BETWEEN 1 AND 40),
  CONSTRAINT vs_imports_source_student_map_external_check CHECK (external_student_id = btrim(external_student_id) AND length(external_student_id) BETWEEN 1 AND 100)
);
COMMIT;
