-- Publication may use an injected application clock for deterministic execution.
-- Authorize the initial child copy by its transaction-local publication command,
-- rather than comparing that clock with PostgreSQL transaction_timestamp().
CREATE OR REPLACE FUNCTION vs_academics_guard_published_timetable_child_insert() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE publication record;
BEGIN
 IF TG_TABLE_NAME='vs_academics_timetable_slot' THEN
  SELECT source_command_id INTO publication FROM "vs_academics_timetable_revision" WHERE id=NEW.revision_id AND state='PUBLISHED';
 ELSE
  SELECT source_command_id INTO publication FROM "vs_academics_timetable_revision" WHERE day_pattern_id=NEW.day_pattern_id AND state='PUBLISHED';
 END IF;
 IF NOT FOUND THEN RETURN NEW; END IF;
 IF current_setting('vschool.timetable_publication_command_id',true) IS NULL
  OR current_setting('vschool.timetable_publication_command_id',true)<>publication.source_command_id::text
 THEN RAISE EXCEPTION 'published timetable content is immutable' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
