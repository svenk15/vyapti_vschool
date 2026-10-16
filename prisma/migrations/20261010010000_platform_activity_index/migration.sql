CREATE INDEX "vs_platform_audit_entry_activity_idx"
ON "vs_platform_audit_entry" ("organization_id", "school_id", "occurred_at" DESC, "id" DESC);
