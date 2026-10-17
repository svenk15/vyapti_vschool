ALTER TABLE "vs_coordination_capability_grant" DROP CONSTRAINT "vs_coordination_capability_grant_capability_check";
ALTER TABLE "vs_coordination_capability_grant" ADD CONSTRAINT "vs_coordination_capability_grant_capability_check" CHECK ("capability" IN ('coordination.create','coordination.assign','coordination.work','coordination.verify','coordination.manage','coordination.history','coordination.history.finding'));

CREATE TABLE "vs_coordination_history_finding" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "request_id" UUID NOT NULL,
  "event_number" INTEGER NOT NULL,
  "kind" VARCHAR(20) NOT NULL,
  "text" VARCHAR(1000) NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_coordination_history_finding_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_history_finding_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_history_finding_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_history_finding_event_fkey" FOREIGN KEY ("organization_id","school_id","request_id","event_number") REFERENCES "vs_coordination_request_event" ("organization_id","school_id","request_id","number") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_history_finding_event_check" CHECK ("event_number" > 0),
  CONSTRAINT "vs_coordination_history_finding_kind_check" CHECK ("kind" IN ('FINDING','ESCALATION')),
  CONSTRAINT "vs_coordination_history_finding_text_check" CHECK (char_length("text") BETWEEN 1 AND 1000)
);
CREATE INDEX "vs_coordination_history_finding_list_idx" ON "vs_coordination_history_finding" ("organization_id","school_id","request_id","occurred_at" DESC,"id" DESC);

CREATE FUNCTION vs_coordination_history_finding_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'coordination history findings are immutable'; END $$;
CREATE TRIGGER vs_coordination_history_finding_immutable_trigger BEFORE UPDATE OR DELETE ON "vs_coordination_history_finding" FOR EACH ROW EXECUTE FUNCTION vs_coordination_history_finding_immutable();

COMMENT ON TABLE "vs_coordination_history_finding" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Synthetic-only immutable review finding pending operational-note retention policy.';
