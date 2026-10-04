-- Auth events remain append-only except for a tightly-scoped account association
-- when a previously anonymous request is verified against a real account.
BEGIN;
DROP TRIGGER vs_access_auth_security_event_append_only_trg ON vs_access_auth_security_event;
CREATE FUNCTION vs_access_auth_security_event_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP <> 'UPDATE' THEN RAISE EXCEPTION 'Security evidence cannot be deleted' USING ERRCODE = '55000'; END IF;
 IF OLD.account_id IS NOT NULL OR NEW.account_id IS NULL
    OR (to_jsonb(NEW) - 'account_id') IS DISTINCT FROM (to_jsonb(OLD) - 'account_id') THEN
   RAISE EXCEPTION 'Security evidence association is immutable' USING ERRCODE = '55000';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER vs_access_auth_security_event_append_only_trg
 BEFORE UPDATE OR DELETE ON vs_access_auth_security_event
 FOR EACH ROW EXECUTE FUNCTION vs_access_auth_security_event_guard();
COMMIT;
