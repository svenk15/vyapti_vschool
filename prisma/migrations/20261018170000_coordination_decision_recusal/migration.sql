ALTER TABLE "vs_coordination_request"
  ADD COLUMN "verification_reviewer_account_id" uuid;

ALTER TABLE "vs_coordination_request"
  ADD CONSTRAINT "vs_coordination_request_verification_reviewer_fkey"
  FOREIGN KEY ("verification_reviewer_account_id") REFERENCES "vs_access_user_account"("id")
  ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE INDEX "vs_coordination_request_reviewer_idx"
  ON "vs_coordination_request"("organization_id","school_id","verification_reviewer_account_id","status","updated_at" DESC,"id" DESC);

CREATE TABLE "vs_coordination_decision_recusal" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "request_id" uuid NOT NULL,
  "recused_account_id" uuid NOT NULL,
  "routed_to_account_id" uuid,
  "category" varchar(40) NOT NULL,
  "note" varchar(500),
  "request_version" integer NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_coordination_decision_recusal_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_decision_recusal_actor_fkey" FOREIGN KEY ("recused_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_decision_recusal_route_fkey" FOREIGN KEY ("routed_to_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_decision_recusal_category_check" CHECK ("category" IN ('PERSONAL_CONFLICT','REQUESTER_OR_SUBJECT','OTHER_DUTY_CONFLICT')),
  CONSTRAINT "vs_coordination_decision_recusal_note_check" CHECK ("note" IS NULL OR length(btrim("note")) BETWEEN 1 AND 500),
  CONSTRAINT "vs_coordination_decision_recusal_version_check" CHECK ("request_version" > 0),
  CONSTRAINT "vs_coordination_decision_recusal_route_check" CHECK ("routed_to_account_id" IS NULL OR "routed_to_account_id" <> "recused_account_id"),
  CONSTRAINT "vs_coordination_decision_recusal_actor_key" UNIQUE ("organization_id","school_id","request_id","recused_account_id")
);

CREATE INDEX "vs_coordination_decision_recusal_request_idx" ON "vs_coordination_decision_recusal"("organization_id","school_id","request_id","occurred_at" DESC);
CREATE INDEX "vs_coordination_decision_recusal_route_idx" ON "vs_coordination_decision_recusal"("organization_id","school_id","routed_to_account_id","occurred_at" DESC);
CREATE TRIGGER "vs_coordination_decision_recusal_immutable" BEFORE UPDATE OR DELETE ON "vs_coordination_decision_recusal" FOR EACH ROW EXECUTE FUNCTION vs_coordination_request_event_immutable();

COMMENT ON TABLE "vs_coordination_decision_recusal" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=coordination; scope=organization_id,school_id; closureGate=TEN-03; protected synthetic-only conflict evidence.';
