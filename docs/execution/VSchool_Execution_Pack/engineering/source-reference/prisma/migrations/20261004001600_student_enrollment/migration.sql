-- Path A: register BRANCH scope and policy intent now; TEN-03 owns database enforcement.
-- No multi-client production release before restricted-role RLS verification.
BEGIN;
CREATE TABLE vs_students_enrollment (
  id uuid NOT NULL CONSTRAINT vs_students_enrollment_pkey PRIMARY KEY,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  student_id uuid NOT NULL,
  year_id uuid NOT NULL,
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_students_enrollment_scope_year_id_key UNIQUE (organization_id, school_id, id, year_id),
  CONSTRAINT vs_students_enrollment_student_year_key UNIQUE (organization_id, school_id, student_id, year_id),
  CONSTRAINT vs_students_enrollment_student_fkey FOREIGN KEY (organization_id, school_id, student_id)
    REFERENCES vs_students_student (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_students_enrollment_year_fkey FOREIGN KEY (organization_id, school_id, year_id)
    REFERENCES vs_academics_academic_year (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_students_enrollment_date_check CHECK (valid_from < valid_to),
  CONSTRAINT vs_students_enrollment_version_check CHECK (version >= 1)
);

CREATE TABLE vs_students_section_placement (
  id uuid NOT NULL CONSTRAINT vs_students_section_placement_pkey PRIMARY KEY,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  enrollment_id uuid NOT NULL,
  year_id uuid NOT NULL,
  section_id uuid NOT NULL,
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  roll_number varchar(30),
  CONSTRAINT vs_students_section_placement_enrollment_fkey FOREIGN KEY (organization_id, school_id, enrollment_id, year_id)
    REFERENCES vs_students_enrollment (organization_id, school_id, id, year_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_students_section_placement_section_fkey FOREIGN KEY (organization_id, school_id, section_id, year_id)
    REFERENCES vs_academics_section (organization_id, school_id, id, year_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_students_section_placement_date_check CHECK (valid_from < valid_to),
  CONSTRAINT vs_students_section_placement_roll_check CHECK (roll_number IS NULL OR (roll_number = btrim(roll_number) AND length(roll_number) <= 30))
);

CREATE INDEX vs_students_placement_roster_idx
  ON vs_students_section_placement (organization_id, school_id, section_id, valid_from, valid_to, enrollment_id);
CREATE INDEX vs_students_placement_history_idx
  ON vs_students_section_placement (organization_id, school_id, enrollment_id, valid_from);
COMMIT;
