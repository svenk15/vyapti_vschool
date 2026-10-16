CREATE TABLE "vs_learning_assignment_draft" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "assignment_version_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "student_access_id" UUID NOT NULL,
  "status" VARCHAR(16) NOT NULL,
  "version" INTEGER NOT NULL,
  "response_text" VARCHAR(10000) NOT NULL,
  "saved_at" TIMESTAMPTZ(3) NOT NULL,
  "submitted_at" TIMESTAMPTZ(3),
  CONSTRAINT "vs_learning_assignment_draft_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_assignment_draft_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_assignment_draft_student_key" UNIQUE ("organization_id","school_id","assignment_version_id","student_id"),
  CONSTRAINT "vs_learning_assignment_draft_status_check" CHECK ("status" IN ('ACTIVE','SUBMITTED')),
  CONSTRAINT "vs_learning_assignment_draft_version_check" CHECK ("version" >= 1),
  CONSTRAINT "vs_learning_assignment_draft_text_check" CHECK (char_length("response_text") BETWEEN 1 AND 10000),
  CONSTRAINT "vs_learning_assignment_draft_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_learning_assignment_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_assignment_draft_version_fkey" FOREIGN KEY ("organization_id","school_id","assignment_version_id") REFERENCES "vs_learning_assignment_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_assignment_draft_student_access_fkey" FOREIGN KEY ("organization_id","school_id","student_access_id","student_id") REFERENCES "vs_students_portal_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_learning_assignment_draft_student_idx" ON "vs_learning_assignment_draft"("organization_id","school_id","student_id","saved_at" DESC,"id");
CREATE INDEX "vs_learning_assignment_draft_assignment_idx" ON "vs_learning_assignment_draft"("organization_id","school_id","assignment_version_id","status","id");

CREATE TABLE "vs_learning_submission_attempt" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "assignment_version_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "student_access_id" UUID NOT NULL,
  "draft_id" UUID NOT NULL,
  "attempt_no" INTEGER NOT NULL,
  "response_text" VARCHAR(10000) NOT NULL,
  "effective_due_at" TIMESTAMPTZ(3) NOT NULL,
  "accepted_at" TIMESTAMPTZ(3) NOT NULL,
  "receipt_reference" VARCHAR(40) NOT NULL,
  CONSTRAINT "vs_learning_submission_attempt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_submission_attempt_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_submission_attempt_student_key" UNIQUE ("organization_id","school_id","assignment_version_id","student_id"),
  CONSTRAINT "vs_learning_submission_attempt_receipt_key" UNIQUE ("receipt_reference"),
  CONSTRAINT "vs_learning_submission_attempt_number_check" CHECK ("attempt_no" = 1),
  CONSTRAINT "vs_learning_submission_attempt_text_check" CHECK (char_length("response_text") BETWEEN 1 AND 10000),
  CONSTRAINT "vs_learning_submission_attempt_on_time_check" CHECK ("accepted_at" <= "effective_due_at"),
  CONSTRAINT "vs_learning_submission_attempt_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_learning_assignment_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_submission_attempt_version_fkey" FOREIGN KEY ("organization_id","school_id","assignment_version_id") REFERENCES "vs_learning_assignment_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_submission_attempt_access_fkey" FOREIGN KEY ("organization_id","school_id","student_access_id","student_id") REFERENCES "vs_students_portal_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_submission_attempt_draft_fkey" FOREIGN KEY ("organization_id","school_id","draft_id") REFERENCES "vs_learning_assignment_draft"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_learning_submission_attempt_student_idx" ON "vs_learning_submission_attempt"("organization_id","school_id","student_id","accepted_at" DESC,"id");
CREATE INDEX "vs_learning_submission_attempt_assignment_idx" ON "vs_learning_submission_attempt"("organization_id","school_id","assignment_version_id","accepted_at" DESC,"id");
CREATE TRIGGER vs_learning_submission_attempt_immutable BEFORE UPDATE OR DELETE ON "vs_learning_submission_attempt" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_immutable_change();

COMMENT ON TABLE "vs_learning_assignment_draft" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_learning_submission_attempt" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
