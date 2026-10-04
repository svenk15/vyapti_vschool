-- Path A: register this BRANCH table's scope and intended policy now; TEN-03 installs and verifies enforcement.
-- TEN-ADR-006's temporary development exception applies. No multi-client production release before TEN-03.
BEGIN;
CREATE TABLE vs_students_student (
  id uuid NOT NULL CONSTRAINT vs_students_student_pkey PRIMARY KEY,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  person_id uuid NOT NULL,
  admission_number varchar(40) NOT NULL,
  status varchar(20) NOT NULL,
  version integer NOT NULL,
  created_at timestamptz(3) NOT NULL,
  CONSTRAINT vs_students_student_status_check CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  CONSTRAINT vs_students_student_version_check CHECK (version > 0),
  CONSTRAINT vs_students_student_admission_check CHECK (admission_number = btrim(admission_number) AND length(admission_number) BETWEEN 1 AND 40),
  CONSTRAINT vs_students_student_school_fkey FOREIGN KEY (organization_id, school_id)
    REFERENCES vs_access_school(organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_students_student_person_fkey FOREIGN KEY (organization_id, person_id)
    REFERENCES vs_people_person(organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX vs_students_student_scope_id_key ON vs_students_student(organization_id, school_id, id);
CREATE UNIQUE INDEX vs_students_student_admission_key ON vs_students_student(organization_id, school_id, admission_number);
CREATE UNIQUE INDEX vs_students_student_person_key ON vs_students_student(organization_id, school_id, person_id);
CREATE INDEX vs_students_student_list_idx ON vs_students_student(organization_id, school_id, status, id);
COMMIT;
