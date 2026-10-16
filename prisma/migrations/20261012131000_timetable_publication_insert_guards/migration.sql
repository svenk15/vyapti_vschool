CREATE OR REPLACE FUNCTION vs_academics_guard_published_timetable_child_insert() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE publication record;
BEGIN
 IF TG_TABLE_NAME='vs_academics_timetable_slot' THEN
  SELECT source_command_id,published_at INTO publication FROM "vs_academics_timetable_revision" WHERE id=NEW.revision_id AND state='PUBLISHED';
 ELSE
  SELECT source_command_id,published_at INTO publication FROM "vs_academics_timetable_revision" WHERE day_pattern_id=NEW.day_pattern_id AND state='PUBLISHED';
 END IF;
 IF publication.source_command_id IS NOT NULL AND (
  current_setting('vschool.timetable_publication_command_id',true) IS NULL
  OR current_setting('vschool.timetable_publication_command_id',true)<>publication.source_command_id::text
  OR publication.published_at<transaction_timestamp()
 ) THEN RAISE EXCEPTION 'published timetable content is immutable' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER vs_academics_timetable_slot_insert_immutable BEFORE INSERT ON "vs_academics_timetable_slot" FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_published_timetable_child_insert();
CREATE TRIGGER vs_academics_day_period_published_insert_immutable BEFORE INSERT ON "vs_academics_day_period" FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_published_timetable_child_insert();
