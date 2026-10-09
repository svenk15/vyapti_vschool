BEGIN;
ALTER TABLE vs_access_organization ADD COLUMN trust_mode varchar(20) NOT NULL DEFAULT 'OPERATOR_CLI';
UPDATE vs_access_organization SET trust_mode='OPERATOR_CLI';
ALTER TABLE vs_access_organization ADD CONSTRAINT vs_access_organization_trust_mode_check CHECK (trust_mode IN ('OPERATOR_CLI','HYBRID','EMAIL'));
ALTER TABLE vs_access_user_account ADD COLUMN email_verified_at timestamptz(3) NULL;
ALTER TABLE vs_access_auth_security_event ADD COLUMN decision varchar(12) NULL, ADD COLUMN safe_reason varchar(80) NULL, ADD COLUMN policy_snapshot jsonb NULL;
CREATE TABLE vs_access_invite (
 id uuid NOT NULL, account_id uuid NOT NULL, organization_id uuid NOT NULL, school_id uuid NOT NULL, inviter_account_id uuid NOT NULL,
 token_hash char(64) NOT NULL, proposed_roles text[] NOT NULL, membership_version integer NOT NULL,
 organization_configuration_version integer NOT NULL, school_configuration_version integer NOT NULL,
 delivery_status varchar(24) NOT NULL, delivery_failed_at timestamptz(3), delivery_failure_reason varchar(120),
 created_at timestamptz(3) NOT NULL, expires_at timestamptz(3) NOT NULL, accepted_at timestamptz(3), revoked_at timestamptz(3),
 CONSTRAINT vs_access_invite_pkey PRIMARY KEY(id), CONSTRAINT vs_access_invite_token_hash_key UNIQUE(token_hash),
 CONSTRAINT vs_access_invite_account_fkey FOREIGN KEY(account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_access_invite_organization_fkey FOREIGN KEY(organization_id) REFERENCES vs_access_organization(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_access_invite_school_fkey FOREIGN KEY(organization_id,school_id) REFERENCES vs_access_school(organization_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_access_invite_inviter_fkey FOREIGN KEY(inviter_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_access_invite_delivery_check CHECK(delivery_status IN ('PENDING_DELIVERY','SENT','FAILED')),
 CONSTRAINT vs_access_invite_roles_check CHECK(cardinality(proposed_roles)>0 AND proposed_roles <@ ARRAY['SCHOOL_ADMIN','TEACHER']::text[]),
 CONSTRAINT vs_access_invite_lifecycle_check CHECK(expires_at>created_at AND (delivery_failed_at IS NULL OR delivery_status='FAILED'))
);
CREATE INDEX vs_access_invite_scope_delivery_idx ON vs_access_invite(organization_id,school_id,delivery_status,created_at);
CREATE INDEX vs_access_invite_account_expiry_idx ON vs_access_invite(account_id,expires_at);
CREATE TABLE vs_access_password_reset_token (
 id uuid NOT NULL, account_id uuid NOT NULL, issuing_organization_id uuid NULL, token_hash char(64) NOT NULL,
 delivery_status varchar(24) NOT NULL, policy_snapshot jsonb NOT NULL, organization_configuration_versions jsonb NOT NULL,
 delivery_failed_at timestamptz(3), delivery_failure_reason varchar(120), created_at timestamptz(3) NOT NULL,
 expires_at timestamptz(3) NOT NULL, consumed_at timestamptz(3), revoked_at timestamptz(3),
 CONSTRAINT vs_access_password_reset_token_pkey PRIMARY KEY(id), CONSTRAINT vs_access_password_reset_token_hash_key UNIQUE(token_hash),
 CONSTRAINT vs_access_password_reset_token_account_fkey FOREIGN KEY(account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_access_password_reset_token_organization_fkey FOREIGN KEY(issuing_organization_id) REFERENCES vs_access_organization(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT vs_access_password_reset_token_delivery_check CHECK(delivery_status IN ('PENDING_DELIVERY','SENT','FAILED')),
 CONSTRAINT vs_access_password_reset_token_lifecycle_check CHECK(expires_at>created_at AND (delivery_failed_at IS NULL OR delivery_status='FAILED'))
);
CREATE INDEX vs_access_password_reset_token_account_created_idx ON vs_access_password_reset_token(account_id,created_at);
CREATE INDEX vs_access_password_reset_token_issuer_created_idx ON vs_access_password_reset_token(issuing_organization_id,created_at);
COMMIT;
