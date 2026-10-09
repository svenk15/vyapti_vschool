BEGIN;

CREATE TABLE vs_academics_calendar_revision (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  calendar_id uuid NOT NULL,
  number integer NOT NULL,
  teaching_weekdays integer[] NOT NULL,
  published_at timestamptz(3) NOT NULL,
  published_by uuid NOT NULL,
  CONSTRAINT vs_academics_calendar_revision_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_calendar_revision_number_key UNIQUE (organization_id, school_id, calendar_id, number),
  CONSTRAINT vs_academics_calendar_revision_scope_calendar_id_key UNIQUE (organization_id, school_id, calendar_id, id),
  CONSTRAINT vs_academics_calendar_revision_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_academics_calendar_revision_calendar_fkey FOREIGN KEY (organization_id, school_id, calendar_id) REFERENCES vs_academics_school_calendar (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_calendar_revision_publisher_fkey FOREIGN KEY (published_by) REFERENCES vs_access_user_account (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_calendar_revision_number_check CHECK (number >= 1),
  CONSTRAINT vs_academics_calendar_revision_weekdays_check CHECK (cardinality(teaching_weekdays) BETWEEN 1 AND 7 AND teaching_weekdays <@ ARRAY[1,2,3,4,5,6,7])
);
CREATE INDEX vs_academics_calendar_revision_history_idx ON vs_academics_calendar_revision (organization_id, school_id, calendar_id, number);

CREATE TABLE vs_academics_calendar_exception (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  revision_id uuid NOT NULL,
  campus_id uuid NULL,
  on_date date NOT NULL,
  is_teaching_day boolean NOT NULL,
  label varchar(160) NOT NULL,
  CONSTRAINT vs_academics_calendar_exception_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_calendar_exception_revision_fkey FOREIGN KEY (organization_id, school_id, revision_id) REFERENCES vs_academics_calendar_revision (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_calendar_exception_campus_fkey FOREIGN KEY (organization_id, school_id, campus_id) REFERENCES vs_access_campus (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_calendar_exception_label_check CHECK (length(btrim(label)) BETWEEN 1 AND 160)
);
CREATE UNIQUE INDEX vs_academics_calendar_exception_school_date_key ON vs_academics_calendar_exception (organization_id, school_id, revision_id, on_date) WHERE campus_id IS NULL;
CREATE UNIQUE INDEX vs_academics_calendar_exception_campus_date_key ON vs_academics_calendar_exception (organization_id, school_id, revision_id, on_date, campus_id) WHERE campus_id IS NOT NULL;
CREATE INDEX vs_academics_calendar_exception_date_idx ON vs_academics_calendar_exception (organization_id, school_id, revision_id, on_date);

ALTER TABLE vs_academics_school_calendar
  ADD CONSTRAINT vs_academics_school_calendar_current_fkey
  FOREIGN KEY (organization_id, school_id, id, current_revision_id)
  REFERENCES vs_academics_calendar_revision (organization_id, school_id, calendar_id, id)
  ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED;

CREATE FUNCTION vs_academics_calendar_immutable_record() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'ACADEMIC_CALENDAR_HISTORY_IMMUTABLE' USING ERRCODE = '55000';
END;
$$;
CREATE TRIGGER vs_academics_calendar_revision_immutable_trg
  BEFORE UPDATE OR DELETE ON vs_academics_calendar_revision
  FOR EACH ROW EXECUTE FUNCTION vs_academics_calendar_immutable_record();
CREATE TRIGGER vs_academics_calendar_exception_immutable_trg
  BEFORE UPDATE OR DELETE ON vs_academics_calendar_exception
  FOR EACH ROW EXECUTE FUNCTION vs_academics_calendar_immutable_record();

COMMIT;
