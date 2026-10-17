CREATE TABLE "vs_facilities_capability_grant" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL, "account_id" UUID NOT NULL, "capability" VARCHAR(32) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL, "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3), "version" INTEGER NOT NULL,
  CONSTRAINT "vs_facilities_capability_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_facilities_capability_grant_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_facilities_capability_grant_capability_check" CHECK ("capability" IN ('INCIDENT_REPORT','INCIDENT_COORDINATE','RESTORATION_VERIFY','INCIDENT_CLOSE')),
  CONSTRAINT "vs_facilities_capability_grant_version_check" CHECK ("version">0),
  CONSTRAINT "vs_facilities_capability_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_facilities_capability_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_facilities_capability_grant_active_key" ON "vs_facilities_capability_grant"("organization_id","school_id","account_id","capability") WHERE "revoked_at" IS NULL;
CREATE INDEX "vs_facilities_capability_grant_active_idx" ON "vs_facilities_capability_grant"("organization_id","school_id","account_id","capability","revoked_at");

CREATE TABLE "vs_facilities_incident" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "facility" VARCHAR(120) NOT NULL, "affected_from" TIMESTAMPTZ(3) NOT NULL, "affected_to" TIMESTAMPTZ(3) NOT NULL,
  "impact" VARCHAR(1000) NOT NULL, "reporter_account_id" UUID NOT NULL, "coordinator_account_id" UUID NOT NULL,
  "state" VARCHAR(24) NOT NULL, "restoration_evidence" VARCHAR(1000), "restoration_proposed_by_id" UUID,
  "restoration_verified_by_id" UUID, "version" INTEGER NOT NULL, "reported_at" TIMESTAMPTZ(3) NOT NULL,
  "investigation_started_at" TIMESTAMPTZ(3), "restoration_proposed_at" TIMESTAMPTZ(3),
  "restoration_verified_at" TIMESTAMPTZ(3), "closed_at" TIMESTAMPTZ(3), "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_facilities_incident_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_facilities_incident_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_facilities_incident_interval_check" CHECK ("affected_to">"affected_from"),
  CONSTRAINT "vs_facilities_incident_state_check" CHECK ("state" IN ('OPEN','INVESTIGATING','RESTORATION_PROPOSED','VERIFIED_RESTORED','CLOSED')),
  CONSTRAINT "vs_facilities_incident_version_check" CHECK ("version">0),
  CONSTRAINT "vs_facilities_incident_restoration_check" CHECK (("state" IN ('OPEN','INVESTIGATING') AND "restoration_evidence" IS NULL AND "restoration_proposed_by_id" IS NULL AND "restoration_verified_by_id" IS NULL) OR ("state"='RESTORATION_PROPOSED' AND "restoration_evidence" IS NOT NULL AND "restoration_proposed_by_id" IS NOT NULL AND "restoration_verified_by_id" IS NULL) OR ("state" IN ('VERIFIED_RESTORED','CLOSED') AND "restoration_evidence" IS NOT NULL AND "restoration_proposed_by_id" IS NOT NULL AND "restoration_verified_by_id" IS NOT NULL)),
  CONSTRAINT "vs_facilities_incident_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_facilities_incident_reporter_fkey" FOREIGN KEY ("reporter_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_facilities_incident_coordinator_fkey" FOREIGN KEY ("coordinator_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_facilities_incident_proposer_fkey" FOREIGN KEY ("restoration_proposed_by_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_facilities_incident_verifier_fkey" FOREIGN KEY ("restoration_verified_by_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_facilities_incident_state_idx" ON "vs_facilities_incident"("organization_id","school_id","state","updated_at" DESC,"id");
CREATE INDEX "vs_facilities_incident_coordinator_idx" ON "vs_facilities_incident"("organization_id","school_id","coordinator_account_id","state","updated_at" DESC,"id");

CREATE TABLE "vs_facilities_incident_event" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL, "incident_id" UUID NOT NULL,
  "number" INTEGER NOT NULL, "type" VARCHAR(32) NOT NULL, "from_state" VARCHAR(24), "to_state" VARCHAR(24) NOT NULL,
  "evidence" VARCHAR(1000), "actor_account_id" UUID NOT NULL, "incident_version" INTEGER NOT NULL, "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_facilities_incident_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_facilities_incident_event_number_key" UNIQUE ("organization_id","school_id","incident_id","number"),
  CONSTRAINT "vs_facilities_incident_event_number_check" CHECK ("number">0 AND "incident_version">0),
  CONSTRAINT "vs_facilities_incident_event_incident_fkey" FOREIGN KEY ("organization_id","school_id","incident_id") REFERENCES "vs_facilities_incident"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_facilities_incident_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_facilities_incident_event_history_idx" ON "vs_facilities_incident_event"("organization_id","school_id","incident_id","occurred_at","id");
CREATE FUNCTION "vs_facilities_block_event_mutation"() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'facilities incident events are append-only'; END $$;
CREATE TRIGGER "vs_facilities_incident_event_append_only" BEFORE UPDATE OR DELETE ON "vs_facilities_incident_event" FOR EACH ROW EXECUTE FUNCTION "vs_facilities_block_event_mutation"();

COMMENT ON TABLE "vs_facilities_capability_grant" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=facilities; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_facilities_incident" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=facilities; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_facilities_incident_event" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=facilities; scope=organization_id,school_id; closureGate=TEN-03';
