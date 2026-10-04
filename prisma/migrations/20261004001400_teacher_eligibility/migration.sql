-- PER-02 adds Academics-owned teaching eligibility; Path A defers RLS to TEN-03.
CREATE TABLE "vs_academics_teacher" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,
    "version" INTEGER NOT NULL,
    CONSTRAINT "vs_academics_teacher_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "vs_academics_teacher_scope_id_key" ON "vs_academics_teacher"("organization_id", "school_id", "id");
CREATE UNIQUE INDEX "vs_academics_teacher_employee_key" ON "vs_academics_teacher"("organization_id", "school_id", "employee_id");
CREATE INDEX "vs_academics_teacher_eligibility_idx" ON "vs_academics_teacher"("organization_id", "school_id", "active", "employee_id");
ALTER TABLE "vs_academics_teacher" ADD CONSTRAINT "vs_academics_teacher_employee_fkey" FOREIGN KEY ("organization_id", "school_id", "employee_id") REFERENCES "vs_people_employee"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;
