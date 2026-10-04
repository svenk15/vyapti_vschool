BEGIN;
-- CreateTable
CREATE TABLE "vs_access_institution_grant" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "role" VARCHAR(40) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "version" INTEGER NOT NULL,
    "granted_at" TIMESTAMPTZ(3) NOT NULL,
    "granted_by" UUID NOT NULL,

    CONSTRAINT "vs_access_institution_grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vs_tenancy_configuration_change" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "school_id" UUID,
    "actor_account_id" UUID NOT NULL,
    "expected_revision" INTEGER NOT NULL,
    "new_revision" INTEGER NOT NULL,
    "changes" JSONB NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "request_id" UUID NOT NULL,

    CONSTRAINT "vs_tenancy_configuration_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vs_tenancy_tenant_command_receipt" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "actor_account_id" UUID NOT NULL,
    "command" VARCHAR(80) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "input_hash" CHAR(64) NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "vs_tenancy_tenant_command_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vs_tenancy_tenant_outbox" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "schema_version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "state" VARCHAR(20) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "available_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "vs_tenancy_tenant_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vs_access_institution_grant_account_idx" ON "vs_access_institution_grant"("account_id", "status", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "vs_access_institution_grant_scope_role_key" ON "vs_access_institution_grant"("organization_id", "account_id", "role");

-- CreateIndex
CREATE INDEX "vs_tenancy_configuration_change_history_idx" ON "vs_tenancy_configuration_change"("organization_id", "occurred_at", "id");

-- CreateIndex
CREATE UNIQUE INDEX "vs_tenancy_tenant_command_receipt_intent_key" ON "vs_tenancy_tenant_command_receipt"("organization_id", "actor_account_id", "command", "key");

-- CreateIndex
CREATE INDEX "vs_tenancy_tenant_outbox_delivery_idx" ON "vs_tenancy_tenant_outbox"("organization_id", "state", "available_at", "id");

-- AddForeignKey
ALTER TABLE "vs_access_institution_grant" ADD CONSTRAINT "vs_access_institution_grant_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_access_institution_grant" ADD CONSTRAINT "vs_access_institution_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_tenancy_configuration_change" ADD CONSTRAINT "vs_tenancy_configuration_change_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_tenancy_configuration_change" ADD CONSTRAINT "vs_tenancy_configuration_change_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_tenancy_configuration_change" ADD CONSTRAINT "vs_tenancy_configuration_change_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_tenancy_tenant_command_receipt" ADD CONSTRAINT "vs_tenancy_tenant_command_receipt_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_tenancy_tenant_command_receipt" ADD CONSTRAINT "vs_tenancy_tenant_command_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vs_tenancy_tenant_outbox" ADD CONSTRAINT "vs_tenancy_tenant_outbox_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE INDEX vs_tenancy_configuration_change_branch_idx ON vs_tenancy_configuration_change(organization_id,school_id,occurred_at,id);
ALTER TABLE vs_access_institution_grant ADD CONSTRAINT vs_access_institution_grant_values_check CHECK (role='INSTITUTION_ADMIN' AND status IN ('ACTIVE','REVOKED') AND version>0);
ALTER TABLE vs_tenancy_configuration_change ADD CONSTRAINT vs_tenancy_configuration_change_revision_check CHECK (expected_revision>=0 AND new_revision=expected_revision+1 AND char_length(reason) BETWEEN 5 AND 500);
ALTER TABLE vs_tenancy_tenant_command_receipt ADD CONSTRAINT vs_tenancy_tenant_command_receipt_hash_check CHECK (input_hash ~ '^[a-f0-9]{64}$');
ALTER TABLE vs_tenancy_tenant_outbox ADD CONSTRAINT vs_tenancy_tenant_outbox_values_check CHECK (schema_version>0 AND attempts>=0 AND state IN ('PENDING','PROCESSING','DELIVERED','FAILED'));
CREATE FUNCTION vs_tenancy_evidence_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_TABLE_NAME='vs_tenancy_tenant_outbox' AND TG_OP='UPDATE' AND
  (to_jsonb(NEW)-ARRAY['state','attempts','available_at'])=(to_jsonb(OLD)-ARRAY['state','attempts','available_at']) THEN RETURN NEW; END IF;
 RAISE EXCEPTION 'immutable tenancy evidence' USING ERRCODE='23514';
END $$;
CREATE TRIGGER vs_tenancy_configuration_change_immutable_trg BEFORE UPDATE OR DELETE ON vs_tenancy_configuration_change FOR EACH ROW EXECUTE FUNCTION vs_tenancy_evidence_immutable();
CREATE TRIGGER vs_tenancy_tenant_command_receipt_immutable_trg BEFORE UPDATE OR DELETE ON vs_tenancy_tenant_command_receipt FOR EACH ROW EXECUTE FUNCTION vs_tenancy_evidence_immutable();
CREATE TRIGGER vs_tenancy_tenant_outbox_envelope_trg BEFORE UPDATE OR DELETE ON vs_tenancy_tenant_outbox FOR EACH ROW EXECUTE FUNCTION vs_tenancy_evidence_immutable();

COMMIT;
