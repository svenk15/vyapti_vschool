CREATE TABLE "vs_guardians_access_manager_grant" (
  "id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "granted_by_operator_id" uuid NOT NULL,
  "granted_at" timestamptz(3) NOT NULL,
  "revoked_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_guardians_access_manager_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_guardians_manager_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_guardians_manager_grant_dates_check" CHECK ("revoked_at" IS NULL OR "revoked_at" >= "granted_at"),
  CONSTRAINT "vs_guardians_manager_grant_scope_account_key" UNIQUE ("organization_id", "school_id", "account_id"),
  CONSTRAINT "vs_guardians_manager_grant_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_manager_grant_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id", "account_id") REFERENCES "vs_access_school_membership"("organization_id", "school_id", "id", "account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_guardians_manager_grant_active_idx" ON "vs_guardians_access_manager_grant" ("organization_id", "school_id", "account_id", "revoked_at");

CREATE TABLE "vs_guardians_child_access" (
  "id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "display_name" varchar(160) NOT NULL,
  "normalized_email" varchar(254) NOT NULL,
  "account_id" uuid,
  "person_id" uuid,
  "authorized_by_account_id" uuid NOT NULL,
  "authorized_at" timestamptz(3) NOT NULL,
  "access_from" date NOT NULL,
  "accepted_at" timestamptz(3),
  "revoked_at" timestamptz(3),
  "revoked_by_account_id" uuid,
  "revocation_reason" varchar(500),
  "version" integer NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_guardians_child_access_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_guardians_child_access_scope_id_key" UNIQUE ("organization_id", "school_id", "id"),
  CONSTRAINT "vs_guardians_child_access_scope_student_key" UNIQUE ("organization_id", "school_id", "id", "student_id"),
  CONSTRAINT "vs_guardians_child_access_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_guardians_child_access_acceptance_check" CHECK (("account_id" IS NULL AND "person_id" IS NULL AND "accepted_at" IS NULL) OR ("account_id" IS NOT NULL AND "person_id" IS NOT NULL AND "accepted_at" IS NOT NULL)),
  CONSTRAINT "vs_guardians_child_access_revocation_check" CHECK (("revoked_at" IS NULL AND "revoked_by_account_id" IS NULL AND "revocation_reason" IS NULL) OR ("revoked_at" IS NOT NULL AND "revoked_by_account_id" IS NOT NULL AND char_length("revocation_reason") BETWEEN 5 AND 500)),
  CONSTRAINT "vs_guardians_child_access_dates_check" CHECK (("accepted_at" IS NULL OR "accepted_at" >= "authorized_at") AND ("revoked_at" IS NULL OR "revoked_at" >= "authorized_at")),
  CONSTRAINT "vs_guardians_child_access_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_child_access_student_fkey" FOREIGN KEY ("organization_id", "school_id", "student_id") REFERENCES "vs_students_student"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_child_access_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_child_access_person_fkey" FOREIGN KEY ("organization_id", "person_id") REFERENCES "vs_people_person"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_child_access_authorizer_fkey" FOREIGN KEY ("authorized_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_child_access_revoker_fkey" FOREIGN KEY ("revoked_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_guardians_child_access_active_email_key" ON "vs_guardians_child_access" ("organization_id", "school_id", "student_id", "normalized_email") WHERE "revoked_at" IS NULL;
CREATE INDEX "vs_guardians_child_access_student_history_idx" ON "vs_guardians_child_access" ("organization_id", "school_id", "student_id", "authorized_at" DESC);
CREATE INDEX "vs_guardians_child_access_account_idx" ON "vs_guardians_child_access" ("account_id", "revoked_at", "organization_id", "school_id");

CREATE TABLE "vs_guardians_purpose_grant" (
  "id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "access_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "purpose" varchar(40) NOT NULL,
  "granted_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_guardians_purpose_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_guardians_purpose_grant_access_purpose_key" UNIQUE ("access_id", "purpose"),
  CONSTRAINT "vs_guardians_purpose_grant_purpose_check" CHECK ("purpose" IN ('child.summary.read', 'attendance.read_child', 'timetable.read_child')),
  CONSTRAINT "vs_guardians_purpose_grant_access_fkey" FOREIGN KEY ("organization_id", "school_id", "access_id", "student_id") REFERENCES "vs_guardians_child_access"("organization_id", "school_id", "id", "student_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_guardians_purpose_grant_lookup_idx" ON "vs_guardians_purpose_grant" ("organization_id", "school_id", "student_id", "purpose");

CREATE TABLE "vs_guardians_invitation" (
  "id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "access_id" uuid NOT NULL,
  "intended_account_id" uuid NOT NULL,
  "token_hash" char(64) NOT NULL,
  "delivery_status" varchar(24) NOT NULL,
  "delivered_at" timestamptz(3),
  "delivery_failed_at" timestamptz(3),
  "delivery_failure_reason" varchar(120),
  "created_by_account_id" uuid NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  "expires_at" timestamptz(3) NOT NULL,
  "accepted_at" timestamptz(3),
  "revoked_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_guardians_invitation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_guardians_invitation_token_hash_key" UNIQUE ("token_hash"),
  CONSTRAINT "vs_guardians_invitation_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_guardians_invitation_delivery_check" CHECK ("delivery_status" IN ('PENDING_DELIVERY', 'SENT', 'FAILED', 'NOT_APPLICABLE')),
  CONSTRAINT "vs_guardians_invitation_expiry_check" CHECK ("expires_at" > "created_at"),
  CONSTRAINT "vs_guardians_invitation_delivery_evidence_check" CHECK (("delivery_status" = 'SENT' AND "delivered_at" IS NOT NULL AND "delivery_failed_at" IS NULL AND "delivery_failure_reason" IS NULL) OR ("delivery_status" = 'FAILED' AND "delivered_at" IS NULL AND "delivery_failed_at" IS NOT NULL AND "delivery_failure_reason" IS NOT NULL) OR ("delivery_status" IN ('PENDING_DELIVERY', 'NOT_APPLICABLE') AND "delivered_at" IS NULL AND "delivery_failed_at" IS NULL AND "delivery_failure_reason" IS NULL)),
  CONSTRAINT "vs_guardians_invitation_access_fkey" FOREIGN KEY ("organization_id", "school_id", "access_id") REFERENCES "vs_guardians_child_access"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_invitation_account_fkey" FOREIGN KEY ("intended_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_guardians_invitation_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_guardians_invitation_access_idx" ON "vs_guardians_invitation" ("organization_id", "school_id", "access_id", "created_at" DESC);
CREATE INDEX "vs_guardians_invitation_account_expiry_idx" ON "vs_guardians_invitation" ("intended_account_id", "expires_at");

COMMENT ON TABLE "vs_guardians_access_manager_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_guardians_child_access" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_guardians_purpose_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_guardians_invitation" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
