ALTER TABLE "vs_requests_category"
  ADD COLUMN "appeal_reviewer_account_id" uuid,
  ADD CONSTRAINT "vs_requests_category_appeal_reviewer_fkey" FOREIGN KEY ("appeal_reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_requests_category" DROP CONSTRAINT "vs_requests_category_separation_check";
ALTER TABLE "vs_requests_category" ADD CONSTRAINT "vs_requests_category_separation_check" CHECK (
  "reviewer_account_id" <> "steward_account_id"
  AND ("appeal_reviewer_account_id" IS NULL OR (
    "appeal_reviewer_account_id" <> "reviewer_account_id"
    AND "appeal_reviewer_account_id" <> "steward_account_id"
  ))
);
CREATE INDEX "vs_requests_category_appeal_reviewer_idx" ON "vs_requests_category"("organization_id","school_id","appeal_reviewer_account_id","status");

ALTER TABLE "vs_requests_case"
  ADD COLUMN "acknowledged_at" timestamptz(3),
  ADD COLUMN "investigation_owner_account_id" uuid,
  ADD COLUMN "review_due_on" date,
  ADD COLUMN "appeal_deadline_at" timestamptz(3),
  ADD CONSTRAINT "vs_requests_case_investigation_owner_fkey" FOREIGN KEY ("investigation_owner_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_requests_case" DROP CONSTRAINT "vs_requests_case_state_check";
ALTER TABLE "vs_requests_case" ADD CONSTRAINT "vs_requests_case_state_check" CHECK ("state" IN ('SUBMITTED','APPEALED','UNDER_REVIEW','WAITING_INFORMATION','APPROVED','DECLINED','WITHDRAWN'));
ALTER TABLE "vs_requests_case" DROP CONSTRAINT "vs_requests_case_closed_check";
ALTER TABLE "vs_requests_case" ADD CONSTRAINT "vs_requests_case_closed_check" CHECK (
  ("state" IN ('APPROVED','DECLINED','WITHDRAWN') AND "closed_at" IS NOT NULL)
  OR ("state" IN ('SUBMITTED','APPEALED','UNDER_REVIEW','WAITING_INFORMATION') AND "closed_at" IS NULL)
);
ALTER TABLE "vs_requests_case" ADD CONSTRAINT "vs_requests_case_review_checkpoint_check" CHECK (
  ("acknowledged_at" IS NULL AND "investigation_owner_account_id" IS NULL AND "review_due_on" IS NULL)
  OR ("acknowledged_at" IS NOT NULL AND "investigation_owner_account_id" IS NOT NULL AND "review_due_on" IS NOT NULL)
);
ALTER TABLE "vs_requests_case" ADD CONSTRAINT "vs_requests_case_appeal_deadline_check" CHECK (
  "appeal_deadline_at" IS NULL OR "kind"='FAMILY_COMPLAINT'
);

CREATE TABLE "vs_requests_case_event" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "case_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "type" varchar(24) NOT NULL,
  "reason" varchar(1000),
  "review_due_on" date,
  "case_version" integer NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_requests_case_event_case_fkey" FOREIGN KEY ("organization_id","school_id","case_id") REFERENCES "vs_requests_case"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_event_type_check" CHECK ("type" IN ('ACKNOWLEDGED','APPEALED')),
  CONSTRAINT "vs_requests_case_event_shape_check" CHECK (
    ("type"='ACKNOWLEDGED' AND "review_due_on" IS NOT NULL AND "reason" IS NULL)
    OR ("type"='APPEALED' AND "review_due_on" IS NULL AND length(btrim("reason")) BETWEEN 1 AND 1000)
  ),
  CONSTRAINT "vs_requests_case_event_version_check" CHECK ("case_version" > 0),
  CONSTRAINT "vs_requests_case_event_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE INDEX "vs_requests_case_event_case_idx" ON "vs_requests_case_event"("organization_id","school_id","case_id","occurred_at" DESC);
CREATE TRIGGER "vs_requests_case_event_immutable" BEFORE UPDATE OR DELETE ON "vs_requests_case_event" FOR EACH ROW EXECUTE FUNCTION public.vs_requests_immutable_row();
COMMENT ON TABLE "vs_requests_case_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=requests; scope=organization_id,school_id; closureGate=TEN-03';
