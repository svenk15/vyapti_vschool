CREATE TABLE "vs_finance_capability_grant" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL, "account_id" UUID NOT NULL, "capability" VARCHAR(32) NOT NULL,
  "currency" CHAR(3), "approval_limit_minor" BIGINT, "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL, "revoked_at" TIMESTAMPTZ(3), "version" INTEGER NOT NULL,
  CONSTRAINT "vs_finance_capability_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_finance_capability_grant_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_finance_capability_grant_capability_check" CHECK ("capability" IN ('SUMMARY_READ','EXCEPTION_REQUEST','EXCEPTION_REVIEW')),
  CONSTRAINT "vs_finance_capability_grant_limit_check" CHECK (("capability"='EXCEPTION_REVIEW' AND "currency" IS NOT NULL AND "approval_limit_minor" IS NOT NULL AND "approval_limit_minor">=0) OR ("capability"<>'EXCEPTION_REVIEW' AND "approval_limit_minor" IS NULL)),
  CONSTRAINT "vs_finance_capability_grant_currency_check" CHECK ("currency" IS NULL OR "currency" ~ '^[A-Z]{3}$'),
  CONSTRAINT "vs_finance_capability_grant_version_check" CHECK ("version">0),
  CONSTRAINT "vs_finance_capability_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_finance_capability_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_finance_capability_grant_active_key" ON "vs_finance_capability_grant"("organization_id","school_id","account_id","capability",COALESCE("currency",'')) WHERE "revoked_at" IS NULL;
CREATE INDEX "vs_finance_capability_grant_active_idx" ON "vs_finance_capability_grant"("organization_id","school_id","account_id","capability","currency","revoked_at");

CREATE TABLE "vs_finance_ledger_entry" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "kind" VARCHAR(12) NOT NULL, "currency" CHAR(3) NOT NULL, "amount_minor" BIGINT NOT NULL,
  "source_kind" VARCHAR(24) NOT NULL, "source_ref" VARCHAR(120) NOT NULL, "provider_event_id" VARCHAR(120),
  "occurred_at" TIMESTAMPTZ(3) NOT NULL, "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_finance_ledger_entry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_finance_ledger_entry_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_finance_ledger_entry_source_key" UNIQUE ("organization_id","school_id","source_kind","source_ref"),
  CONSTRAINT "vs_finance_ledger_entry_kind_check" CHECK ("kind" IN ('CHARGE','PAYMENT')),
  CONSTRAINT "vs_finance_ledger_entry_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
  CONSTRAINT "vs_finance_ledger_entry_amount_check" CHECK ("amount_minor">0),
  CONSTRAINT "vs_finance_ledger_entry_source_check" CHECK ("source_kind"='SYNTHETIC'),
  CONSTRAINT "vs_finance_ledger_entry_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_finance_ledger_entry_provider_key" ON "vs_finance_ledger_entry"("organization_id","school_id","provider_event_id") WHERE "provider_event_id" IS NOT NULL;
CREATE INDEX "vs_finance_ledger_entry_currency_cutoff_idx" ON "vs_finance_ledger_entry"("organization_id","school_id","currency","occurred_at","id");

CREATE TABLE "vs_finance_allocation" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "payment_entry_id" UUID NOT NULL, "charge_entry_id" UUID NOT NULL, "currency" CHAR(3) NOT NULL,
  "amount_minor" BIGINT NOT NULL, "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_finance_allocation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_finance_allocation_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_finance_allocation_pair_key" UNIQUE ("organization_id","school_id","payment_entry_id","charge_entry_id"),
  CONSTRAINT "vs_finance_allocation_amount_check" CHECK ("amount_minor">0 AND "currency" ~ '^[A-Z]{3}$'),
  CONSTRAINT "vs_finance_allocation_payment_fkey" FOREIGN KEY ("organization_id","school_id","payment_entry_id") REFERENCES "vs_finance_ledger_entry"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_finance_allocation_charge_fkey" FOREIGN KEY ("organization_id","school_id","charge_entry_id") REFERENCES "vs_finance_ledger_entry"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_finance_allocation_currency_idx" ON "vs_finance_allocation"("organization_id","school_id","currency","created_at","id");

CREATE TABLE "vs_finance_reconciliation" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "currency" CHAR(3) NOT NULL, "cutoff_at" TIMESTAMPTZ(3) NOT NULL, "state" VARCHAR(16) NOT NULL,
  "charge_minor" BIGINT NOT NULL, "payment_minor" BIGINT NOT NULL, "allocated_minor" BIGINT NOT NULL,
  "unmatched_charge_minor" BIGINT NOT NULL, "unallocated_payment_minor" BIGINT NOT NULL,
  "exception_count" INTEGER NOT NULL, "definition_version" INTEGER NOT NULL, "source_digest" CHAR(64) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_finance_reconciliation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_finance_reconciliation_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_finance_reconciliation_state_check" CHECK ("state" IN ('RECONCILED','UNRECONCILED')),
  CONSTRAINT "vs_finance_reconciliation_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
  CONSTRAINT "vs_finance_reconciliation_amount_check" CHECK ("charge_minor">=0 AND "payment_minor">=0 AND "allocated_minor">=0 AND "unmatched_charge_minor"="charge_minor"-"allocated_minor" AND "unallocated_payment_minor"="payment_minor"-"allocated_minor" AND "allocated_minor"<="charge_minor" AND "allocated_minor"<= "payment_minor"),
  CONSTRAINT "vs_finance_reconciliation_meta_check" CHECK ("exception_count">=0 AND "definition_version">0),
  CONSTRAINT "vs_finance_reconciliation_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_finance_reconciliation_latest_idx" ON "vs_finance_reconciliation"("organization_id","school_id","currency","cutoff_at" DESC,"id");

