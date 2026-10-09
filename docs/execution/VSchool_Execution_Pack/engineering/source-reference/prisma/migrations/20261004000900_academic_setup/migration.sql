BEGIN;

CREATE TABLE vs_academics_academic_year (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code varchar(40) NOT NULL,
  name varchar(160) NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  status varchar(20) NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_academics_academic_year_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_academic_year_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_academics_academic_year_code_key UNIQUE (organization_id, school_id, code),
  CONSTRAINT vs_academics_academic_year_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_academic_year_org_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_academic_year_date_check CHECK (starts_on < ends_on),
  CONSTRAINT vs_academics_academic_year_status_check CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED')),
  CONSTRAINT vs_academics_academic_year_version_check CHECK (version >= 1),
  CONSTRAINT vs_academics_academic_year_code_check CHECK (code ~ '^[A-Z0-9][A-Z0-9_-]{0,39}$'),
  CONSTRAINT vs_academics_academic_year_name_check CHECK (length(btrim(name)) BETWEEN 1 AND 160)
);

CREATE TABLE vs_academics_academic_term (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  year_id uuid NOT NULL,
  code varchar(40) NOT NULL,
  name varchar(160) NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  CONSTRAINT vs_academics_academic_term_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_academic_term_code_key UNIQUE (organization_id, school_id, year_id, code),
  CONSTRAINT vs_academics_academic_term_year_fkey FOREIGN KEY (organization_id, school_id, year_id) REFERENCES vs_academics_academic_year (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_academic_term_date_check CHECK (starts_on < ends_on),
  CONSTRAINT vs_academics_academic_term_code_check CHECK (code ~ '^[A-Z0-9][A-Z0-9_-]{0,39}$'),
  CONSTRAINT vs_academics_academic_term_name_check CHECK (length(btrim(name)) BETWEEN 1 AND 160)
);
CREATE INDEX vs_academics_academic_term_range_idx ON vs_academics_academic_term (organization_id, school_id, year_id, starts_on);

CREATE TABLE vs_academics_grade_level (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code varchar(40) NOT NULL,
  name varchar(160) NOT NULL,
  sort_order integer NOT NULL,
  active boolean NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_academics_grade_level_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_grade_level_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_academics_grade_level_code_key UNIQUE (organization_id, school_id, code),
  CONSTRAINT vs_academics_grade_level_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_grade_level_org_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_grade_level_code_check CHECK (code ~ '^[A-Z0-9][A-Z0-9_-]{0,39}$'),
  CONSTRAINT vs_academics_grade_level_name_check CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  CONSTRAINT vs_academics_grade_level_order_check CHECK (sort_order >= 1),
  CONSTRAINT vs_academics_grade_level_version_check CHECK (version >= 1)
);

CREATE TABLE vs_academics_subject (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code varchar(40) NOT NULL,
  name varchar(160) NOT NULL,
  active boolean NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_academics_subject_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_subject_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_academics_subject_code_key UNIQUE (organization_id, school_id, code),
  CONSTRAINT vs_academics_subject_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_subject_org_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_subject_code_check CHECK (code ~ '^[A-Z0-9][A-Z0-9_-]{0,39}$'),
  CONSTRAINT vs_academics_subject_name_check CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  CONSTRAINT vs_academics_subject_version_check CHECK (version >= 1)
);

CREATE TABLE vs_academics_section (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  year_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  campus_id uuid NULL,
  code varchar(40) NOT NULL,
  name varchar(160) NOT NULL,
  active boolean NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_academics_section_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_section_scope_year_id_key UNIQUE (organization_id, school_id, id, year_id),
  CONSTRAINT vs_academics_section_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_section_year_fkey FOREIGN KEY (organization_id, school_id, year_id) REFERENCES vs_academics_academic_year (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_section_grade_fkey FOREIGN KEY (organization_id, school_id, grade_id) REFERENCES vs_academics_grade_level (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_section_campus_fkey FOREIGN KEY (organization_id, school_id, campus_id) REFERENCES vs_access_campus (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_section_code_check CHECK (code ~ '^[A-Z0-9][A-Z0-9_-]{0,39}$'),
  CONSTRAINT vs_academics_section_name_check CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  CONSTRAINT vs_academics_section_version_check CHECK (version >= 1)
);
CREATE UNIQUE INDEX vs_academics_section_nocampus_code_key ON vs_academics_section (organization_id, school_id, year_id, grade_id, code) WHERE campus_id IS NULL;
CREATE UNIQUE INDEX vs_academics_section_campus_code_key ON vs_academics_section (organization_id, school_id, year_id, grade_id, campus_id, code) WHERE campus_id IS NOT NULL;
CREATE INDEX vs_academics_section_year_grade_idx ON vs_academics_section (organization_id, school_id, year_id, grade_id);

CREATE TABLE vs_academics_school_calendar (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  year_id uuid NOT NULL,
  current_revision_id uuid NULL,
  version integer NOT NULL,
  CONSTRAINT vs_academics_school_calendar_pkey PRIMARY KEY (id),
  CONSTRAINT vs_academics_school_calendar_year_key UNIQUE (organization_id, school_id, year_id),
  CONSTRAINT vs_academics_school_calendar_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_academics_school_calendar_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_school_calendar_year_fkey FOREIGN KEY (organization_id, school_id, year_id) REFERENCES vs_academics_academic_year (organization_id, school_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_academics_school_calendar_version_check CHECK (version >= 1)
);

COMMIT;
