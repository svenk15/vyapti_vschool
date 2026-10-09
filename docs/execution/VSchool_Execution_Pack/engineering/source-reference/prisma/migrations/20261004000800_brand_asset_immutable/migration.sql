CREATE FUNCTION "vs_branding_asset_immutable_guard"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 RAISE EXCEPTION 'BRANDING_ASSET_IMMUTABLE';
END $$;
CREATE TRIGGER "vs_branding_asset_immutable_guard_trg" BEFORE UPDATE OR DELETE ON "vs_branding_brand_asset" FOR EACH ROW EXECUTE FUNCTION "vs_branding_asset_immutable_guard"();
