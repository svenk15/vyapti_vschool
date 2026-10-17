CREATE TABLE "vs_documents_upload_session" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "owner_module" varchar(40) NOT NULL,
  "owner_resource_type" varchar(80) NOT NULL,
  "owner_resource_id" uuid NOT NULL,
  "purpose" varchar(80) NOT NULL,
  "display_filename" varchar(180) NOT NULL,
  "declared_media_type" varchar(40) NOT NULL,
  "expected_size" integer NOT NULL,
  "expected_sha256" char(64) NOT NULL,
  "storage_key" varchar(160) NOT NULL,
  "state" varchar(24) NOT NULL,
  "version" integer NOT NULL,
  "idempotency_key" varchar(100) NOT NULL,
  "input_hash" char(64) NOT NULL,
  "asset_id" uuid,
  "expires_at" timestamptz(3) NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_documents_upload_scope_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_upload_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_upload_media_check" CHECK ("declared_media_type" IN ('application/pdf','image/jpeg','image/png')),
  CONSTRAINT "vs_documents_upload_size_check" CHECK ("expected_size" BETWEEN 1 AND 10485760),
  CONSTRAINT "vs_documents_upload_hash_check" CHECK ("expected_sha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_documents_upload_state_check" CHECK ("state" IN ('QUARANTINED','READY','INVALID','BLOCKED','SCAN_UNAVAILABLE')),
  CONSTRAINT "vs_documents_upload_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_documents_upload_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_documents_upload_actor_key" UNIQUE ("organization_id","school_id","actor_account_id","idempotency_key"),
  CONSTRAINT "vs_documents_upload_storage_key" UNIQUE ("storage_key")
);
CREATE INDEX "vs_documents_upload_owner_idx" ON "vs_documents_upload_session"("organization_id","school_id","owner_module","owner_resource_type","owner_resource_id","state");
CREATE INDEX "vs_documents_upload_expiry_idx" ON "vs_documents_upload_session"("organization_id","school_id","state","expires_at");

CREATE TABLE "vs_documents_file_asset" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "storage_key" varchar(160) NOT NULL,
  "byte_size" integer NOT NULL,
  "sha256" char(64) NOT NULL,
  "detected_media_type" varchar(40) NOT NULL,
  "safety_state" varchar(24) NOT NULL,
  "safety_version" integer NOT NULL,
  "current_scan_result_id" uuid,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_documents_asset_scope_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_asset_media_check" CHECK ("detected_media_type" IN ('application/pdf','image/jpeg','image/png')),
  CONSTRAINT "vs_documents_asset_size_check" CHECK ("byte_size" BETWEEN 1 AND 10485760),
  CONSTRAINT "vs_documents_asset_hash_check" CHECK ("sha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_documents_asset_state_check" CHECK ("safety_state" IN ('READY','BLOCKED','SCAN_UNAVAILABLE')),
  CONSTRAINT "vs_documents_asset_version_check" CHECK ("safety_version" > 0),
  CONSTRAINT "vs_documents_asset_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_documents_asset_storage_key" UNIQUE ("storage_key")
);
CREATE INDEX "vs_documents_asset_hash_idx" ON "vs_documents_file_asset"("organization_id","school_id","sha256");
CREATE INDEX "vs_documents_asset_safety_idx" ON "vs_documents_file_asset"("organization_id","school_id","safety_state","created_at");

CREATE TABLE "vs_documents_scan_result" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "asset_id" uuid NOT NULL,
  "attempt_no" integer NOT NULL,
  "asset_sha256" char(64) NOT NULL,
  "verdict" varchar(16) NOT NULL,
  "engine" varchar(80) NOT NULL,
  "engine_version" varchar(80) NOT NULL,
  "definitions_version" varchar(80),
  "error_code" varchar(80),
  "scanned_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_documents_scan_asset_fkey" FOREIGN KEY ("organization_id","school_id","asset_id") REFERENCES "vs_documents_file_asset"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_scan_verdict_check" CHECK ("verdict" IN ('CLEAN','BLOCKED','ERROR','UNAVAILABLE')),
  CONSTRAINT "vs_documents_scan_attempt_check" CHECK ("attempt_no" > 0),
  CONSTRAINT "vs_documents_scan_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_documents_scan_attempt_key" UNIQUE ("organization_id","school_id","asset_id","attempt_no")
);
CREATE INDEX "vs_documents_scan_asset_idx" ON "vs_documents_scan_result"("organization_id","school_id","asset_id","scanned_at" DESC);

