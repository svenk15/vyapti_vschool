CREATE TABLE "vs_learning_feedback" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "submission_id" UUID NOT NULL,
  "reviewer_teacher_id" UUID NOT NULL,
  "revision" INTEGER NOT NULL,
  "draft_strength_text" VARCHAR(4000),
  "draft_next_step_text" VARCHAR(4000),
  "current_version_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_learning_feedback_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_feedback_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_feedback_submission_key" UNIQUE ("organization_id","school_id","submission_id"),
  CONSTRAINT "vs_learning_feedback_current_version_key" UNIQUE ("organization_id","school_id","current_version_id"),
  CONSTRAINT "vs_learning_feedback_revision_check" CHECK ("revision" >= 1),
  CONSTRAINT "vs_learning_feedback_draft_pair_check" CHECK (("draft_strength_text" IS NULL AND "draft_next_step_text" IS NULL) OR (char_length("draft_strength_text") BETWEEN 1 AND 4000 AND char_length("draft_next_step_text") BETWEEN 1 AND 4000)),
  CONSTRAINT "vs_learning_feedback_submission_fkey" FOREIGN KEY ("organization_id","school_id","submission_id") REFERENCES "vs_learning_submission_attempt"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_feedback_reviewer_fkey" FOREIGN KEY ("organization_id","school_id","reviewer_teacher_id") REFERENCES "vs_academics_teacher"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_learning_feedback_reviewer_idx" ON "vs_learning_feedback"("organization_id","school_id","reviewer_teacher_id","updated_at" DESC,"id");

CREATE TABLE "vs_learning_feedback_version" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "feedback_id" UUID NOT NULL,
  "submission_id" UUID NOT NULL,
  "version_no" INTEGER NOT NULL,
  "strength_text" VARCHAR(4000) NOT NULL,
  "next_step_text" VARCHAR(4000) NOT NULL,
  "published_by_account_id" UUID NOT NULL,
  "published_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_learning_feedback_version_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_feedback_version_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_feedback_version_number_key" UNIQUE ("organization_id","school_id","feedback_id","version_no"),
  CONSTRAINT "vs_learning_feedback_version_number_check" CHECK ("version_no" >= 1),
  CONSTRAINT "vs_learning_feedback_version_strength_check" CHECK (char_length("strength_text") BETWEEN 1 AND 4000),
  CONSTRAINT "vs_learning_feedback_version_next_step_check" CHECK (char_length("next_step_text") BETWEEN 1 AND 4000),
  CONSTRAINT "vs_learning_feedback_version_feedback_fkey" FOREIGN KEY ("organization_id","school_id","feedback_id") REFERENCES "vs_learning_feedback"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_feedback_version_submission_fkey" FOREIGN KEY ("organization_id","school_id","submission_id") REFERENCES "vs_learning_submission_attempt"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_feedback_version_publisher_fkey" FOREIGN KEY ("published_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_learning_feedback_version_submission_idx" ON "vs_learning_feedback_version"("organization_id","school_id","submission_id","published_at" DESC,"id");

ALTER TABLE "vs_learning_feedback" ADD CONSTRAINT "vs_learning_feedback_current_version_fkey" FOREIGN KEY ("organization_id","school_id","current_version_id") REFERENCES "vs_learning_feedback_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE TRIGGER vs_learning_feedback_version_immutable BEFORE UPDATE OR DELETE ON "vs_learning_feedback_version" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_immutable_change();

COMMENT ON TABLE "vs_learning_feedback" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_learning_feedback_version" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
