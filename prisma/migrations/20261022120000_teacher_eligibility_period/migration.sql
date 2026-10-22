-- STF-05: append-only dated Teacher eligibility revisions.
-- Migration rows use verified Employee dates and intentionally have no actor.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM vs_academics_teacher t
    JOIN vs_people_employee e
      ON e.organization_id=t.organization_id AND e.school_id=t.school_id AND e.id=t.employee_id
    WHERE t.active=false AND e.employed_to IS NULL
  ) THEN
    RAISE EXCEPTION 'Inactive Teacher without an Employee employment end cannot be backfilled safely';
  END IF;
END $$;

CREATE TABLE vs_academics_teacher_eligibility_period (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  valid_from date NOT NULL,
  valid_to date,
  version integer NOT NULL,
  reason varchar(500) NOT NULL,
  recorded_by_account_id uuid,
  recorded_at timestamptz(3) NOT NULL,
  source varchar(20) NOT NULL,
  superseded_at timestamptz(3),
  CONSTRAINT vs_academics_teacher_eligibility_period_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_teacher_eligibility_period_scope_id_key UNIQUE (organization_id,school_id,id),
  CONSTRAINT vs_academics_teacher_eligibility_period_version_key UNIQUE (organization_id,school_id,teacher_id,version),
  CONSTRAINT vs_academics_teacher_eligibility_period_teacher_fkey FOREIGN KEY (organization_id,school_id,teacher_id) REFERENCES vs_academics_teacher(organization_id,school_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_teacher_eligibility_period_actor_fkey FOREIGN KEY (recorded_by_account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_teacher_eligibility_period_dates_check CHECK (valid_to IS NULL OR valid_from < valid_to),
  CONSTRAINT vs_academics_teacher_eligibility_period_version_check CHECK (version > 0),
  CONSTRAINT vs_academics_teacher_eligibility_period_reason_check CHECK (char_length(btrim(reason)) BETWEEN 5 AND 500),
  CONSTRAINT vs_academics_teacher_eligibility_period_source_check CHECK (source IN ('MIGRATION','ADMIN')),
  CONSTRAINT vs_academics_teacher_eligibility_period_actor_check CHECK ((source='MIGRATION' AND recorded_by_account_id IS NULL) OR (source='ADMIN' AND recorded_by_account_id IS NOT NULL))
);

CREATE UNIQUE INDEX vs_academics_teacher_eligibility_period_one_current_key
  ON vs_academics_teacher_eligibility_period(organization_id,school_id,teacher_id)
  WHERE superseded_at IS NULL;
CREATE INDEX vs_academics_teacher_eligibility_period_current_idx
  ON vs_academics_teacher_eligibility_period(organization_id,school_id,teacher_id,superseded_at);

INSERT INTO vs_academics_teacher_eligibility_period (
  id,organization_id,school_id,teacher_id,valid_from,valid_to,version,reason,
  recorded_by_account_id,recorded_at,source,superseded_at
)
SELECT gen_random_uuid(),t.organization_id,t.school_id,t.id,e.employed_from,
       CASE WHEN t.active THEN e.employed_to ELSE e.employed_to END,
       1,'Forward migration from existing teaching eligibility',NULL,now(),'MIGRATION',NULL
FROM vs_academics_teacher t
JOIN vs_people_employee e
  ON e.organization_id=t.organization_id AND e.school_id=t.school_id AND e.id=t.employee_id;

CREATE OR REPLACE FUNCTION vs_academics_guard_teacher_eligibility_period()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.id<>NEW.id OR OLD.organization_id<>NEW.organization_id OR OLD.school_id<>NEW.school_id
     OR OLD.teacher_id<>NEW.teacher_id OR OLD.valid_from<>NEW.valid_from
     OR OLD.valid_to IS DISTINCT FROM NEW.valid_to OR OLD.version<>NEW.version
     OR OLD.reason<>NEW.reason OR OLD.recorded_by_account_id IS DISTINCT FROM NEW.recorded_by_account_id
     OR OLD.recorded_at<>NEW.recorded_at OR OLD.source<>NEW.source
     OR OLD.superseded_at IS NOT NULL OR NEW.superseded_at IS NULL THEN
    RAISE EXCEPTION 'Teacher eligibility revisions are immutable';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER vs_academics_teacher_eligibility_period_immutable
BEFORE UPDATE ON vs_academics_teacher_eligibility_period
FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_teacher_eligibility_period();
