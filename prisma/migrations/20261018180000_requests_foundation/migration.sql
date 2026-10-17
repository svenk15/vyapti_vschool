CREATE TABLE "vs_requests_category" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "reviewer_account_id" uuid NOT NULL,
  "steward_account_id" uuid NOT NULL,
  "code" varchar(40) NOT NULL,
  "kind" varchar(24) NOT NULL,
  "label" varchar(120) NOT NULL,
  "appeal_days" integer NOT NULL,
  "retention_class" varchar(40) NOT NULL,
  "status" varchar(16) NOT NULL,
  "version" integer NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_requests_category_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_category_reviewer_fkey" FOREIGN KEY ("reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_category_steward_fkey" FOREIGN KEY ("steward_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_category_kind_check" CHECK ("kind" IN ('STAFF_OPERATIONAL','FAMILY_COMPLAINT')),
  CONSTRAINT "vs_requests_category_status_check" CHECK ("status" IN ('ACTIVE','INACTIVE')),
  CONSTRAINT "vs_requests_category_code_check" CHECK ("code" IN ('STAFF_AVAILABILITY','CLASSROOM_RESOURCE','FAMILY_COMPLAINT')),
  CONSTRAINT "vs_requests_category_kind_code_check" CHECK (("kind"='STAFF_OPERATIONAL' AND "code" IN ('STAFF_AVAILABILITY','CLASSROOM_RESOURCE')) OR ("kind"='FAMILY_COMPLAINT' AND "code"='FAMILY_COMPLAINT')),
  CONSTRAINT "vs_requests_category_text_check" CHECK (length(btrim("label")) BETWEEN 1 AND 120 AND length(btrim("retention_class")) BETWEEN 1 AND 40),
  CONSTRAINT "vs_requests_category_window_check" CHECK ("appeal_days" BETWEEN 0 AND 90),
  CONSTRAINT "vs_requests_category_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_requests_category_separation_check" CHECK ("reviewer_account_id" <> "steward_account_id"),
  CONSTRAINT "vs_requests_category_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_requests_category_scope_code_key" UNIQUE ("organization_id","school_id","code")
);
CREATE INDEX "vs_requests_category_kind_status_idx" ON "vs_requests_category"("organization_id","school_id","kind","status");
CREATE INDEX "vs_requests_category_reviewer_idx" ON "vs_requests_category"("organization_id","school_id","reviewer_account_id","status");

CREATE TABLE "vs_requests_case" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "category_id" uuid NOT NULL,
  "originator_account_id" uuid NOT NULL,
  "subject_account_id" uuid,
  "implicated_account_id" uuid,
  "reviewer_account_id" uuid NOT NULL,
  "student_id" uuid,
  "kind" varchar(24) NOT NULL,
  "state" varchar(24) NOT NULL,
  "title" varchar(160) NOT NULL,
  "narrative" varchar(4000) NOT NULL,
  "desired_outcome" varchar(1000),
  "public_outcome" varchar(1000),
  "submitted_at" timestamptz(3) NOT NULL,
  "updated_at" timestamptz(3) NOT NULL,
  "closed_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_requests_case_category_fkey" FOREIGN KEY ("organization_id","school_id","category_id") REFERENCES "vs_requests_category"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_originator_fkey" FOREIGN KEY ("originator_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_subject_fkey" FOREIGN KEY ("subject_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_implicated_fkey" FOREIGN KEY ("implicated_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_reviewer_fkey" FOREIGN KEY ("reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_case_kind_check" CHECK ("kind" IN ('STAFF_OPERATIONAL','FAMILY_COMPLAINT')),
  CONSTRAINT "vs_requests_case_state_check" CHECK ("state" IN ('SUBMITTED','WAITING_INFORMATION','APPROVED','DECLINED','WITHDRAWN')),
  CONSTRAINT "vs_requests_case_text_check" CHECK (length(btrim("title")) BETWEEN 1 AND 160 AND length(btrim("narrative")) BETWEEN 1 AND 4000 AND ("desired_outcome" IS NULL OR length(btrim("desired_outcome")) BETWEEN 1 AND 1000) AND ("public_outcome" IS NULL OR length(btrim("public_outcome")) BETWEEN 1 AND 1000)),
  CONSTRAINT "vs_requests_case_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_requests_case_closed_check" CHECK (("state" IN ('APPROVED','DECLINED','WITHDRAWN') AND "closed_at" IS NOT NULL) OR ("state" IN ('SUBMITTED','WAITING_INFORMATION') AND "closed_at" IS NULL)),
  CONSTRAINT "vs_requests_case_participant_check" CHECK (("kind"='STAFF_OPERATIONAL' AND "subject_account_id"="originator_account_id" AND "student_id" IS NULL AND "implicated_account_id" IS NULL) OR ("kind"='FAMILY_COMPLAINT' AND "student_id" IS NOT NULL)),
  CONSTRAINT "vs_requests_case_reviewer_separation_check" CHECK ("reviewer_account_id" <> "originator_account_id" AND ("subject_account_id" IS NULL OR "reviewer_account_id" <> "subject_account_id") AND ("implicated_account_id" IS NULL OR "reviewer_account_id" <> "implicated_account_id")),
  CONSTRAINT "vs_requests_case_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE INDEX "vs_requests_case_reviewer_state_idx" ON "vs_requests_case"("organization_id","school_id","reviewer_account_id","state","updated_at" DESC,"id" DESC);
