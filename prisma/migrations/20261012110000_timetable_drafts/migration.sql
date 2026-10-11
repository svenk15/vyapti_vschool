ALTER TABLE "vs_academics_teacher_assignment" ADD CONSTRAINT "vs_academics_teacher_assignment_scope_offering_key" UNIQUE ("organization_id","school_id","id","offering_id");

CREATE TABLE "vs_academics_timetable_revision" (
 "id" uuid NOT NULL,"organization_id" uuid NOT NULL,"school_id" uuid NOT NULL,"academic_year_id" uuid NOT NULL,"day_pattern_id" uuid NOT NULL,
 "revision_no" integer NOT NULL,"state" varchar(16) NOT NULL,"effective_from" date NOT NULL,"version" integer NOT NULL,
 "created_at" timestamptz(3) NOT NULL,"created_by_account_id" uuid NOT NULL,"updated_at" timestamptz(3) NOT NULL,
 CONSTRAINT "vs_academics_timetable_revision_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_academics_timetable_revision_state_check" CHECK ("state" IN ('DRAFT','DISCARDED')),
 CONSTRAINT "vs_academics_timetable_revision_number_check" CHECK ("revision_no">0),
 CONSTRAINT "vs_academics_timetable_revision_version_check" CHECK ("version">0),
 CONSTRAINT "vs_academics_timetable_revision_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_revision_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_revision_year_fkey" FOREIGN KEY ("organization_id","school_id","academic_year_id") REFERENCES "vs_academics_academic_year"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_revision_pattern_fkey" FOREIGN KEY ("organization_id","school_id","day_pattern_id") REFERENCES "vs_academics_day_pattern"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_revision_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_revision_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE UNIQUE INDEX "vs_academics_timetable_revision_one_draft_key" ON "vs_academics_timetable_revision"("organization_id","school_id","academic_year_id") WHERE "state"='DRAFT';
CREATE INDEX "vs_academics_timetable_revision_context_idx" ON "vs_academics_timetable_revision"("organization_id","school_id","academic_year_id","state","updated_at" DESC);

CREATE TABLE "vs_academics_timetable_slot" (
 "id" uuid NOT NULL,"organization_id" uuid NOT NULL,"school_id" uuid NOT NULL,"revision_id" uuid NOT NULL,"slot_key" uuid NOT NULL,
 "academic_year_id" uuid NOT NULL,"day_pattern_id" uuid NOT NULL,"class_section_id" uuid NOT NULL,"subject_offering_id" uuid NOT NULL,"teacher_assignment_id" uuid NOT NULL,
 "day_of_week" smallint NOT NULL,"period_key" uuid NOT NULL,"position" smallint NOT NULL,
 CONSTRAINT "vs_academics_timetable_slot_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_academics_timetable_slot_day_check" CHECK ("day_of_week" BETWEEN 1 AND 7),
 CONSTRAINT "vs_academics_timetable_slot_position_check" CHECK ("position">0),
 CONSTRAINT "vs_academics_timetable_slot_revision_fkey" FOREIGN KEY ("organization_id","school_id","revision_id") REFERENCES "vs_academics_timetable_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_slot_section_fkey" FOREIGN KEY ("organization_id","school_id","class_section_id","academic_year_id") REFERENCES "vs_academics_section"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_slot_offering_fkey" FOREIGN KEY ("organization_id","school_id","subject_offering_id") REFERENCES "vs_academics_course_offering"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_slot_assignment_fkey" FOREIGN KEY ("organization_id","school_id","teacher_assignment_id","subject_offering_id") REFERENCES "vs_academics_teacher_assignment"("organization_id","school_id","id","offering_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_slot_period_fkey" FOREIGN KEY ("organization_id","school_id","day_pattern_id","period_key") REFERENCES "vs_academics_day_period"("organization_id","school_id","day_pattern_id","period_key") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_timetable_slot_key_key" UNIQUE ("organization_id","school_id","revision_id","slot_key"),
 CONSTRAINT "vs_academics_timetable_slot_cell_key" UNIQUE ("organization_id","school_id","revision_id","class_section_id","day_of_week","period_key")
);
CREATE INDEX "vs_academics_timetable_slot_class_week_idx" ON "vs_academics_timetable_slot"("organization_id","school_id","revision_id","class_section_id","day_of_week","position");
COMMENT ON TABLE "vs_academics_timetable_revision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_academics_timetable_slot" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
