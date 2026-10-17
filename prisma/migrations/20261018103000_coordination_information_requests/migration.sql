CREATE TABLE "vs_coordination_information_request" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "request_id" uuid NOT NULL,
  "requester_account_id" uuid NOT NULL,
  "recipient_account_id" uuid NOT NULL,
  "question" varchar(1000) NOT NULL,
  "response_due_at" timestamptz(3),
  "status" varchar(16) NOT NULL,
  "response_text" varchar(1000),
  "requested_at" timestamptz(3) NOT NULL,
  "answered_at" timestamptz(3),
  "cancelled_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_coordination_information_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_information_requester_fkey" FOREIGN KEY ("requester_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_information_recipient_fkey" FOREIGN KEY ("recipient_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_information_status_check" CHECK ("status" IN ('OPEN','ANSWERED','CANCELLED')),
  CONSTRAINT "vs_coordination_information_text_check" CHECK (length(btrim("question")) BETWEEN 1 AND 1000 AND ("response_text" IS NULL OR length(btrim("response_text")) BETWEEN 1 AND 1000)),
  CONSTRAINT "vs_coordination_information_state_check" CHECK (("status"='OPEN' AND "response_text" IS NULL AND "answered_at" IS NULL AND "cancelled_at" IS NULL) OR ("status"='ANSWERED' AND "response_text" IS NOT NULL AND "answered_at" IS NOT NULL AND "cancelled_at" IS NULL) OR ("status"='CANCELLED' AND "answered_at" IS NULL AND "cancelled_at" IS NOT NULL)),
  CONSTRAINT "vs_coordination_information_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_coordination_information_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE UNIQUE INDEX "vs_coordination_information_one_open_key" ON "vs_coordination_information_request"("organization_id","school_id","request_id") WHERE "status"='OPEN';
CREATE INDEX "vs_coordination_information_request_idx" ON "vs_coordination_information_request"("organization_id","school_id","request_id","status","requested_at" DESC);
CREATE INDEX "vs_coordination_information_recipient_idx" ON "vs_coordination_information_request"("organization_id","school_id","recipient_account_id","status","response_due_at");
COMMENT ON TABLE "vs_coordination_information_request" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=coordination; scope=organization_id,school_id; closureGate=TEN-03';