CREATE TABLE "vs_finance_exception" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "reconciliation_id" UUID NOT NULL, "currency" CHAR(3) NOT NULL, "kind" VARCHAR(20) NOT NULL,
  "amount_minor" BIGINT NOT NULL, "requester_account_id" UUID NOT NULL, "reviewer_account_id" UUID NOT NULL,
  "reason" VARCHAR(1000) NOT NULL, "state" VARCHAR(12) NOT NULL, "version" INTEGER NOT NULL,
  "requested_at" TIMESTAMPTZ(3) NOT NULL, "decision_reason" VARCHAR(1000), "decided_at" TIMESTAMPTZ(3),
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_finance_exception_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_finance_exception_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_finance_exception_kind_check" CHECK ("kind" IN ('CONCESSION','REFUND_REQUEST')),
  CONSTRAINT "vs_finance_exception_state_check" CHECK (("state"='PENDING' AND "decided_at" IS NULL AND "decision_reason" IS NULL) OR ("state" IN ('APPROVED','REJECTED') AND "decided_at" IS NOT NULL)),
  CONSTRAINT "vs_finance_exception_amount_check" CHECK ("amount_minor">0 AND "currency" ~ '^[A-Z]{3}$'),
  CONSTRAINT "vs_finance_exception_separation_check" CHECK ("requester_account_id"<>"reviewer_account_id"),
  CONSTRAINT "vs_finance_exception_version_check" CHECK ("version">0),
  CONSTRAINT "vs_finance_exception_reconciliation_fkey" FOREIGN KEY ("organization_id","school_id","reconciliation_id") REFERENCES "vs_finance_reconciliation"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_finance_exception_requester_fkey" FOREIGN KEY ("requester_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_finance_exception_reviewer_fkey" FOREIGN KEY ("reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_finance_exception_reviewer_idx" ON "vs_finance_exception"("organization_id","school_id","reviewer_account_id","state","requested_at","id");
CREATE INDEX "vs_finance_exception_requester_idx" ON "vs_finance_exception"("organization_id","school_id","requester_account_id","requested_at" DESC,"id");

CREATE TABLE "vs_finance_exception_event" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "exception_id" UUID NOT NULL, "number" INTEGER NOT NULL, "type" VARCHAR(16) NOT NULL,
  "from_state" VARCHAR(12), "to_state" VARCHAR(12) NOT NULL, "actor_account_id" UUID NOT NULL,
  "reason" VARCHAR(1000), "exception_version" INTEGER NOT NULL, "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_finance_exception_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_finance_exception_event_number_key" UNIQUE ("organization_id","school_id","exception_id","number"),
  CONSTRAINT "vs_finance_exception_event_number_check" CHECK ("number">0 AND "exception_version">0),
  CONSTRAINT "vs_finance_exception_event_exception_fkey" FOREIGN KEY ("organization_id","school_id","exception_id") REFERENCES "vs_finance_exception"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_finance_exception_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_finance_exception_event_history_idx" ON "vs_finance_exception_event"("organization_id","school_id","exception_id","occurred_at","id");

CREATE FUNCTION "vs_finance_block_immutable_mutation"() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'finance evidence is immutable'; END $$;
CREATE TRIGGER "vs_finance_ledger_entry_append_only" BEFORE UPDATE OR DELETE ON "vs_finance_ledger_entry" FOR EACH ROW EXECUTE FUNCTION "vs_finance_block_immutable_mutation"();
CREATE TRIGGER "vs_finance_allocation_append_only" BEFORE UPDATE OR DELETE ON "vs_finance_allocation" FOR EACH ROW EXECUTE FUNCTION "vs_finance_block_immutable_mutation"();
CREATE TRIGGER "vs_finance_reconciliation_append_only" BEFORE UPDATE OR DELETE ON "vs_finance_reconciliation" FOR EACH ROW EXECUTE FUNCTION "vs_finance_block_immutable_mutation"();
CREATE TRIGGER "vs_finance_exception_event_append_only" BEFORE UPDATE OR DELETE ON "vs_finance_exception_event" FOR EACH ROW EXECUTE FUNCTION "vs_finance_block_immutable_mutation"();

COMMENT ON TABLE "vs_finance_capability_grant" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=finance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_finance_ledger_entry" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=finance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_finance_allocation" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=finance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_finance_reconciliation" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=finance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_finance_exception" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=finance; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_finance_exception_event" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=finance; scope=organization_id,school_id; closureGate=TEN-03';
