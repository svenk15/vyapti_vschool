CREATE TABLE "vs_attendance_pupil_review_grant" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "granted_by_operator_id" uuid NOT NULL,
  "granted_at" timestamptz(3) NOT NULL,
  "revoked_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_attendance_pupil_review_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_attendance_pupil_review_grant_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_attendance_pupil_review_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_attendance_pupil_review_grant_scope_account_student_key" UNIQUE ("organization_id","school_id","account_id","student_id")
);
CREATE INDEX "vs_attendance_pupil_review_grant_active_idx" ON "vs_attendance_pupil_review_grant"("organization_id","school_id","account_id","revoked_at","student_id");
COMMENT ON TABLE "vs_attendance_pupil_review_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';

CREATE TABLE "vs_attendance_pupil_review_snapshot" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "grant_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "from_date" date NOT NULL,
  "to_date" date NOT NULL,
  "threshold" integer NOT NULL,
  "evidence_hash" char(64) NOT NULL,
  "facts" jsonb NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  "version" integer NOT NULL,
  CONSTRAINT "vs_attendance_pupil_review_snapshot_grant_fkey" FOREIGN KEY ("grant_id") REFERENCES "vs_attendance_pupil_review_grant"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_attendance_pupil_review_snapshot_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_attendance_pupil_review_snapshot_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_attendance_pupil_review_snapshot_window_check" CHECK ("from_date" <= "to_date" AND "to_date" - "from_date" BETWEEN 0 AND 89),
  CONSTRAINT "vs_attendance_pupil_review_snapshot_threshold_check" CHECK ("threshold" BETWEEN 1 AND 90),
  CONSTRAINT "vs_attendance_pupil_review_snapshot_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_attendance_pupil_review_snapshot_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE INDEX "vs_attendance_pupil_review_snapshot_actor_idx" ON "vs_attendance_pupil_review_snapshot"("organization_id","school_id","actor_account_id","created_at" DESC);
CREATE FUNCTION public.vs_attendance_pupil_review_snapshot_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'attendance pupil review snapshots are immutable';
END;
$$;
CREATE TRIGGER "vs_attendance_pupil_review_snapshot_immutable" BEFORE UPDATE OR DELETE ON "vs_attendance_pupil_review_snapshot" FOR EACH ROW EXECUTE FUNCTION public.vs_attendance_pupil_review_snapshot_immutable();
COMMENT ON TABLE "vs_attendance_pupil_review_snapshot" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=attendance; scope=organization_id,school_id; closureGate=TEN-03';
