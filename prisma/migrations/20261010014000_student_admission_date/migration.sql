ALTER TABLE "vs_students_student"
  ADD COLUMN "admitted_on" date,
  ADD COLUMN "admission_date_verified_at" timestamptz(3),
  ADD COLUMN "admission_date_verified_by" uuid,
  ADD COLUMN "admission_date_verification_reason" varchar(500);

ALTER TABLE "vs_students_student"
  ADD CONSTRAINT "vs_students_student_admission_date_evidence_check"
  CHECK (
    ("admission_date_verified_at" IS NULL AND "admission_date_verified_by" IS NULL AND "admission_date_verification_reason" IS NULL)
    OR
    ("admitted_on" IS NOT NULL AND "admission_date_verified_at" IS NOT NULL AND "admission_date_verified_by" IS NOT NULL AND length(btrim("admission_date_verification_reason")) BETWEEN 5 AND 500)
  ),
  ADD CONSTRAINT "vs_students_student_admission_date_verified_by_fkey"
  FOREIGN KEY ("admission_date_verified_by") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
