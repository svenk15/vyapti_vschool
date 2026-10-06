CREATE OR REPLACE FUNCTION public.vs_set_password_reset_context(
  p_token_hash text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_account_id uuid;
BEGIN
  PERFORM pg_catalog.set_config('app.account_id', '', true);
  PERFORM pg_catalog.set_config('app.organization_id', '', true);
  PERFORM pg_catalog.set_config('app.school_id', '', true);
  IF p_token_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN NULL;
  END IF;

  SELECT token.account_id INTO v_account_id
  FROM public.vs_access_password_reset_token AS token
  WHERE token.token_hash = p_token_hash;

  IF v_account_id IS NOT NULL THEN
    PERFORM pg_catalog.set_config('app.account_id', v_account_id::text, true);
  END IF;
  RETURN v_account_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.vs_set_password_reset_context(text) FROM PUBLIC;

DO $grant_runtime$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_password_reset_context(text) TO vyapti_vschool_runtime;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_test_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_password_reset_context(text) TO vyapti_vschool_test_runtime;
  END IF;
END;
$grant_runtime$;

COMMENT ON FUNCTION public.vs_set_password_reset_context(text) IS
  'TEN-03: binds account-only context to one exact opaque password-reset token hash; Access still validates trust, rate, token state and revocation.';
