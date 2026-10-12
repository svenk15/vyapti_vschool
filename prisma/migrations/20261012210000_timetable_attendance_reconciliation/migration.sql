CREATE TABLE "vs_academics_lesson_occurrence" (
 "id" uuid NOT NULL,
 "organization_id" uuid NOT NULL,
 "school_id" uuid NOT NULL,
 "academic_year_id" uuid NOT NULL,
 "class_section_id" uuid NOT NULL,
 "local_date" date NOT NULL,
 "period_key" uuid NOT NULL,
 "source_revision_id" uuid NOT NULL,
 "source_slot_key" uuid NOT NULL,
 "starts_at" timestamptz(3) NOT NULL,
 "ends_at" timestamptz(3) NOT NULL,
 "subject_offering_id" uuid NOT NULL,
 "effective_teacher_assignment_id" uuid NOT NULL,
 "state" varchar(20) NOT NULL,
 "generation_revision" integer NOT NULL,
 "last_outcome" varchar(40) NOT NULL,
 "last_error_code" varchar(80),
 "version" integer NOT NULL,
 "created_at" timestamptz(3) NOT NULL,
 "updated_at" timestamptz(3) NOT NULL,
 CONSTRAINT "vs_academics_lesson_occurrence_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_academics_lesson_occurrence_scope_id_key" UNIQUE ("organization_id","school_id","id"),
 CONSTRAINT "vs_academics_lesson_occurrence_stable_key" UNIQUE ("organization_id","school_id","academic_year_id","class_section_id","local_date","period_key"),
 CONSTRAINT "vs_academics_lesson_occurrence_time_check" CHECK ("starts_at"<"ends_at"),
 CONSTRAINT "vs_academics_lesson_occurrence_state_check" CHECK ("state" IN ('PLANNED','BLOCKED','CANCELLED')),
 CONSTRAINT "vs_academics_lesson_occurrence_outcome_check" CHECK ("last_outcome" IN ('CREATED','ALREADY_RECONCILED','BLOCKED_MANUAL_CONFLICT','BLOCKED_DOMAIN_RULE','FAILED_TECHNICAL')),
 CONSTRAINT "vs_academics_lesson_occurrence_version_check" CHECK ("generation_revision">=1 AND "version">=1),
 CONSTRAINT "vs_academics_lesson_occurrence_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_lesson_occurrence_year_fkey" FOREIGN KEY ("organization_id","school_id","academic_year_id") REFERENCES "vs_academics_academic_year"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_lesson_occurrence_section_fkey" FOREIGN KEY ("organization_id","school_id","class_section_id","academic_year_id") REFERENCES "vs_academics_section"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_lesson_occurrence_revision_fkey" FOREIGN KEY ("organization_id","school_id","source_revision_id") REFERENCES "vs_academics_timetable_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_lesson_occurrence_slot_fkey" FOREIGN KEY ("organization_id","school_id","source_revision_id","source_slot_key") REFERENCES "vs_academics_timetable_slot"("organization_id","school_id","revision_id","slot_key") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_lesson_occurrence_offering_fkey" FOREIGN KEY ("organization_id","school_id","subject_offering_id") REFERENCES "vs_academics_course_offering"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_lesson_occurrence_assignment_fkey" FOREIGN KEY ("organization_id","school_id","effective_teacher_assignment_id","subject_offering_id") REFERENCES "vs_academics_teacher_assignment"("organization_id","school_id","id","offering_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_academics_lesson_occurrence_source_date_idx" ON "vs_academics_lesson_occurrence"("organization_id","school_id","source_revision_id","local_date");
CREATE INDEX "vs_academics_lesson_occurrence_class_date_idx" ON "vs_academics_lesson_occurrence"("organization_id","school_id","class_section_id","local_date","starts_at");

CREATE TABLE "vs_academics_generation_checkpoint" (
 "id" uuid NOT NULL,
 "organization_id" uuid NOT NULL,
 "school_id" uuid NOT NULL,
 "academic_year_id" uuid NOT NULL,
 "source_revision_id" uuid NOT NULL,
 "horizon_from" date NOT NULL,
 "horizon_until" date NOT NULL,
 "cursor_date" date NOT NULL,
 "state" varchar(16) NOT NULL,
 "counts" jsonb NOT NULL,
 "last_error_code" varchar(80),
 "source_command_id" uuid NOT NULL,
 "version" integer NOT NULL,
 "created_at" timestamptz(3) NOT NULL,
 "updated_at" timestamptz(3) NOT NULL,
 CONSTRAINT "vs_academics_generation_checkpoint_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_academics_generation_checkpoint_scope_id_key" UNIQUE ("organization_id","school_id","id"),
 CONSTRAINT "vs_academics_generation_checkpoint_source_key" UNIQUE ("organization_id","school_id","source_revision_id"),
 CONSTRAINT "vs_academics_generation_checkpoint_horizon_check" CHECK ("horizon_from"<="cursor_date" AND "cursor_date"<="horizon_until" AND "horizon_from"<"horizon_until"),
 CONSTRAINT "vs_academics_generation_checkpoint_state_check" CHECK ("state" IN ('PENDING','RUNNING','PARTIAL','COMPLETE','FAILED')),
 CONSTRAINT "vs_academics_generation_checkpoint_version_check" CHECK ("version">=1),
 CONSTRAINT "vs_academics_generation_checkpoint_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_generation_checkpoint_year_fkey" FOREIGN KEY ("organization_id","school_id","academic_year_id") REFERENCES "vs_academics_academic_year"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_generation_checkpoint_revision_fkey" FOREIGN KEY ("organization_id","school_id","source_revision_id") REFERENCES "vs_academics_timetable_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_academics_generation_checkpoint_state_idx" ON "vs_academics_generation_checkpoint"("organization_id","school_id","state","updated_at" DESC);

ALTER TABLE "vs_attendance_session" ADD COLUMN "source_occurrence_id" uuid;
ALTER TABLE "vs_attendance_session" ADD CONSTRAINT "vs_attendance_session_source_occurrence_fkey" FOREIGN KEY ("organization_id","school_id","source_occurrence_id") REFERENCES "vs_academics_lesson_occurrence"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_attendance_session" ADD CONSTRAINT "vs_attendance_session_source_occurrence_key" UNIQUE ("organization_id","school_id","source_occurrence_id");

COMMENT ON TABLE "vs_academics_lesson_occurrence" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_academics_generation_checkpoint" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
