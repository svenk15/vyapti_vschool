CREATE TABLE "vs_academics_course_offering" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "year_id" UUID NOT NULL,
  "section_id" UUID NOT NULL,
  "subject_id" UUID NOT NULL,
  "code" VARCHAR(40) NOT NULL,
  "version" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL,
  CONSTRAINT "vs_academics_course_offering_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_academics_course_offering_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_academics_course_offering_code_key" UNIQUE ("organization_id","school_id","year_id","code"),
  CONSTRAINT "vs_academics_course_offering_section_subject_key" UNIQUE ("organization_id","school_id","year_id","section_id","subject_id"),
  CONSTRAINT "vs_academics_course_offering_year_fkey" FOREIGN KEY ("organization_id","school_id","year_id") REFERENCES "vs_academics_academic_year"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_course_offering_section_fkey" FOREIGN KEY ("organization_id","school_id","section_id","year_id") REFERENCES "vs_academics_section"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_course_offering_subject_fkey" FOREIGN KEY ("organization_id","school_id","subject_id") REFERENCES "vs_academics_subject"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_course_offering_version_check" CHECK ("version">0),
  CONSTRAINT "vs_academics_course_offering_code_check" CHECK ("code" ~ '^[A-Z0-9][A-Z0-9_-]{0,39}$')
);
CREATE TABLE "vs_academics_teacher_assignment" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "offering_id" UUID NOT NULL,
  "teacher_id" UUID NOT NULL,
  "valid_from" DATE NOT NULL,
  "valid_to" DATE NOT NULL,
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_academics_teacher_assignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_academics_teacher_assignment_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_academics_teacher_assignment_offering_fkey" FOREIGN KEY ("organization_id","school_id","offering_id") REFERENCES "vs_academics_course_offering"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_teacher_assignment_teacher_fkey" FOREIGN KEY ("organization_id","school_id","teacher_id") REFERENCES "vs_academics_teacher"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_teacher_assignment_range_check" CHECK ("valid_from"<"valid_to"),
  CONSTRAINT "vs_academics_teacher_assignment_version_check" CHECK ("version">0)
);
CREATE INDEX "vs_academics_teacher_assignment_offering_date_idx" ON "vs_academics_teacher_assignment"("organization_id","school_id","offering_id","valid_from","valid_to");
CREATE INDEX "vs_academics_teacher_assignment_teacher_date_idx" ON "vs_academics_teacher_assignment"("organization_id","school_id","teacher_id","valid_from","valid_to");
