-- UX-03 stores the authenticated portal theme with the Access-owned tenant rows.
-- Public sign-in branding remains governed by immutable Branding publication.
ALTER TABLE "vs_access_organization"
  ADD COLUMN "theme_id" varchar(20) NOT NULL DEFAULT 'forest';

ALTER TABLE "vs_access_organization"
  ADD CONSTRAINT "vs_access_organization_theme_id_check"
  CHECK ("theme_id" IN ('forest','amethyst','porcelain','linen'));

ALTER TABLE "vs_access_school"
  ADD COLUMN "theme_override" varchar(20);

ALTER TABLE "vs_access_school"
  ADD CONSTRAINT "vs_access_school_theme_override_check"
  CHECK ("theme_override" IS NULL OR "theme_override" IN ('forest','amethyst','porcelain','linen'));

COMMENT ON COLUMN "vs_access_organization"."theme_id" IS
  'Concrete authenticated portal theme. Existing and omitted values default to forest. Institution-scoped; TEN-03 remains the database enforcement gate.';

COMMENT ON COLUMN "vs_access_school"."theme_override" IS
  'Nullable authenticated portal theme override. NULL inherits Organization.theme_id; a literal forest value is an explicit override. Branch-scoped; TEN-03 remains the database enforcement gate.';
