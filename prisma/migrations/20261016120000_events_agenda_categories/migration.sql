ALTER TABLE "vs_events_event"
  ADD COLUMN "category" VARCHAR(20) NOT NULL DEFAULT 'GENERAL',
  ADD CONSTRAINT "vs_events_event_category_check" CHECK ("category" IN ('GENERAL','HOLIDAY','MEETING','CLASS_EVENT'));

ALTER TABLE "vs_events_event_version"
  ADD COLUMN "category" VARCHAR(20) NOT NULL DEFAULT 'GENERAL',
  ADD CONSTRAINT "vs_events_event_version_category_check" CHECK ("category" IN ('GENERAL','HOLIDAY','MEETING','CLASS_EVENT'));

CREATE INDEX "vs_events_event_agenda_day_idx"
  ON "vs_events_event"("organization_id","school_id","status","category","starts_on","ends_on_exclusive","id")
  WHERE "schedule_kind"='ALL_DAY';

CREATE INDEX "vs_events_event_agenda_time_idx"
  ON "vs_events_event"("organization_id","school_id","status","category","starts_at","ends_at","id")
  WHERE "schedule_kind"='TIMED';

COMMENT ON COLUMN "vs_events_event"."category" IS 'GENERAL is retained only for truthful compatibility with records created before EV-02; new writes use an approved typed category.';
COMMENT ON COLUMN "vs_events_event_version"."category" IS 'Immutable published event category; GENERAL denotes a publication predating EV-02.';
