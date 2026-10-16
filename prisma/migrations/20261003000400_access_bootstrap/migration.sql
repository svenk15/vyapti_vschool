BEGIN;
CREATE TABLE vs_access_organization (
  id uuid NOT NULL,
  name varchar(160) NOT NULL,
  status varchar(20) NOT NULL,
  version integer NOT NULL,
  created_at timestamptz(3) NOT NULL,
  configuration_version integer NOT NULL DEFAULT 1,
  CONSTRAINT vs_access_organization_pkey PRIMARY KEY (id)
);
ALTER TABLE vs_access_organization ADD CONSTRAINT vs_access_organization_version_check CHECK (version > 0);
ALTER TABLE vs_access_organization ADD CONSTRAINT vs_access_organization_configuration_check CHECK (configuration_version > 0);
CREATE TABLE vs_access_school (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  code varchar(40) NOT NULL,
  name varchar(160) NOT NULL,
  timezone varchar(64) NOT NULL,
  status varchar(20) NOT NULL,
  version integer NOT NULL,
  created_at timestamptz(3) NOT NULL,
  configuration_version integer NOT NULL DEFAULT 1,
  CONSTRAINT vs_access_school_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX vs_access_school_u0_key ON vs_access_school (organization_id, id);
CREATE UNIQUE INDEX vs_access_school_u1_key ON vs_access_school (organization_id, code);
ALTER TABLE vs_access_school ADD CONSTRAINT vs_access_school_version_check CHECK (version > 0);
ALTER TABLE vs_access_school ADD CONSTRAINT vs_access_school_configuration_check CHECK (configuration_version > 0);
CREATE TABLE vs_access_user_account (
  id uuid NOT NULL,
  normalized_email varchar(254) NOT NULL,
  password_hash text,
  status varchar(20) NOT NULL,
  token_version integer NOT NULL,
  failed_attempts integer NOT NULL,
  locked_until timestamptz(3),
  version integer NOT NULL,
  created_at timestamptz(3) NOT NULL,
  CONSTRAINT vs_access_user_account_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX vs_access_user_account_u0_key ON vs_access_user_account (normalized_email);
CREATE INDEX vs_access_user_account_q0_idx ON vs_access_user_account (status, id);
ALTER TABLE vs_access_user_account ADD CONSTRAINT vs_access_user_account_version_check CHECK (version > 0);
CREATE TABLE vs_access_school_membership (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  account_id uuid NOT NULL,
  status varchar(20) NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_access_school_membership_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX vs_access_school_membership_u0_key ON vs_access_school_membership (organization_id, school_id, id);
CREATE UNIQUE INDEX vs_access_school_membership_u1_key ON vs_access_school_membership (organization_id, school_id, account_id);
ALTER TABLE vs_access_school_membership ADD CONSTRAINT vs_access_school_membership_version_check CHECK (version > 0);
CREATE TABLE vs_access_role_grant (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  membership_id uuid NOT NULL,
  code varchar(40) NOT NULL,
  CONSTRAINT vs_access_role_grant_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX vs_access_role_grant_u0_key ON vs_access_role_grant (organization_id, school_id, membership_id, code);
CREATE TABLE vs_access_auth_security_event (
  id uuid NOT NULL,
  account_id uuid,
  kind varchar(40) NOT NULL,
  occurred_at timestamptz(3) NOT NULL,
  request_id uuid NOT NULL,
  actor_account_id uuid,
  CONSTRAINT vs_access_auth_security_event_pkey PRIMARY KEY (id)
);
CREATE INDEX vs_access_auth_security_event_q0_idx ON vs_access_auth_security_event (account_id, occurred_at, id);
CREATE TABLE vs_platform_audit_entry (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  actor_account_id uuid NOT NULL,
  module varchar(40) NOT NULL,
  command varchar(80) NOT NULL,
  resource_type varchar(80) NOT NULL,
  resource_id uuid NOT NULL,
  before jsonb NOT NULL,
  after jsonb NOT NULL,
  reason varchar(500),
  request_id uuid NOT NULL,
  occurred_at timestamptz(3) NOT NULL,
  CONSTRAINT vs_platform_audit_entry_pkey PRIMARY KEY (id)
);
CREATE INDEX vs_platform_audit_entry_q0_idx ON vs_platform_audit_entry (organization_id, school_id, module, resource_id, occurred_at, id);
CREATE TABLE vs_platform_outbox_event (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  module varchar(40) NOT NULL,
  type varchar(100) NOT NULL,
  schema_version integer NOT NULL,
  aggregate_id uuid NOT NULL,
  aggregate_version integer NOT NULL,
  occurred_at timestamptz(3) NOT NULL,
  payload jsonb NOT NULL,
  state varchar(20) NOT NULL DEFAULT 'PENDING',
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz(3) NOT NULL,
  delivered_at timestamptz(3),
  CONSTRAINT vs_platform_outbox_event_pkey PRIMARY KEY (id)
);
CREATE INDEX vs_platform_outbox_event_q0_idx ON vs_platform_outbox_event (state, available_at, id);
CREATE TABLE vs_platform_command_receipt (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  actor_account_id uuid NOT NULL,
  command varchar(80) NOT NULL,
  key varchar(100) NOT NULL,
  input_hash char(64) NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz(3) NOT NULL,
  CONSTRAINT vs_platform_command_receipt_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX vs_platform_command_receipt_u0_key ON vs_platform_command_receipt (organization_id, school_id, actor_account_id, command, key);
ALTER TABLE vs_access_organization ADD CONSTRAINT vs_access_organization_state_check CHECK (status IN ('ACTIVE', 'SUSPENDED'));
ALTER TABLE vs_access_school ADD CONSTRAINT vs_access_school_state_check CHECK (status IN ('ACTIVE', 'SUSPENDED'));
ALTER TABLE vs_access_user_account ADD CONSTRAINT vs_access_user_account_state_check CHECK (status IN ('PENDING', 'ACTIVE', 'DISABLED'));
ALTER TABLE vs_access_school_membership ADD CONSTRAINT vs_access_school_membership_state_check CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'REVOKED'));
ALTER TABLE vs_access_role_grant ADD CONSTRAINT vs_access_role_grant_state_check CHECK (code IN ('SCHOOL_ADMIN', 'TEACHER'));
ALTER TABLE vs_platform_outbox_event ADD CONSTRAINT vs_platform_outbox_event_state_check CHECK (state IN ('PENDING', 'DELIVERED', 'EXHAUSTED'));
ALTER TABLE vs_access_school ADD CONSTRAINT vs_access_school_r0_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_access_school_r0_idx ON vs_access_school (organization_id);
ALTER TABLE vs_access_school_membership ADD CONSTRAINT vs_access_school_membership_r1_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_access_school_membership_r1_idx ON vs_access_school_membership (organization_id, school_id);
ALTER TABLE vs_access_school_membership ADD CONSTRAINT vs_access_school_membership_r2_fkey FOREIGN KEY (account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_access_school_membership_r2_idx ON vs_access_school_membership (account_id);
ALTER TABLE vs_access_role_grant ADD CONSTRAINT vs_access_role_grant_r3_fkey FOREIGN KEY (organization_id, school_id, membership_id) REFERENCES vs_access_school_membership (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_access_role_grant_r3_idx ON vs_access_role_grant (organization_id, school_id, membership_id);
ALTER TABLE vs_access_auth_security_event ADD CONSTRAINT vs_access_auth_security_event_r4_fkey FOREIGN KEY (account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_access_auth_security_event_r4_idx ON vs_access_auth_security_event (account_id);
ALTER TABLE vs_access_auth_security_event ADD CONSTRAINT vs_access_auth_security_event_r5_fkey FOREIGN KEY (actor_account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_access_auth_security_event_r5_idx ON vs_access_auth_security_event (actor_account_id);
ALTER TABLE vs_platform_audit_entry ADD CONSTRAINT vs_platform_audit_entry_r6_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_platform_audit_entry_r6_idx ON vs_platform_audit_entry (organization_id, school_id);
ALTER TABLE vs_platform_audit_entry ADD CONSTRAINT vs_platform_audit_entry_r7_fkey FOREIGN KEY (actor_account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_platform_audit_entry_r7_idx ON vs_platform_audit_entry (actor_account_id);
ALTER TABLE vs_platform_outbox_event ADD CONSTRAINT vs_platform_outbox_event_r8_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_platform_outbox_event_r8_idx ON vs_platform_outbox_event (organization_id, school_id);
ALTER TABLE vs_platform_command_receipt ADD CONSTRAINT vs_platform_command_receipt_r9_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_platform_command_receipt_r9_idx ON vs_platform_command_receipt (organization_id, school_id);
ALTER TABLE vs_platform_command_receipt ADD CONSTRAINT vs_platform_command_receipt_r10_fkey FOREIGN KEY (actor_account_id) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX vs_platform_command_receipt_r10_idx ON vs_platform_command_receipt (actor_account_id);
ALTER TABLE vs_access_user_account ADD CONSTRAINT vs_access_user_account_counter_check CHECK (token_version >= 1 AND failed_attempts >= 0);
ALTER TABLE vs_access_user_account ADD CONSTRAINT vs_access_user_account_email_check CHECK (normalized_email = lower(btrim(normalized_email)));
ALTER TABLE vs_platform_outbox_event ADD CONSTRAINT vs_platform_outbox_event_counter_check CHECK (schema_version > 0 AND aggregate_version > 0 AND attempts >= 0);
ALTER TABLE vs_platform_command_receipt ADD CONSTRAINT vs_platform_command_receipt_hash_check CHECK (input_hash ~ '^[0-9a-f]{64}$' AND key ~ '^[A-Za-z0-9_-]{16,100}$');
CREATE FUNCTION vs_platform_deny_history_change() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Immutable evidence cannot be changed' USING ERRCODE = '55000'; END; $$;
CREATE TRIGGER vs_platform_audit_entry_append_only_trg BEFORE UPDATE OR DELETE ON vs_platform_audit_entry FOR EACH ROW EXECUTE FUNCTION vs_platform_deny_history_change();
CREATE TRIGGER vs_platform_command_receipt_append_only_trg BEFORE UPDATE OR DELETE ON vs_platform_command_receipt FOR EACH ROW EXECUTE FUNCTION vs_platform_deny_history_change();
CREATE TRIGGER vs_access_auth_security_event_append_only_trg BEFORE UPDATE OR DELETE ON vs_access_auth_security_event FOR EACH ROW EXECUTE FUNCTION vs_platform_deny_history_change();
COMMIT;
