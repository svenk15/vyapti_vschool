-- Expand the immutable Branding revision palette allowlist to the four approved
-- UX presets while retaining legacy Indigo/Clay history. No stored value is
-- rewritten and published revisions remain immutable.
ALTER TABLE "vs_branding_brand_revision"
  DROP CONSTRAINT "vs_branding_brand_revision_state_check";

ALTER TABLE "vs_branding_brand_revision"
  ADD CONSTRAINT "vs_branding_brand_revision_state_check" CHECK (
    "revision" > 0
    AND "state" IN ('DRAFT','PUBLISHED')
    AND "palette" IN ('forest','amethyst','porcelain','linen','indigo','clay')
    AND "locale" ~ '^[A-Za-z0-9-]{2,35}$'
    AND length(btrim("display_name")) > 0
    AND length(btrim("welcome")) <= 180
    AND "support_email" ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    AND (
      ("state" = 'DRAFT' AND "published_at" IS NULL AND "published_by" IS NULL)
      OR
      ("state" = 'PUBLISHED' AND "published_at" IS NOT NULL AND "published_by" IS NOT NULL)
    )
  );
