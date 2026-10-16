CREATE OR REPLACE FUNCTION public.vs_set_verified_branch_context(
  p_account_id uuid,
  p_token_version integer,
  p_organization_id uuid,
  p_school_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_authorized boolean;
BEGIN
  PERFORM pg_catalog.set_config('app.account_id', '', true);
  PERFORM pg_catalog.set_config('app.organization_id', '', true);
  PERFORM pg_catalog.set_config('app.school_id', '', true);

  SELECT EXISTS (
    SELECT 1
    FROM public.vs_access_user_account AS account
    JOIN public.vs_access_school_membership AS membership
      ON membership.account_id = account.id
    JOIN public.vs_access_school AS school
      ON school.organization_id = membership.organization_id
     AND school.id = membership.school_id
    JOIN public.vs_access_organization AS organization
      ON organization.id = school.organization_id
    WHERE account.id = p_account_id
      AND account.status = 'ACTIVE'
      AND account.token_version = p_token_version
      AND organization.id = p_organization_id
      AND organization.status = 'ACTIVE'
      AND school.id = p_school_id
      AND school.status = 'ACTIVE'
      AND membership.status = 'ACTIVE'
  ) INTO v_authorized;

  IF NOT v_authorized THEN
    RETURN false;
  END IF;

  PERFORM pg_catalog.set_config('app.account_id', p_account_id::text, true);
  PERFORM pg_catalog.set_config('app.organization_id', p_organization_id::text, true);
  PERFORM pg_catalog.set_config('app.school_id', p_school_id::text, true);
  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.vs_set_verified_branch_context(uuid, integer, uuid, uuid) FROM PUBLIC;

DO $grant_runtime$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_verified_branch_context(uuid, integer, uuid, uuid) TO vyapti_vschool_runtime;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_test_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_verified_branch_context(uuid, integer, uuid, uuid) TO vyapti_vschool_test_runtime;
  END IF;
END;
$grant_runtime$;

COMMENT ON FUNCTION public.vs_set_verified_branch_context(uuid, integer, uuid, uuid) IS
  'TEN-03: verifies active account, institution, branch and membership, then sets transaction-local verified tenant context. Fixed search_path; no dynamic SQL; runtime EXECUTE only.';
