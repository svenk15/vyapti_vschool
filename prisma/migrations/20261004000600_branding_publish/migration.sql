CREATE TABLE "vs_branding_brand_profile" (
 "id" UUID NOT NULL,
 "organization_id" UUID NOT NULL,
 "school_id" UUID,
 "version" INTEGER NOT NULL DEFAULT 1,
 "current_revision_id" UUID,
 "public_slug" VARCHAR(80) NOT NULL,
 "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "vs_branding_brand_profile_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_branding_brand_profile_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_profile_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_profile_slug_check" CHECK ("public_slug" ~ '^[a-z0-9-]{3,80}$'),
 CONSTRAINT "vs_branding_brand_profile_version_check" CHECK ("version">0)
);
CREATE UNIQUE INDEX "vs_branding_brand_profile_slug_key" ON "vs_branding_brand_profile"("public_slug");
CREATE UNIQUE INDEX "vs_branding_brand_profile_institution_unique_idx" ON "vs_branding_brand_profile"("organization_id") WHERE "school_id" IS NULL;
CREATE UNIQUE INDEX "vs_branding_brand_profile_branch_unique_idx" ON "vs_branding_brand_profile"("organization_id","school_id") WHERE "school_id" IS NOT NULL;
CREATE UNIQUE INDEX "vs_branding_brand_profile_scope_id_key" ON "vs_branding_brand_profile"("organization_id","id");
CREATE UNIQUE INDEX "vs_branding_brand_profile_owner_key" ON "vs_branding_brand_profile"("id","organization_id","school_id");

CREATE TABLE "vs_branding_brand_asset" (
 "id" UUID NOT NULL,
 "organization_id" UUID NOT NULL,
 "school_id" UUID,
 "sha256" CHAR(64) NOT NULL,
 "mime" VARCHAR(100) NOT NULL,
 "content_bytes" BYTEA NOT NULL,
 "bytes" INTEGER NOT NULL,
 "width" INTEGER NOT NULL,
 "height" INTEGER NOT NULL,
 "state" VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
 "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "vs_branding_brand_asset_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_branding_brand_asset_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_asset_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_asset_owner_key" UNIQUE ("id","organization_id","school_id"),
 CONSTRAINT "vs_branding_brand_asset_content_check" CHECK ("state"='APPROVED' AND "mime"='image/png' AND "bytes"=octet_length("content_bytes") AND "bytes" BETWEEN 45 AND 2097152 AND "width" BETWEEN 1 AND 2048 AND "height" BETWEEN 1 AND 2048 AND "sha256" ~ '^[0-9a-f]{64}$')
);
CREATE INDEX "vs_branding_brand_asset_digest_idx" ON "vs_branding_brand_asset"("organization_id","school_id","sha256");

CREATE TABLE "vs_branding_brand_revision" (
 "id" UUID NOT NULL,
 "profile_id" UUID NOT NULL,
 "organization_id" UUID NOT NULL,
 "school_id" UUID,
 "revision" INTEGER NOT NULL,
 "state" VARCHAR(20) NOT NULL,
 "display_name" VARCHAR(160) NOT NULL,
 "branch_label" VARCHAR(160),
 "logo_asset_id" UUID,
 "palette" VARCHAR(20) NOT NULL,
 "welcome" VARCHAR(180) NOT NULL,
 "support_email" VARCHAR(254) NOT NULL,
 "locale" VARCHAR(35) NOT NULL DEFAULT 'en',
 "published_at" TIMESTAMPTZ(3),
 "published_by" UUID,
 CONSTRAINT "vs_branding_brand_revision_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_branding_brand_revision_profile_fkey" FOREIGN KEY ("profile_id") REFERENCES "vs_branding_brand_profile"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_revision_asset_fkey" FOREIGN KEY ("logo_asset_id","organization_id","school_id") REFERENCES "vs_branding_brand_asset"("id","organization_id","school_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_revision_publisher_fkey" FOREIGN KEY ("published_by") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_brand_revision_owner_key" UNIQUE ("id","organization_id","school_id"),
 CONSTRAINT "vs_branding_brand_revision_profile_revision_key" UNIQUE ("profile_id","revision"),
 CONSTRAINT "vs_branding_brand_revision_state_check" CHECK ("revision">0 AND "state" IN ('DRAFT','PUBLISHED') AND "palette" IN ('forest','indigo','clay') AND "locale" ~ '^[A-Za-z0-9-]{2,35}$' AND length(btrim("display_name"))>0 AND length(btrim("welcome"))<=180 AND "support_email" ~ '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$' AND (("state"='DRAFT' AND "published_at" IS NULL AND "published_by" IS NULL) OR ("state"='PUBLISHED' AND "published_at" IS NOT NULL AND "published_by" IS NOT NULL)))
);
CREATE UNIQUE INDEX "vs_branding_brand_revision_one_draft_idx" ON "vs_branding_brand_revision"("profile_id") WHERE "state"='DRAFT';
CREATE INDEX "vs_branding_brand_revision_scope_state_idx" ON "vs_branding_brand_revision"("organization_id","school_id","state","revision");

