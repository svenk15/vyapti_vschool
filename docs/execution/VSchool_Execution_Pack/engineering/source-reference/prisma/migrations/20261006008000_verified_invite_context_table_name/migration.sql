CREATE OR REPLACE FUNCTION public.vs_set_staff_invite_context_by_token(
  p_token_hash text
)
RETURNS TABLE(invite_id uuid, account_id uuid, inviter_account_id uuid, organization_id uuid, school_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_invite_id uuid;
  v_account_id uuid;
  v_inviter_account_id uuid;
  v_organization_id uuid;
  v_school_id uuid;
BEGIN
  PERFORM pg_catalog.set_config('app.account_id', '', true);
  PERFORM pg_catalog.set_config('app.organization_id', '', true);
  PERFORM pg_catalog.set_config('app.school_id', '', true);
  PERFORM pg_catalog.set_config('app.invite_id', '', true);
  IF p_token_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN;
  END IF;

  SELECT invite.id, invite.account_id, invite.inviter_account_id, invite.organization_id, invite.school_id
  INTO v_invite_id, v_account_id, v_inviter_account_id, v_organization_id, v_school_id
  FROM public.vs_access_invite AS invite
  WHERE invite.token_hash = p_token_hash
    AND invite.delivery_status = 'SENT'
    AND invite.accepted_at IS NULL
    AND invite.revoked_at IS NULL
    AND invite.expires_at > pg_catalog.statement_timestamp();

  IF v_invite_id IS NULL THEN RETURN; END IF;
  PERFORM pg_catalog.set_config('app.account_id', v_account_id::text, true);
  PERFORM pg_catalog.set_config('app.organization_id', v_organization_id::text, true);
  PERFORM pg_catalog.set_config('app.school_id', v_school_id::text, true);
  PERFORM pg_catalog.set_config('app.invite_id', v_invite_id::text, true);
  invite_id:=v_invite_id;account_id:=v_account_id;inviter_account_id:=v_inviter_account_id;organization_id:=v_organization_id;school_id:=v_school_id;RETURN NEXT;
END;
$function$;

CREATE OR REPLACE FUNCTION public.vs_set_staff_invite_context_by_id(
  p_invite_id uuid
)
RETURNS TABLE(invite_id uuid, account_id uuid, inviter_account_id uuid, organization_id uuid, school_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_invite_id uuid;
  v_account_id uuid;
  v_inviter_account_id uuid;
  v_organization_id uuid;
  v_school_id uuid;
BEGIN
  PERFORM pg_catalog.set_config('app.account_id', '', true);
  PERFORM pg_catalog.set_config('app.organization_id', '', true);
  PERFORM pg_catalog.set_config('app.school_id', '', true);
  PERFORM pg_catalog.set_config('app.invite_id', '', true);

  SELECT invite.id, invite.account_id, invite.inviter_account_id, invite.organization_id, invite.school_id
  INTO v_invite_id, v_account_id, v_inviter_account_id, v_organization_id, v_school_id
  FROM public.vs_access_invite AS invite
  WHERE invite.id = p_invite_id;

  IF v_invite_id IS NULL THEN RETURN; END IF;
  PERFORM pg_catalog.set_config('app.account_id', v_account_id::text, true);
  PERFORM pg_catalog.set_config('app.organization_id', v_organization_id::text, true);
  PERFORM pg_catalog.set_config('app.school_id', v_school_id::text, true);
  PERFORM pg_catalog.set_config('app.invite_id', v_invite_id::text, true);
  invite_id:=v_invite_id;account_id:=v_account_id;inviter_account_id:=v_inviter_account_id;organization_id:=v_organization_id;school_id:=v_school_id;RETURN NEXT;
END;
$function$;

REVOKE ALL ON FUNCTION public.vs_set_staff_invite_context_by_token(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.vs_set_staff_invite_context_by_id(uuid) FROM PUBLIC;

DO $grant_runtime$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_staff_invite_context_by_token(text) TO vyapti_vschool_runtime;
    GRANT EXECUTE ON FUNCTION public.vs_set_staff_invite_context_by_id(uuid) TO vyapti_vschool_runtime;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'vyapti_vschool_test_runtime') THEN
    GRANT EXECUTE ON FUNCTION public.vs_set_staff_invite_context_by_token(text) TO vyapti_vschool_test_runtime;
    GRANT EXECUTE ON FUNCTION public.vs_set_staff_invite_context_by_id(uuid) TO vyapti_vschool_test_runtime;
  END IF;
END;
$grant_runtime$;

COMMENT ON FUNCTION public.vs_set_staff_invite_context_by_token(text) IS
  'TEN-03: binds context to one live, sent, unconsumed staff invitation token; Access must still recheck inviter, trust, membership and recipient state.';
COMMENT ON FUNCTION public.vs_set_staff_invite_context_by_id(uuid) IS
  'TEN-03: binds context to one known staff invitation delivery work item; application code still rechecks state before mutation.';
