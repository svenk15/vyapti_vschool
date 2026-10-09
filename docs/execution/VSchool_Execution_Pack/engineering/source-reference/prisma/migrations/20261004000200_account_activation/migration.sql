BEGIN;
CREATE UNIQUE INDEX vs_access_school_membership_u2_key ON vs_access_school_membership(organization_id,school_id,id,account_id);
CREATE TABLE vs_access_account_activation (
 id uuid NOT NULL CONSTRAINT vs_access_account_activation_pkey PRIMARY KEY,
 account_id uuid NOT NULL,token_hash char(64) NOT NULL,
 expires_at timestamptz(3) NOT NULL,consumed_at timestamptz(3),revoked_at timestamptz(3),
 created_by uuid NOT NULL,operator_id uuid NOT NULL,case_reference varchar(80) NOT NULL,reason varchar(500) NOT NULL,issued_token_version integer NOT NULL,
 CONSTRAINT vs_access_account_activation_u0_key UNIQUE(token_hash),
 CONSTRAINT vs_access_account_activation_u1_key UNIQUE(account_id,id),
 CONSTRAINT vs_access_account_activation_version_check CHECK(issued_token_version>0),
 CONSTRAINT vs_access_account_activation_state_check CHECK(consumed_at IS NULL OR revoked_at IS NULL),
 CONSTRAINT vs_access_account_activation_r0_fkey FOREIGN KEY(account_id) REFERENCES vs_access_user_account(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
 CONSTRAINT vs_access_account_activation_r1_fkey FOREIGN KEY(created_by) REFERENCES vs_access_user_account(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE INDEX vs_access_account_activation_r0_idx ON vs_access_account_activation(account_id,expires_at);
CREATE INDEX vs_access_account_activation_r1_idx ON vs_access_account_activation(created_by);
CREATE TABLE vs_access_account_activation_membership (
 id uuid NOT NULL CONSTRAINT vs_access_account_activation_membership_pkey PRIMARY KEY,
 activation_id uuid NOT NULL,account_id uuid NOT NULL,organization_id uuid NOT NULL,school_id uuid NOT NULL,membership_id uuid NOT NULL,expected_version integer NOT NULL,
 CONSTRAINT vs_access_account_activation_membership_u0_key UNIQUE(activation_id,membership_id),
 CONSTRAINT vs_access_account_activation_membership_version_check CHECK(expected_version>0),
 CONSTRAINT vs_access_account_activation_membership_r0_fkey FOREIGN KEY(account_id,activation_id) REFERENCES vs_access_account_activation(account_id,id) ON UPDATE RESTRICT ON DELETE RESTRICT,
 CONSTRAINT vs_access_account_activation_membership_r1_fkey FOREIGN KEY(organization_id,school_id,membership_id,account_id) REFERENCES vs_access_school_membership(organization_id,school_id,id,account_id) ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE INDEX vs_access_account_activation_membership_r0_idx ON vs_access_account_activation_membership(account_id,activation_id);
CREATE INDEX vs_access_account_activation_membership_r1_idx ON vs_access_account_activation_membership(organization_id,school_id,membership_id,account_id);
CREATE FUNCTION vs_access_activation_intent_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Activation intent is immutable'; END $$;
CREATE TRIGGER vs_access_activation_intent_immutable BEFORE UPDATE OR DELETE ON vs_access_account_activation_membership FOR EACH ROW EXECUTE FUNCTION vs_access_activation_intent_immutable();
COMMIT;