ALTER TABLE "vs_branding_brand_profile" ADD CONSTRAINT "vs_branding_brand_profile_current_revision_fkey" FOREIGN KEY ("current_revision_id") REFERENCES "vs_branding_brand_revision"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE "vs_branding_verified_brand_host" (
 "id" UUID NOT NULL,
 "organization_id" UUID NOT NULL,
 "school_id" UUID,
 "hostname" VARCHAR(253) NOT NULL,
 "verification_token_hash" CHAR(64) NOT NULL,
 "state" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
 "verified_at" TIMESTAMPTZ(3),
 "profile_id" UUID NOT NULL,
 CONSTRAINT "vs_branding_verified_brand_host_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_branding_verified_brand_host_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_verified_brand_host_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_verified_brand_host_profile_fkey" FOREIGN KEY ("profile_id") REFERENCES "vs_branding_brand_profile"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_branding_verified_brand_host_state_check" CHECK ("hostname"=lower("hostname") AND "hostname" !~ '[^a-z0-9.-]' AND "hostname" !~ '(^\\.|\\.$|\\.\\.|\\*|\\s)' AND length("hostname") BETWEEN 4 AND 253 AND "verification_token_hash" ~ '^[0-9a-f]{64}$' AND "state" IN ('PENDING','VERIFIED','REVOKED') AND (("state"='VERIFIED' AND "verified_at" IS NOT NULL) OR ("state"<>'VERIFIED' AND "verified_at" IS NULL)))
);
CREATE UNIQUE INDEX "vs_branding_verified_brand_host_hostname_key" ON "vs_branding_verified_brand_host"(lower("hostname"));
CREATE INDEX "vs_branding_verified_brand_host_lookup_idx" ON "vs_branding_verified_brand_host"("hostname","state");

CREATE FUNCTION "vs_branding_profile_pointer_guard"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."current_revision_id" IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM "vs_branding_brand_revision" r WHERE r."id"=NEW."current_revision_id" AND r."profile_id"=NEW."id" AND r."organization_id"=NEW."organization_id" AND r."school_id" IS NOT DISTINCT FROM NEW."school_id" AND r."state"='PUBLISHED'
 ) THEN RAISE EXCEPTION 'BRANDING_REVISION_SCOPE_INVALID'; END IF;
 IF TG_OP='UPDATE' AND (NEW."organization_id"<>OLD."organization_id" OR NEW."school_id" IS DISTINCT FROM OLD."school_id" OR NEW."public_slug"<>OLD."public_slug") THEN RAISE EXCEPTION 'BRANDING_PROFILE_IDENTITY_IMMUTABLE'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER "vs_branding_profile_pointer_guard_trg" BEFORE INSERT OR UPDATE ON "vs_branding_brand_profile" FOR EACH ROW EXECUTE FUNCTION "vs_branding_profile_pointer_guard"();

CREATE FUNCTION "vs_branding_revision_owner_guard"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE p RECORD;
BEGIN
 IF TG_OP='DELETE' THEN IF OLD."state"='PUBLISHED' THEN RAISE EXCEPTION 'BRANDING_PUBLISHED_IMMUTABLE'; END IF; RETURN OLD; END IF;
 SELECT * INTO p FROM "vs_branding_brand_profile" WHERE "id"=NEW."profile_id";
 IF NOT FOUND OR p."organization_id"<>NEW."organization_id" OR p."school_id" IS DISTINCT FROM NEW."school_id" THEN RAISE EXCEPTION 'BRANDING_REVISION_SCOPE_INVALID'; END IF;
 IF TG_OP='UPDATE' AND OLD."state"='PUBLISHED' THEN RAISE EXCEPTION 'BRANDING_PUBLISHED_IMMUTABLE'; END IF;
 IF NEW."logo_asset_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "vs_branding_brand_asset" a WHERE a."id"=NEW."logo_asset_id" AND a."organization_id"=NEW."organization_id" AND a."school_id" IS NOT DISTINCT FROM NEW."school_id" AND a."state"='APPROVED') THEN RAISE EXCEPTION 'BRANDING_ASSET_SCOPE_INVALID'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER "vs_branding_revision_owner_guard_trg" BEFORE INSERT OR UPDATE OR DELETE ON "vs_branding_brand_revision" FOR EACH ROW EXECUTE FUNCTION "vs_branding_revision_owner_guard"();

CREATE FUNCTION "vs_branding_host_owner_guard"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE p RECORD;
BEGIN
 SELECT * INTO p FROM "vs_branding_brand_profile" WHERE "id"=NEW."profile_id";
 IF NOT FOUND OR p."organization_id"<>NEW."organization_id" OR p."school_id" IS DISTINCT FROM NEW."school_id" THEN RAISE EXCEPTION 'BRANDING_HOST_SCOPE_INVALID'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER "vs_branding_host_owner_guard_trg" BEFORE INSERT OR UPDATE ON "vs_branding_verified_brand_host" FOR EACH ROW EXECUTE FUNCTION "vs_branding_host_owner_guard"();
