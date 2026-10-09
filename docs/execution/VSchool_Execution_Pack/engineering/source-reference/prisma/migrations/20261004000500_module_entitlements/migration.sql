BEGIN;

CREATE TABLE vs_tenancy_organization_entitlement (
  id UUID NOT NULL,
  organization_id UUID NOT NULL,
  module_id VARCHAR(40) NOT NULL,
  state VARCHAR(20) NOT NULL,
  starts_at TIMESTAMPTZ(3) NOT NULL,
  ends_at TIMESTAMPTZ(3),
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  manifest_version INTEGER NOT NULL,
  version INTEGER NOT NULL,
  CONSTRAINT vs_tenancy_organization_entitlement_pkey PRIMARY KEY (id),
  CONSTRAINT vs_tenancy_organization_entitlement_scope_module_key UNIQUE (organization_id,module_id),
  CONSTRAINT vs_tenancy_organization_entitlement_org_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_tenancy_organization_entitlement_values_check CHECK (
    module_id IN ('student_core','academic_core','staff_core','attendance','fees','admissions','assessments','family','communication','timetable','homework','transport','hr','library','inventory','health','analytics','ai')
    AND state IN ('ACTIVE','READ_ONLY','SUSPENDED','RETIRED')
    AND (ends_at IS NULL OR ends_at > starts_at)
    AND jsonb_typeof(limits)='object' AND limits='{}'::jsonb
    AND manifest_version > 0 AND version > 0
  )
);
CREATE INDEX vs_tenancy_organization_entitlement_status_idx ON vs_tenancy_organization_entitlement(organization_id,state,module_id);

CREATE TABLE vs_tenancy_branch_activation (
  id UUID NOT NULL,
  organization_id UUID NOT NULL,
  school_id UUID NOT NULL,
  module_id VARCHAR(40) NOT NULL,
  state VARCHAR(20) NOT NULL,
  version INTEGER NOT NULL,
  enabled_at TIMESTAMPTZ(3),
  CONSTRAINT vs_tenancy_branch_activation_pkey PRIMARY KEY (id),
  CONSTRAINT vs_tenancy_branch_activation_scope_module_key UNIQUE (organization_id,school_id,module_id),
  CONSTRAINT vs_tenancy_branch_activation_org_fkey FOREIGN KEY (organization_id) REFERENCES vs_access_organization(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_tenancy_branch_activation_school_fkey FOREIGN KEY (organization_id,school_id) REFERENCES vs_access_school(organization_id,id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT vs_tenancy_branch_activation_values_check CHECK (
    module_id IN ('student_core','academic_core','staff_core','attendance','fees','admissions','assessments','family','communication','timetable','homework','transport','hr','library','inventory','health','analytics','ai')
    AND state IN ('DISABLED','PROVISIONING','ACTIVE','READ_ONLY','SUSPENDED','RETIRED')
    AND version > 0
    AND ((state='ACTIVE' AND enabled_at IS NOT NULL) OR (state<>'ACTIVE' AND enabled_at IS NULL))
  )
);
CREATE INDEX vs_tenancy_branch_activation_status_idx ON vs_tenancy_branch_activation(organization_id,school_id,state,module_id);

COMMIT;
