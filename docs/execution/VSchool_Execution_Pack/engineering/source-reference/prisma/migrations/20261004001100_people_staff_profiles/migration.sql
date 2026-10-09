BEGIN;

CREATE TABLE vs_people_person (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL DEFAULT '',
  contact_email varchar(254) NULL,
  version integer NOT NULL,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT vs_people_person_pkey PRIMARY KEY (id),
  CONSTRAINT vs_people_person_organization_id_key UNIQUE (organization_id, id),
  CONSTRAINT vs_people_person_organization_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_people_person_first_name_check CHECK (length(btrim(first_name)) BETWEEN 1 AND 100),
  CONSTRAINT vs_people_person_last_name_check CHECK (length(last_name) <= 100),
  CONSTRAINT vs_people_person_email_check CHECK (contact_email IS NULL OR length(btrim(contact_email)) BETWEEN 3 AND 254),
  CONSTRAINT vs_people_person_version_check CHECK (version >= 1)
);
CREATE INDEX vs_people_person_name_idx ON vs_people_person (organization_id, last_name, id);

CREATE TABLE vs_people_employee (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  school_id uuid NOT NULL,
  person_id uuid NOT NULL,
  staff_number varchar(40) NOT NULL,
  employed_from date NOT NULL,
  employed_to date NULL,
  status varchar(20) NOT NULL,
  version integer NOT NULL,
  CONSTRAINT vs_people_employee_pkey PRIMARY KEY (id),
  CONSTRAINT vs_people_employee_scope_id_key UNIQUE (organization_id, school_id, id),
  CONSTRAINT vs_people_employee_staff_number_key UNIQUE (organization_id, school_id, staff_number),
  CONSTRAINT vs_people_employee_person_key UNIQUE (organization_id, school_id, person_id),
  CONSTRAINT vs_people_employee_school_fkey FOREIGN KEY (organization_id, school_id) REFERENCES vs_access_school (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_people_employee_person_fkey FOREIGN KEY (organization_id, person_id) REFERENCES vs_people_person (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_people_employee_staff_number_check CHECK (length(btrim(staff_number)) BETWEEN 1 AND 40),
  CONSTRAINT vs_people_employee_employment_check CHECK (employed_to IS NULL OR employed_from < employed_to),
  CONSTRAINT vs_people_employee_status_check CHECK (status IN ('ACTIVE', 'ENDED')),
  CONSTRAINT vs_people_employee_version_check CHECK (version >= 1)
);

CREATE TABLE vs_access_account_person_binding (
  id uuid NOT NULL,
  organization_id uuid NOT NULL,
  account_id uuid NOT NULL,
  person_id uuid NOT NULL,
  verified_at timestamptz(3) NOT NULL,
  verified_by uuid NOT NULL,
  CONSTRAINT vs_access_account_person_binding_pkey PRIMARY KEY (id),
  CONSTRAINT vs_access_account_person_binding_org_account_key UNIQUE (organization_id, account_id),
  CONSTRAINT vs_access_account_person_binding_org_person_key UNIQUE (organization_id, person_id),
  CONSTRAINT vs_access_account_person_binding_organization_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_access_account_person_binding_account_fkey FOREIGN KEY (account_id) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_access_account_person_binding_person_fkey FOREIGN KEY (organization_id, person_id) REFERENCES vs_people_person (organization_id, id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_access_account_person_binding_verifier_fkey FOREIGN KEY (verified_by) REFERENCES vs_access_user_account(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

COMMIT;
