-- RPT-02 ExportRun is Reporting-owned; BRANCH RLS metadata follows TEN-ADR-006 Path A.
CREATE TABLE vs_reporting_export_run (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  actor_account_id uuid NOT NULL,
  filters jsonb NOT NULL,
  requested_at timestamptz(3) NOT NULL,
  state varchar(20) NOT NULL,
  row_count integer NOT NULL,
  content_hash char(64),
  request_id uuid NOT NULL,
  CONSTRAINT vs_reporting_export_run_pkey PRIMARY KEY (id),
  CONSTRAINT vs_reporting_export_run_state_check CHECK (state IN ('GENERATED','FAILED')),
  CONSTRAINT vs_reporting_export_run_row_count_check CHECK (row_count >= 0),
  CONSTRAINT vs_reporting_export_run_content_hash_check CHECK (content_hash IS NULL OR content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT vs_reporting_export_run_filters_check CHECK (jsonb_typeof(filters) = 'object'),
  CONSTRAINT vs_reporting_export_run_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_reporting_export_run_actor_fkey FOREIGN KEY (actor_account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX vs_reporting_export_run_list_idx ON vs_reporting_export_run (organization_id, school_id, requested_at, id);
COMMENT ON TABLE vs_reporting_export_run IS 'TEN-ADR-006 Path A; BRANCH class; owner reporting; scope organization_id,school_id; RLS enforcement deferred to TEN-03; application authorization remains required. Stores metadata only, never exported CSV bytes.';
