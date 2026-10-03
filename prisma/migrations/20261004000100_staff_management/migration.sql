BEGIN;
CREATE TABLE vs_access_campus (
 id uuid NOT NULL CONSTRAINT vs_access_campus_pkey PRIMARY KEY,
 organization_id uuid NOT NULL, school_id uuid NOT NULL,
 code varchar(40) NOT NULL, name varchar(160) NOT NULL,
 status varchar(20) NOT NULL, version integer NOT NULL,
 CONSTRAINT vs_access_campus_version_check CHECK (version>0),
 CONSTRAINT vs_access_campus_status_check CHECK (status IN ('ACTIVE','INACTIVE')),
 CONSTRAINT vs_access_campus_scope_id_key UNIQUE(organization_id,school_id,id),
 CONSTRAINT vs_access_campus_scope_code_key UNIQUE(organization_id,school_id,code),
 CONSTRAINT vs_access_campus_school_fkey FOREIGN KEY(organization_id,school_id) REFERENCES vs_access_school(organization_id,id) ON UPDATE RESTRICT ON DELETE RESTRICT
);
COMMIT;
