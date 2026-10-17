CREATE TABLE "vs_documents_command_receipt" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "command" varchar(48) NOT NULL,
  "idempotency_key" varchar(100) NOT NULL,
  "input_hash" char(64) NOT NULL,
  "result" jsonb NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_documents_receipt_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_receipt_command_check" CHECK ("command" IN ('PromoteDocumentUpload','RevokeDocumentGrant')),
  CONSTRAINT "vs_documents_receipt_hash_check" CHECK ("input_hash" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_documents_receipt_result_check" CHECK (jsonb_typeof("result")='object'),
  CONSTRAINT "vs_documents_receipt_actor_key" UNIQUE ("organization_id","school_id","actor_account_id","command","idempotency_key")
);

CREATE INDEX "vs_documents_receipt_scope_idx" ON "vs_documents_command_receipt"("organization_id","school_id","created_at" DESC,"id");

CREATE TRIGGER vs_documents_receipt_immutable BEFORE UPDATE OR DELETE ON "vs_documents_command_receipt" FOR EACH ROW EXECUTE FUNCTION public.vs_documents_immutable_row();

COMMENT ON TABLE "vs_documents_command_receipt" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
