CREATE OR REPLACE FUNCTION public.vs_set_verified_account_context(
  p_account_id uuid,
  p_token_version integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_verified boolean;
BEGIN
  PERFORM pg_catalog.set_config('app.account_id', '', true);
  PERFORM pg_catalog.set_config('app.organization_id', '', true);
  PERFORM pg_catalog.set_config('app.school_id', '', true);

  SELECT EXISTS (
    SELECT 1 FROM public.vs_access_user_account AS account
    WHERE account.id = p_account_id
      AND account.token_version = p_token_version
  ) INTO v_verified;

  IF NOT v_verified THEN
    RETURN false;
  END IF;

  PERFORM pg_catalog.set_config('app.account_id', p_account_id::text, true);
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.vs_find_account_context_by_email(
  p_normalized_email text
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

  SELECT account.id INTO v_account_id
  FROM public.vs_access_user_account AS account
  WHERE account.normalized_email = p_normalized_email;

  IF v_account_id IS NOT NULL THEN
    PERFORM pg_catalog.set_config('app.account_id', v_account_id::text, true);
  END IF;
  RETURN v_account_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.vs_set_verified_account_context(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.vs_find_account_context_by_email(text) FROM PUBLIC;

DO $grant_runtime$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_verified_account_context(uuid, integer) TO vyapti_vschool_runtime;
    GRANT EXECUTE ON FUNCTION public.vs_find_account_context_by_email(text) TO vyapti_vschool_runtime;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_test_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_verified_account_context(uuid, integer) TO vyapti_vschool_test_runtime;
    GRANT EXECUTE ON FUNCTION public.vs_find_account_context_by_email(text) TO vyapti_vschool_test_runtime;
  END IF;
END;
$grant_runtime$;

COMMENT ON FUNCTION public.vs_set_verified_account_context(uuid, integer) IS
  'TEN-03: verifies one account id/token version and sets transaction-local account scope; intended for account-only Access workflows.';
COMMENT ON FUNCTION public.vs_find_account_context_by_email(text) IS
  'TEN-03: exact normalized email lookup for account login bootstrap; returns only the matching account id and sets transaction-local account scope.';
