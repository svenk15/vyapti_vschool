CREATE TABLE "vs_students_access_manager_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_students_access_manager_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_students_access_manager_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_students_access_manager_grant_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_access_manager_grant_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id", "account_id") REFERENCES "vs_access_school_membership"("organization_id", "school_id", "id", "account_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_access_manager_grant_scope_account_key" UNIQUE ("organization_id", "school_id", "account_id")
);
CREATE INDEX "vs_students_access_manager_grant_active_idx" ON "vs_students_access_manager_grant"("organization_id", "school_id", "account_id", "revoked_at");

CREATE TABLE "vs_students_portal_access" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "normalized_email" VARCHAR(254) NOT NULL,
  "account_id" UUID,
  "authorized_by_account_id" UUID NOT NULL,
  "authorized_at" TIMESTAMPTZ(3) NOT NULL,
  "accepted_at" TIMESTAMPTZ(3),
  "revoked_at" TIMESTAMPTZ(3),
  "revoked_by_account_id" UUID,
  "revocation_reason" VARCHAR(500),
  "version" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_students_portal_access_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_students_portal_access_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_students_portal_access_email_check" CHECK ("normalized_email" = lower(btrim("normalized_email")) AND char_length("normalized_email") BETWEEN 3 AND 254),
  CONSTRAINT "vs_students_portal_access_state_check" CHECK (("accepted_at" IS NULL OR "account_id" IS NOT NULL) AND (("revoked_at" IS NULL AND "revoked_by_account_id" IS NULL AND "revocation_reason" IS NULL) OR ("revoked_at" IS NOT NULL AND "revoked_by_account_id" IS NOT NULL AND "revocation_reason" IS NOT NULL))),
  CONSTRAINT "vs_students_portal_access_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_access_student_fkey" FOREIGN KEY ("organization_id", "school_id", "student_id") REFERENCES "vs_students_student"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_access_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_access_authorizer_fkey" FOREIGN KEY ("authorized_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_access_revoker_fkey" FOREIGN KEY ("revoked_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_access_scope_id_key" UNIQUE ("organization_id", "school_id", "id"),
  CONSTRAINT "vs_students_portal_access_scope_student_key" UNIQUE ("organization_id", "school_id", "id", "student_id")
);
CREATE UNIQUE INDEX "vs_students_portal_access_active_student_key" ON "vs_students_portal_access"("organization_id", "school_id", "student_id") WHERE "revoked_at" IS NULL;
CREATE INDEX "vs_students_portal_access_student_history_idx" ON "vs_students_portal_access"("organization_id", "school_id", "student_id", "authorized_at" DESC);
CREATE INDEX "vs_students_portal_access_account_idx" ON "vs_students_portal_access"("account_id", "revoked_at", "organization_id", "school_id");

CREATE TABLE "vs_students_portal_purpose_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "purpose" VARCHAR(40) NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_students_portal_purpose_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_students_portal_purpose_grant_purpose_check" CHECK ("purpose" IN ('profile.read_self', 'attendance.read_self', 'timetable.read_self')),
  CONSTRAINT "vs_students_portal_purpose_grant_access_fkey" FOREIGN KEY ("organization_id", "school_id", "access_id", "student_id") REFERENCES "vs_students_portal_access"("organization_id", "school_id", "id", "student_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_purpose_grant_access_purpose_key" UNIQUE ("access_id", "purpose")
);
CREATE INDEX "vs_students_portal_purpose_grant_lookup_idx" ON "vs_students_portal_purpose_grant"("organization_id", "school_id", "student_id", "purpose");

CREATE TABLE "vs_students_portal_invitation" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "intended_account_id" UUID NOT NULL,
  "token_hash" CHAR(64) NOT NULL,
  "delivery_status" VARCHAR(24) NOT NULL,
  "delivered_at" TIMESTAMPTZ(3),
  "delivery_failed_at" TIMESTAMPTZ(3),
  "delivery_failure_reason" VARCHAR(120),
  "created_by_account_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "expires_at" TIMESTAMPTZ(3) NOT NULL,
  "accepted_at" TIMESTAMPTZ(3),
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_students_portal_invitation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_students_portal_invitation_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_students_portal_invitation_dates_check" CHECK ("expires_at" > "created_at" AND ("delivered_at" IS NULL OR "delivered_at" >= "created_at") AND ("delivery_failed_at" IS NULL OR "delivery_failed_at" >= "created_at") AND ("accepted_at" IS NULL OR "accepted_at" >= "created_at") AND ("revoked_at" IS NULL OR "revoked_at" >= "created_at")),
  CONSTRAINT "vs_students_portal_invitation_delivery_check" CHECK (("delivery_status" = 'PENDING_DELIVERY' AND "delivered_at" IS NULL AND "delivery_failed_at" IS NULL) OR ("delivery_status" = 'SENT' AND "delivered_at" IS NOT NULL AND "delivery_failed_at" IS NULL) OR ("delivery_status" = 'FAILED' AND "delivered_at" IS NULL AND "delivery_failed_at" IS NOT NULL) OR ("delivery_status" = 'NOT_APPLICABLE' AND "delivered_at" IS NULL AND "delivery_failed_at" IS NULL)),
  CONSTRAINT "vs_students_portal_invitation_access_fkey" FOREIGN KEY ("organization_id", "school_id", "access_id") REFERENCES "vs_students_portal_access"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_invitation_account_fkey" FOREIGN KEY ("intended_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_invitation_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_students_portal_invitation_token_hash_key" UNIQUE ("token_hash")
);
CREATE INDEX "vs_students_portal_invitation_access_idx" ON "vs_students_portal_invitation"("organization_id", "school_id", "access_id", "created_at" DESC);
CREATE INDEX "vs_students_portal_invitation_account_expiry_idx" ON "vs_students_portal_invitation"("intended_account_id", "expires_at");

COMMENT ON TABLE "vs_students_access_manager_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=students; scope=organization_id,school_id; closureGate=TEN-03; application authorization remains active.';
COMMENT ON TABLE "vs_students_portal_access" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=students; scope=organization_id,school_id; closureGate=TEN-03; application authorization remains active.';
COMMENT ON TABLE "vs_students_portal_purpose_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=students; scope=organization_id,school_id; closureGate=TEN-03; application authorization remains active.';
COMMENT ON TABLE "vs_students_portal_invitation" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=students; scope=organization_id,school_id; closureGate=TEN-03; application authorization remains active.';