CREATE INDEX "vs_requests_case_originator_idx" ON "vs_requests_case"("organization_id","school_id","originator_account_id","updated_at" DESC,"id" DESC);
CREATE INDEX "vs_requests_case_student_idx" ON "vs_requests_case"("organization_id","school_id","student_id","updated_at" DESC);

CREATE TABLE "vs_requests_decision" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "case_id" uuid NOT NULL,
  "reviewer_account_id" uuid NOT NULL,
  "number" integer NOT NULL,
  "action" varchar(24) NOT NULL,
  "reason" varchar(1000),
  "result" varchar(40),
  "case_version" integer NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_requests_decision_case_fkey" FOREIGN KEY ("organization_id","school_id","case_id") REFERENCES "vs_requests_case"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_decision_reviewer_fkey" FOREIGN KEY ("reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_decision_action_check" CHECK ("action" IN ('APPROVE','DECLINE','RETURN')),
  CONSTRAINT "vs_requests_decision_reason_check" CHECK (("action"='APPROVE' AND ("reason" IS NULL OR length(btrim("reason")) BETWEEN 1 AND 1000)) OR ("action" IN ('DECLINE','RETURN') AND length(btrim("reason")) BETWEEN 1 AND 1000)),
  CONSTRAINT "vs_requests_decision_result_check" CHECK (("action"='APPROVE' AND "result"='NO_DOWNSTREAM_CHANGE') OR ("action"<>'APPROVE' AND "result" IS NULL)),
  CONSTRAINT "vs_requests_decision_number_check" CHECK ("number" > 0 AND "case_version" > 0),
  CONSTRAINT "vs_requests_decision_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_requests_decision_case_number_key" UNIQUE ("organization_id","school_id","case_id","number")
);
CREATE INDEX "vs_requests_decision_case_idx" ON "vs_requests_decision"("organization_id","school_id","case_id","occurred_at" DESC);

CREATE TABLE "vs_requests_response" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "case_id" uuid NOT NULL,
  "decision_id" uuid NOT NULL,
  "originator_account_id" uuid NOT NULL,
  "response" varchar(2000) NOT NULL,
  "case_version" integer NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_requests_response_case_fkey" FOREIGN KEY ("organization_id","school_id","case_id") REFERENCES "vs_requests_case"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_response_decision_fkey" FOREIGN KEY ("organization_id","school_id","decision_id") REFERENCES "vs_requests_decision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_response_originator_fkey" FOREIGN KEY ("originator_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_response_text_check" CHECK (length(btrim("response")) BETWEEN 1 AND 2000),
  CONSTRAINT "vs_requests_response_version_check" CHECK ("case_version" > 0),
  CONSTRAINT "vs_requests_response_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_requests_response_decision_key" UNIQUE ("organization_id","school_id","decision_id")
);
CREATE INDEX "vs_requests_response_case_idx" ON "vs_requests_response"("organization_id","school_id","case_id","occurred_at" DESC);

CREATE TABLE "vs_requests_command_receipt" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "command" varchar(80) NOT NULL,
  "key" varchar(100) NOT NULL,
  "input_hash" char(64) NOT NULL,
  "case_id" uuid NOT NULL,
  "result" jsonb NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_requests_command_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_command_receipt_case_fkey" FOREIGN KEY ("organization_id","school_id","case_id") REFERENCES "vs_requests_case"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_requests_command_receipt_hash_check" CHECK ("input_hash" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_requests_command_receipt_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_requests_command_receipt_actor_command_key" UNIQUE ("organization_id","school_id","actor_account_id","command","key")
);
CREATE INDEX "vs_requests_command_receipt_case_idx" ON "vs_requests_command_receipt"("organization_id","school_id","case_id","occurred_at" DESC);

CREATE FUNCTION public.vs_requests_immutable_row() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'requests immutable row'; END $$;
CREATE TRIGGER "vs_requests_decision_immutable" BEFORE UPDATE OR DELETE ON "vs_requests_decision" FOR EACH ROW EXECUTE FUNCTION public.vs_requests_immutable_row();
CREATE TRIGGER "vs_requests_response_immutable" BEFORE UPDATE OR DELETE ON "vs_requests_response" FOR EACH ROW EXECUTE FUNCTION public.vs_requests_immutable_row();
CREATE TRIGGER "vs_requests_command_receipt_immutable" BEFORE UPDATE OR DELETE ON "vs_requests_command_receipt" FOR EACH ROW EXECUTE FUNCTION public.vs_requests_immutable_row();

COMMENT ON TABLE "vs_requests_category" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=requests; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_requests_case" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=requests; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_requests_decision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=requests; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_requests_response" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=requests; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_requests_command_receipt" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=requests; scope=organization_id,school_id; closureGate=TEN-03';