CREATE TABLE "vs_documents_document" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "owner_module" varchar(40) NOT NULL, "owner_resource_type" varchar(80) NOT NULL, "owner_resource_id" uuid NOT NULL,
  "status" varchar(16) NOT NULL, "revision" integer NOT NULL, "current_version_id" uuid, "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_documents_document_scope_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_document_status_check" CHECK ("status" IN ('ACTIVE','WITHDRAWN')),
  CONSTRAINT "vs_documents_document_revision_check" CHECK ("revision" > 0),
  CONSTRAINT "vs_documents_document_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_documents_document_owner_key" UNIQUE ("organization_id","school_id","owner_module","owner_resource_type","owner_resource_id")
);
CREATE INDEX "vs_documents_document_list_idx" ON "vs_documents_document"("organization_id","school_id","status","created_at" DESC);

CREATE TABLE "vs_documents_document_version" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL, "document_id" uuid NOT NULL, "asset_id" uuid NOT NULL,
  "version_no" integer NOT NULL, "display_filename" varchar(180) NOT NULL, "classification" varchar(40) NOT NULL, "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_documents_version_document_fkey" FOREIGN KEY ("organization_id","school_id","document_id") REFERENCES "vs_documents_document"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_version_asset_fkey" FOREIGN KEY ("organization_id","school_id","asset_id") REFERENCES "vs_documents_file_asset"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_version_number_check" CHECK ("version_no" > 0),
  CONSTRAINT "vs_documents_version_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_documents_version_number_key" UNIQUE ("organization_id","school_id","document_id","version_no")
);
CREATE INDEX "vs_documents_version_class_idx" ON "vs_documents_document_version"("organization_id","school_id","classification","created_at" DESC);
ALTER TABLE "vs_documents_document" ADD CONSTRAINT "vs_documents_document_current_version_fkey" FOREIGN KEY ("organization_id","school_id","current_version_id") REFERENCES "vs_documents_document_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE "vs_documents_document_grant" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL, "document_version_id" uuid NOT NULL,
  "owner_module" varchar(40) NOT NULL, "owner_resource_type" varchar(80) NOT NULL, "owner_resource_id" uuid NOT NULL, "purpose" varchar(80) NOT NULL,
  "status" varchar(16) NOT NULL, "version" integer NOT NULL, "created_at" timestamptz(3) NOT NULL, "revoked_at" timestamptz(3),
  CONSTRAINT "vs_documents_grant_version_fkey" FOREIGN KEY ("organization_id","school_id","document_version_id") REFERENCES "vs_documents_document_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_documents_grant_status_check" CHECK ("status" IN ('ACTIVE','REVOKED')),
  CONSTRAINT "vs_documents_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_documents_grant_revocation_check" CHECK (("status"='ACTIVE' AND "revoked_at" IS NULL) OR ("status"='REVOKED' AND "revoked_at" IS NOT NULL)),
  CONSTRAINT "vs_documents_grant_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_documents_grant_owner_key" UNIQUE ("organization_id","school_id","document_version_id","owner_module","owner_resource_type","owner_resource_id","purpose")
);
CREATE INDEX "vs_documents_grant_active_idx" ON "vs_documents_document_grant"("organization_id","school_id","owner_module","owner_resource_type","owner_resource_id","status");

ALTER TABLE "vs_documents_upload_session" ADD CONSTRAINT "vs_documents_upload_asset_fkey" FOREIGN KEY ("organization_id","school_id","asset_id") REFERENCES "vs_documents_file_asset"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_documents_file_asset" ADD CONSTRAINT "vs_documents_asset_current_scan_fkey" FOREIGN KEY ("organization_id","school_id","current_scan_result_id") REFERENCES "vs_documents_scan_result"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED;

CREATE FUNCTION public.vs_documents_immutable_row() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'documents immutable row'; END $$;
CREATE TRIGGER vs_documents_scan_immutable BEFORE UPDATE OR DELETE ON "vs_documents_scan_result" FOR EACH ROW EXECUTE FUNCTION public.vs_documents_immutable_row();
CREATE TRIGGER vs_documents_version_immutable BEFORE UPDATE OR DELETE ON "vs_documents_document_version" FOR EACH ROW EXECUTE FUNCTION public.vs_documents_immutable_row();

COMMENT ON TABLE "vs_documents_upload_session" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_documents_file_asset" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_documents_scan_result" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_documents_document" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_documents_document_version" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_documents_document_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=documents; scope=organization_id,school_id; closureGate=TEN-03';
