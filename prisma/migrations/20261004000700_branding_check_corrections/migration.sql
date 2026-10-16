CREATE UNIQUE INDEX IF NOT EXISTS "vs_branding_brand_profile_owner_key" ON "vs_branding_brand_profile"("id","organization_id","school_id");

ALTER TABLE "vs_branding_brand_revision" DROP CONSTRAINT "vs_branding_brand_revision_state_check";
ALTER TABLE "vs_branding_brand_revision" ADD CONSTRAINT "vs_branding_brand_revision_state_check" CHECK (
 "revision">0 AND "state" IN ('DRAFT','PUBLISHED') AND "palette" IN ('forest','indigo','clay')
 AND "locale" ~ '^[A-Za-z0-9-]{2,35}$' AND length(btrim("display_name"))>0 AND length(btrim("welcome"))<=180
 AND "support_email" ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
 AND (("state"='DRAFT' AND "published_at" IS NULL AND "published_by" IS NULL) OR ("state"='PUBLISHED' AND "published_at" IS NOT NULL AND "published_by" IS NOT NULL))
);

ALTER TABLE "vs_branding_verified_brand_host" DROP CONSTRAINT "vs_branding_verified_brand_host_state_check";
ALTER TABLE "vs_branding_verified_brand_host" ADD CONSTRAINT "vs_branding_verified_brand_host_state_check" CHECK (
 "hostname"=lower("hostname")
 AND "hostname" ~ '^([a-z0-9]([a-z0-9-]*[a-z0-9])?[.])+[a-z]{2,63}$'
 AND length("hostname") BETWEEN 4 AND 253
 AND "verification_token_hash" ~ '^[0-9a-f]{64}$'
 AND "state" IN ('PENDING','VERIFIED','REVOKED')
 AND (("state"='VERIFIED' AND "verified_at" IS NOT NULL) OR ("state"<>'VERIFIED' AND "verified_at" IS NULL))
);
