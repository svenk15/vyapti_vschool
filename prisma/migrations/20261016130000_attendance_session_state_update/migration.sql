ALTER TABLE "vs_attendance_session"
ADD COLUMN "state_updated_at" TIMESTAMPTZ(3);

UPDATE "vs_attendance_session"
SET "state_updated_at" = COALESCE("cancelled_at", "submitted_at", "opened_at")
WHERE COALESCE("cancelled_at", "submitted_at", "opened_at") IS NOT NULL;

UPDATE "vs_attendance_session" AS session
SET "state_updated_at" = receipt."created_at"
FROM "vs_tenancy_tenant_command_receipt" AS receipt
WHERE session."state_updated_at" IS NULL
  AND receipt."organization_id" = session."organization_id"
  AND receipt."command" = 'AttendanceSessionScheduled'
  AND receipt."response" ->> 'id' = session."id"::text;

COMMENT ON COLUMN "vs_attendance_session"."state_updated_at" IS
'Attendance-owned lifecycle freshness. NULL means trustworthy legacy source evidence is unavailable.';
